import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0, 113, 206, ${opacity})`,
  labelColor: () => "#333",
  strokeWidth: 2,
  barPercentage: 0.5,
  decimalPlaces: 2,
};

type HistoryEntry = {
  normalized: number;
  date: string;
};

const DetailAnalysis = () => {
  const { vendorId, industry, lang, formData } = useLocalSearchParams();
  const router = useRouter();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [industryScores, setIndustryScores] = useState<number[]>([]);
  const [lastEntry, setLastEntry] = useState<any>(null);
  const [formValues, setFormValues] = useState<any>(null);

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();
  }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorQuery = query(
          collection(db, "results"),
          where("vendorId", "==", vendorId)
        );
        const vendorSnap = await getDocs(vendorQuery);
        const vendorData = vendorSnap.docs.map((doc) => doc.data());

        const vendorHistory = vendorData.map((entry) => {
          const date =
            typeof entry.createdAt?.toDate === "function"
              ? entry.createdAt.toDate()
              : new Date(entry.createdAt);
          return {
            normalized: entry.normalized,
            date: new Date(date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }),
          };
        });

        setHistory(vendorHistory);
        setLastEntry(vendorData[vendorData.length - 1]);

        const industryQuery = query(
          collection(db, "results"),
          where("industry", "==", industry)
        );
        const industrySnap = await getDocs(industryQuery);
        const industryData = industrySnap.docs.map((doc) => doc.data());
        setIndustryScores(industryData.map((e) => e.normalized));
      } catch (err) {
        console.error("🔥 Error fetching detail analysis data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData) {
      try {
        const parsed = JSON.parse(formData.toString());
        setFormValues(parsed);
      } catch (e) {
        console.warn("⚠️ Invalid formData JSON:", formData);
      }
    }
  }, [formData]);

  const getIndustryFormKeys = () => {
    switch (industry) {
      case "textile":
        return [
          "fabric_produced",
          "electricity_used",
          "water_used",
          "chemicals_used",
          "diesel_used",
        ];
      case "dairy":
        return [
          "milk_produced",
          "cows",
          "electricity_used",
          "fodder_used",
          "diesel_used",
        ];
      case "agriculture":
        return [
          "land_area",
          "fertilizer_used",
          "electricity_used",
          "diesel_used",
          "crop_yield",
        ];
      case "manufacturing":
        return [
          "units_produced",
          "electricity_used",
          "water_used",
          "chemicals_used",
          "diesel_used",
        ];
      default:
        return [];
    }
  };

  const renderPieChart = () => {
    if (!formValues) return null;

    const formKeys = getIndustryFormKeys();
    const data = formKeys
      .map((key, index) => {
        const rawValue = formValues[key];
        const value = parseFloat(rawValue || "0");
        return {
          name: i18n.t(key),
          population: value,
          color: `hsl(${(index * 57) % 360}, 70%, 60%)`,
          legendFontColor: "#333",
          legendFontSize: 12,
        };
      })
      .filter((item) => item.population > 0);

    if (data.length === 0) {
      return (
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>
            {i18n.t("emission_distribution")}
          </Text>
          <Text style={styles.noDataText}>{i18n.t("no_data_available")}</Text>
        </View>
      );
    }

    return (
      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>{i18n.t("emission_distribution")}</Text>
        <PieChart
          data={data}
          width={screenWidth - 70}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="2"
          absolute
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{i18n.t("detailed_analysis")}</Text>

      {renderPieChart()}

      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>{i18n.t("emission_trends")}</Text>
        {history.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={{
                labels: history.map((h) => h.date),
                datasets: [{ data: history.map((h) => h.normalized) }],
              }}
              width={Math.max(screenWidth, history.length * 60)}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{ ...styles.chart, minWidth: screenWidth }}
            />
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>
            {i18n.t("no_vendor_history_data")}
          </Text>
        )}
      </View>

      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>{i18n.t("industry_comparison")}</Text>
        {industryScores.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{
                labels: industryScores.map((_, i) => `V${i + 1}`),
                datasets: [{ data: industryScores }],
              }}
              width={Math.max(screenWidth, industryScores.length * 60)}
              height={250}
              fromZero
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              yAxisLabel=""
              yAxisSuffix=""
            />
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>
            {i18n.t("no_industry_comparison_data")}
          </Text>
        )}
      </View>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => router.push("/message")}
        >
          <Text style={styles.bottomButtonText}>{i18n.t("view_message")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailAnalysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#FAFCFE",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0071CE",
    marginBottom: 20,
    textAlign: "center",
  },
  chartBox: {
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: "#EDEFF1",
    elevation: 2,
    padding: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  chart: {
    borderRadius: 10,
  },
  bottomButtonContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 80,
  },
  bottomButton: {
    backgroundColor: "#0071CE",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  bottomButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  noDataText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    paddingVertical: 10,
  },
});
