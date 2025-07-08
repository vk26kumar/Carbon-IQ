import { exportCSV } from "@/utils/exportToCSV";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const EmissionBreakdownScreen = () => {
  const router = useRouter();
  const {
    lang,
    vendorId,
    industry,
    exceeded = [],
    tips = [],
    score,
    normalized,
    rating,
    status,
    formData,
  } = useLocalSearchParams();

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();
  }, [lang]);

  const parsedExceeded: string[] = Array.isArray(exceeded)
    ? exceeded.filter((e) => e.trim() !== "")
    : typeof exceeded === "string"
    ? decodeURIComponent(exceeded)
        .split("||")
        .filter((e) => e.trim() !== "")
    : [];

  const parsedTips: string[] = Array.isArray(tips)
    ? tips
    : typeof tips === "string"
    ? decodeURIComponent(tips)
        .split("||")
        .filter((t) => t.trim() !== "")
    : [];

  const parsedFormData = formData ? JSON.parse(formData.toString()) : {};

  const handleCSVDownload = async () => {
    await exportCSV({
      vendorId: vendorId?.toString() ?? "",
      industry: industry?.toString() ?? "",
      formData: parsedFormData,
      score: Number(score),
      normalized: Number(normalized),
      rating: rating?.toString() ?? "",
      status: status?.toString() ?? "",
      tips: parsedTips,
      exceeded: parsedExceeded,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={26} color="#0071CE" />
        </TouchableOpacity>
        <Text style={styles.heading}>{i18n.t("emission_breakdown")}</Text>
      </View>

      <View style={styles.section}>
        <Ionicons name="alert-circle-outline" size={26} style={styles.icon} />
        <Text style={styles.subHeading}>{i18n.t("overused_resources")}</Text>

        {parsedExceeded.length === 0 ? (
          <Text style={styles.emptyText}>{i18n.t("no_overuse_detected")}</Text>
        ) : (
          parsedExceeded.map((item, idx) => {
            const match = item.match(/(.+?) \(.*: ([\d.]+), .*: ([\d.]+)\)/);
            const label = match?.[1] || item;
            const allowed = match?.[2] || "-";
            const used = match?.[3] || "-";

            return (
              <View key={idx} style={styles.overusedRow}>
                <Text style={styles.itemLabel}>• {label}</Text>
                <Text style={styles.itemDetail}>
                  {i18n.t("allowed")}: {allowed}
                </Text>
                <Text style={styles.itemDetail}>
                  {i18n.t("used")}: {used}
                </Text>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.section}>
        <Ionicons name="bulb-outline" size={26} style={styles.icon} />
        <Text style={styles.subHeading}>
          {i18n.t("emission_reduction_tips")}
        </Text>

        {parsedTips.length === 0 ? (
          <Text style={styles.emptyText}>{i18n.t("no_tips_available")}</Text>
        ) : (
          parsedTips.map((tip, idx) => (
            <Text key={idx} style={styles.tipText}>
              ▪ {tip}
            </Text>
          ))
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.csvButton} onPress={handleCSVDownload}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>{i18n.t("download_csv")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            router.push({
              pathname: "/detailAnalysis",
              params: {
                lang,
                vendorId,
                industry,
                formData: JSON.stringify(parsedFormData),
              },
            })
          }
        >
          <Ionicons name="bar-chart-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>{i18n.t("detailed_analysis")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EmissionBreakdownScreen;

// (styles are same as your current code)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFE",
    padding: 24,
    paddingTop: 60,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0071CE",
    marginLeft: 50,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  icon: {
    alignSelf: "center",
    marginBottom: 10,
    color: "#0071CE",
  },
  overusedRow: {
    marginBottom: 10,
    backgroundColor: "#F2F4F7",
    borderRadius: 8,
    padding: 10,
  },
  itemLabel: {
    fontWeight: "600",
    fontSize: 15,
    color: "#333",
  },
  itemDetail: {
    fontSize: 14,
    color: "#444",
    marginLeft: 12,
  },
  tipText: {
    fontSize: 15,
    marginBottom: 6,
    color: "#00796B",
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 40,
    gap: 12,
  },
  csvButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0071CE",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  detailsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0071CE",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
