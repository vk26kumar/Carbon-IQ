import { exportCSV } from "@/utils/exportToCSV";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmissionBreakdownScreen = () => {
  const router = useRouter();
  const {
    lang,
    vendorId,
    name,
    industry,
    exceeded = [],
    tips = [],
    score,
    normalized,
    rating,
    status,
    formData,
  } = useLocalSearchParams();

  // ── Entrance animations ──
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-18)).current;
  const bodyFade = useRef(new Animated.Value(0)).current;
  const bodySlide = useRef(new Animated.Value(20)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(bodyFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bodySlide, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 950,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 950,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  // ── Parse params ──
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

  const glowSize = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 22],
  });
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.58],
  });

  const hasOveruse = parsedExceeded.length > 0;

  return (
    <LinearGradient
      colors={["#f0fce8", "#e4f7d4", "#d8f2be"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HEADER ── */}
          <Animated.View
            style={{
              opacity: headerFade,
              transform: [{ translateY: headerSlide }],
            }}
          >
            <LinearGradient
              colors={["#ffffff", "#edfadf", "#dff7c8"]}
              style={styles.headerCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerTopRow}>
                <TouchableOpacity
                  onPress={() => router.push("/home")}
                  style={styles.homeBtn}
                >
                  <Ionicons name="home-outline" size={18} color="#4a9a20" />
                </TouchableOpacity>
                <Text style={styles.heading}>
                  {i18n.t("emission_breakdown")}
                </Text>
                <View style={{ width: 36 }} />
              </View>

              {/* Score summary chips */}
              <View style={styles.chipRow}>
                <View style={styles.chip}>
                  <Ionicons name="leaf-outline" size={13} color="#5a8040" />
                  <Text style={styles.chipText}>
                    {Number(score).toFixed(2)} score
                  </Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons
                    name="speedometer-outline"
                    size={13}
                    color="#5a8040"
                  />
                  <Text style={styles.chipText}>
                    {Number(normalized).toFixed(2)} CO₂/unit
                  </Text>
                </View>
                <View
                  style={[
                    styles.chip,
                    hasOveruse
                      ? { backgroundColor: "#fff0f0", borderColor: "#ffb0b0" }
                      : { backgroundColor: "#eaf8d8", borderColor: "#b8e890" },
                  ]}
                >
                  <Ionicons
                    name={
                      hasOveruse
                        ? "alert-circle-outline"
                        : "checkmark-circle-outline"
                    }
                    size={13}
                    color={hasOveruse ? "#e03030" : "#28a048"}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      { color: hasOveruse ? "#e03030" : "#28a048" },
                    ]}
                  >
                    {hasOveruse
                      ? `${parsedExceeded.length} overuse`
                      : "All clear"}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── BODY ── */}
          <Animated.View
            style={{
              opacity: bodyFade,
              transform: [{ translateY: bodySlide }],
              gap: 14,
            }}
          >
            {/* ── OVERUSED RESOURCES ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionRow}>
                <View
                  style={[
                    styles.accentBar,
                    { backgroundColor: hasOveruse ? "#e03030" : "#6ec832" },
                  ]}
                />
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={hasOveruse ? "#e03030" : "#6ec832"}
                />
                <Text style={styles.sectionTitle}>
                  {i18n.t("overused_resources")}
                </Text>
              </View>

              {parsedExceeded.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={32}
                    color="#6ec832"
                  />
                  <Text style={styles.emptyText}>
                    {i18n.t("no_overuse_detected")}
                  </Text>
                </View>
              ) : (
                parsedExceeded.map((item, idx) => {
                  const match = item.match(
                    /(.+?) \(.*: ([\d.]+), .*: ([\d.]+)\)/,
                  );
                  const label = match?.[1] || item;
                  const allowed = match?.[2] || "-";
                  const used = match?.[3] || "-";
                  const pct =
                    allowed !== "-" && used !== "-"
                      ? Math.min((+used / +allowed) * 100, 150)
                      : 0;

                  return (
                    <View key={idx} style={styles.overuseRow}>
                      <View style={styles.overuseLabelRow}>
                        <View style={styles.overuseDot} />
                        <Text style={styles.overuseLabel}>{label}</Text>
                      </View>
                      {/* Mini bar showing used vs allowed */}
                      <View style={styles.overuseBarTrack}>
                        <View
                          style={[
                            styles.overuseBarFill,
                            {
                              width: `${Math.min(pct, 100)}%` as any,
                              backgroundColor:
                                pct > 100 ? "#e03030" : "#f0b429",
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.overuseDetailRow}>
                        <Text style={styles.overuseDetail}>
                          {i18n.t("allowed")}:{" "}
                          <Text style={styles.overuseDetailBold}>
                            {allowed}
                          </Text>
                        </Text>
                        <Text
                          style={[
                            styles.overuseDetail,
                            { color: pct > 100 ? "#e03030" : "#f0b429" },
                          ]}
                        >
                          {i18n.t("used")}:{" "}
                          <Text style={styles.overuseDetailBold}>{used}</Text>
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* ── TIPS ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionRow}>
                <View
                  style={[styles.accentBar, { backgroundColor: "#6ec832" }]}
                />
                <Ionicons name="bulb-outline" size={18} color="#6ec832" />
                <Text style={styles.sectionTitle}>
                  {i18n.t("emission_reduction_tips")}
                </Text>
              </View>

              {parsedTips.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>
                    {i18n.t("no_tips_available")}
                  </Text>
                </View>
              ) : (
                parsedTips.map((tip, idx) => (
                  <View key={idx} style={styles.tipRow}>
                    <LinearGradient
                      colors={["#90d84a", "#6ec832"]}
                      style={styles.tipNumber}
                    >
                      <Text style={styles.tipNumberText}>{idx + 1}</Text>
                    </LinearGradient>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))
              )}
            </View>

            {/* ── ACTION BUTTONS ── */}
            <View style={styles.actionRow}>
              {/* CSV button */}
              <TouchableOpacity
                onPress={handleCSVDownload}
                activeOpacity={0.82}
                style={styles.csvWrap}
              >
                <LinearGradient
                  colors={["#e8fad4", "#cdf0a0"]}
                  style={styles.csvBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="download-outline" size={18} color="#3a7a10" />
                  <Text style={styles.csvText}>{i18n.t("download_csv")}</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Detail analysis button */}
              <TouchableOpacity
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
                activeOpacity={0.82}
                style={styles.csvWrap}
              >
                <LinearGradient
                  colors={["#e8fad4", "#cdf0a0"]}
                  style={styles.csvBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name="bar-chart-outline"
                    size={18}
                    color="#3a7a10"
                  />
                  <Text style={styles.csvText}>
                    {i18n.t("detailed_analysis")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* ── CARBON OFFSET BUTTON ── */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/carbonOffset",
                  params: {
                    lang,
                    vendorId,
                    name,
                    industry,
                    score: score?.toString(),
                    normalized: normalized?.toString(),
                  },
                })
              }
              activeOpacity={0.82}
              style={styles.offsetWrap}
            >
              <LinearGradient
                colors={["#e8fad4", "#cdf0a0"]}
                style={styles.offsetBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="leaf-outline" size={18} color="#3a7a10" />
                <Text style={styles.csvText}>Carbon Offset Suggestions</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* ── PDF REPORT BUTTON ── */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/pdfReport",
                  params: {
                    lang,
                    vendorId,
                    name,
                    industry,
                    score: score?.toString(),
                    normalized: normalized?.toString(),
                    rating: rating?.toString(),
                    status: status?.toString(),
                    tips: parsedTips.join("||"),
                    exceeded: parsedExceeded.join("||"),
                    formData: JSON.stringify(parsedFormData),
                  },
                })
              }
              activeOpacity={0.82}
              style={styles.offsetWrap}
            >
              <LinearGradient
                colors={["#e8fad4", "#cdf0a0"]}
                style={styles.offsetBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#3a7a10"
                />
                <Text style={styles.csvText}>PDF Report</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* ── NEXT / MESSAGE BUTTON — always glows ── */}
            <View style={styles.btnWrapper}>
              <Animated.View
                style={[
                  styles.glowLayer,
                  { shadowRadius: glowSize, shadowOpacity: glowOpacity },
                ]}
              />
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/message",
                    params: { lang },
                  })
                }
                activeOpacity={0.87}
                style={styles.btnOuter}
              >
                <LinearGradient
                  colors={["#a8e858", "#6ec832", "#48a818"]}
                  style={styles.btnInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.btnText}>{i18n.t("view_message")}</Text>
                  <View style={styles.btnArrow}>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EmissionBreakdownScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 14,
  },

  /* Header */
  headerCard: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#c8eea0",
    overflow: "hidden",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  homeBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#eaf8d8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#c0e898",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a4008",
    letterSpacing: -0.3,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#eaf8d8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c0e898",
  },
  chipText: {
    fontSize: 11,
    color: "#3a6a20",
    fontWeight: "500",
  },

  /* Section card */
  sectionCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#caeaa8",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  accentBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a4008",
  },

  /* Empty state */
  emptyBox: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#8aba70",
    textAlign: "center",
  },

  /* Overuse rows */
  overuseRow: {
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffd0d0",
  },
  overuseLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  overuseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e03030",
  },
  overuseLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#c02020",
    flex: 1,
  },
  overuseBarTrack: {
    height: 6,
    backgroundColor: "#ffe0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  overuseBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  overuseDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overuseDetail: {
    fontSize: 12,
    color: "#888",
  },
  overuseDetailBold: {
    fontWeight: "700",
    color: "#444",
  },

  /* Tips */
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddf0c8",
  },
  tipNumber: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  tipNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  tipText: {
    fontSize: 13,
    color: "#2e5a10",
    flex: 1,
    lineHeight: 20,
  },

  /* Action buttons row */
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  csvWrap: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#b8e890",
  },
  csvBtn: {
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  csvText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3a7a10",
  },

  offsetWrap: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#b8e890",
  },
  offsetBtn: {
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  /* Glow next button */
  btnWrapper: {
    position: "relative",
    alignItems: "stretch",
  },
  glowLayer: {
    position: "absolute",
    top: 6,
    left: 10,
    right: 10,
    bottom: 6,
    borderRadius: 16,
    backgroundColor: "transparent",
    shadowColor: "#6ec832",
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  btnOuter: {
    borderRadius: 16,
    overflow: "hidden",
  },
  btnInner: {
    paddingVertical: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  btnArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
});
