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

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-18)).current;
  const bodyFade = useRef(new Animated.Value(0)).current;
  const bodySlide = useRef(new Animated.Value(20)).current;

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
  }, []);

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

            {/* ── ACTION BUTTONS GRID ── */}
            <View style={styles.actionGrid}>
              {/* Detail Analysis */}
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
                style={styles.gridBtn}
              >
                <LinearGradient
                  colors={["#ffffff", "#edfadf"]}
                  style={styles.gridBtnInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.gridIconWrap}>
                    <Ionicons
                      name="bar-chart-outline"
                      size={20}
                      color="#3a7a10"
                    />
                  </View>
                  <Text style={styles.gridBtnText}>Detail{"\n"}Analysis</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Carbon Offset */}
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
                style={styles.gridBtn}
              >
                <LinearGradient
                  colors={["#ffffff", "#edfadf"]}
                  style={styles.gridBtnInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.gridIconWrap}>
                    <Ionicons name="leaf-outline" size={20} color="#3a7a10" />
                  </View>
                  <Text style={styles.gridBtnText}>Carbon{"\n"}Offset</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* PDF Report */}
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
                style={styles.gridBtn}
              >
                <LinearGradient
                  colors={["#ffffff", "#edfadf"]}
                  style={styles.gridBtnInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.gridIconWrap}>
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#3a7a10"
                    />
                  </View>
                  <Text style={styles.gridBtnText}>PDF{"\n"}Report</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* ── VIEW MESSAGE BUTTON ── */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/message",
                  params: { lang },
                })
              }
              activeOpacity={0.82}
              style={styles.msgBtn}
            >
              <LinearGradient
                colors={["#edfadf", "#d4f5a8", "#c2ee8a"]}
                style={styles.msgBtnInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.msgIconWrap}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={16}
                    color="#3a7a10"
                  />
                </View>
                <Text style={styles.msgBtnText}>{i18n.t("view_message")}</Text>
                <View style={styles.msgArrow}>
                  <Ionicons name="arrow-forward" size={13} color="#3a7a10" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
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

  /* Action grid */
  actionGrid: {
    flexDirection: "row",
    gap: 10,
  },
  gridBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#c2e89a",
    shadowColor: "#6ec832",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  gridBtnInner: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 8,
  },
  gridIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eaf8d8",
    borderWidth: 1,
    borderColor: "#c0e898",
    alignItems: "center",
    justifyContent: "center",
  },
  gridBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2e5a10",
    textAlign: "center",
    lineHeight: 15,
  },

  /* Message button */
  msgBtn: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#b8e890",
    shadowColor: "#6ec832",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  msgBtnInner: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  msgIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "#c0e898",
    alignItems: "center",
    justifyContent: "center",
  },
  msgBtnText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#2a6008",
    letterSpacing: 0.2,
  },
  msgArrow: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "#c0e898",
    alignItems: "center",
    justifyContent: "center",
  },
});
