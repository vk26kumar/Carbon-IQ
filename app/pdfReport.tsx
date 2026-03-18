import { generatePDFReport } from "@/utils/generatePDFReport";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Preview row ──────────────────────────────────────────────────────────────
function PreviewRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.previewRow}>
      <Text style={styles.previewLabel}>{label}</Text>
      <Text style={[styles.previewValue, accent && styles.previewValueAccent]}>
        {value}
      </Text>
    </View>
  );
}

// ─── Section chip ─────────────────────────────────────────────────────────────
function SectionChip({
  icon,
  label,
  included,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  included: boolean;
}) {
  return (
    <View style={[styles.chip, included ? styles.chipOn : styles.chipOff]}>
      <Ionicons name={icon} size={12} color={included ? "#3a7a10" : "#aaa"} />
      <Text style={[styles.chipText, { color: included ? "#3a7a10" : "#aaa" }]}>
        {label}
      </Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function PDFReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const {
    lang,
    vendorId,
    name,
    industry,
    score = "0",
    normalized = "0",
    rating = "",
    status = "",
    tips = "",
    exceeded = "",
    formData = "{}",
  } = params;

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();
  }, [lang]);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-18)).current;
  const bodyFade = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      Animated.timing(bodyFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
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

  const parsedTips: string[] =
    typeof tips === "string" ? tips.split("||").filter(Boolean) : [];
  const parsedExceeded: string[] =
    typeof exceeded === "string" ? exceeded.split("||").filter(Boolean) : [];
  const parsedFormData: Record<string, string> = (() => {
    try {
      return JSON.parse(formData.toString());
    } catch {
      return {};
    }
  })();

  const numScore = parseFloat(score.toString()) || 0;
  const numNorm = parseFloat(normalized.toString()) || 0;

  const handleExport = async () => {
    setLoading(true);
    try {
      await generatePDFReport({
        vendorId: vendorId?.toString() ?? "",
        name: name?.toString() ?? vendorId?.toString() ?? "",
        industry: industry?.toString() ?? "",
        score: numScore,
        normalized: numNorm,
        rating: rating.toString(),
        status: status.toString(),
        tips: parsedTips,
        exceeded: parsedExceeded,
        formData: parsedFormData,
        lang: lang?.toString(),
      });
    } catch {
      Alert.alert("Export failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const glowSize = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 22],
  });
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.58],
  });

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
                  onPress={() => router.back()}
                  style={styles.backBtn}
                >
                  <Ionicons
                    name="arrow-back-outline"
                    size={18}
                    color="#4a9a20"
                  />
                </TouchableOpacity>
                <Text style={styles.heading}>PDF Report</Text>
                <View style={{ width: 36 }} />
              </View>

              {/* Vendor chips — name + id + industry */}
              <View style={styles.chipRow}>
                <View style={styles.infoChip}>
                  <Ionicons
                    name="person-circle-outline"
                    size={13}
                    color="#5a8040"
                  />
                  <Text style={styles.infoChipText}>{name ?? vendorId}</Text>
                </View>
                <View style={styles.infoChip}>
                  <Ionicons name="card-outline" size={13} color="#5a8040" />
                  <Text style={styles.infoChipText}>{vendorId}</Text>
                </View>
                <View style={styles.infoChip}>
                  <Ionicons name="business-outline" size={13} color="#5a8040" />
                  <Text style={styles.infoChipText}>
                    {i18n.t(industry?.toString() ?? "")}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── PREVIEW CARD ── */}
          <Animated.View style={{ opacity: bodyFade }}>
            <View style={styles.previewCard}>
              {/* Mock PDF header */}
              <View style={styles.mockHeader}>
                <View>
                  <Text style={styles.mockTitle}>Carbon IQ</Text>
                  <Text style={styles.mockSub}>Carbon Emission Report</Text>
                </View>
                <Text style={styles.mockDate}>
                  {new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <View style={styles.mockDivider} />

              {/* Preview rows — name + id included */}
              <PreviewRow
                label="Vendor Name"
                value={name?.toString() ?? vendorId?.toString() ?? "-"}
              />
              <PreviewRow
                label="Vendor ID"
                value={vendorId?.toString() ?? "-"}
              />
              <PreviewRow
                label="Industry"
                value={industry?.toString().replace(/_/g, " ") ?? "-"}
              />
              <PreviewRow
                label="Total Score"
                value={numScore.toFixed(1)}
                accent
              />
              <PreviewRow
                label="Normalized"
                value={`${numNorm.toFixed(2)} CO₂/unit`}
                accent
              />
              <PreviewRow label="Rating" value={rating.toString()} />
              <PreviewRow
                label="Status"
                value={
                  parsedExceeded.length > 0
                    ? "Overuse detected"
                    : "Within limits"
                }
              />
            </View>
          </Animated.View>

          {/* ── WHAT'S INCLUDED ── */}
          <Animated.View style={{ opacity: bodyFade }}>
            <View style={styles.includedCard}>
              <View style={styles.sectionRow}>
                <View style={styles.accentBar} />
                <Text style={styles.sectionTitle}>What's included</Text>
              </View>
              <View style={styles.chipGrid}>
                <SectionChip
                  icon="person-outline"
                  label="Vendor info"
                  included
                />
                <SectionChip
                  icon="leaf-outline"
                  label="Emission scores"
                  included
                />
                <SectionChip
                  icon="bar-chart-outline"
                  label="Resource data"
                  included
                />
                <SectionChip
                  icon="alert-circle-outline"
                  label="Overuse alerts"
                  included={parsedExceeded.length > 0}
                />
                <SectionChip
                  icon="bulb-outline"
                  label="Eco tips"
                  included={parsedTips.length > 0}
                />
                <SectionChip
                  icon="sunny-outline"
                  label="Offset info"
                  included
                />
              </View>
            </View>
          </Animated.View>

          {/* ── INFO BOX ── */}
          <Animated.View style={{ opacity: bodyFade }}>
            <View style={styles.infoBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#38aae0"
              />
              <Text style={styles.infoText}>
                This PDF is formatted for sharing with buyers, auditors, and
                sustainability teams.
              </Text>
            </View>
          </Animated.View>

          {/* ── EXPORT BUTTON — always glows ── */}
          <View style={styles.btnWrapper}>
            <Animated.View
              style={[
                styles.glowLayer,
                { shadowRadius: glowSize, shadowOpacity: glowOpacity },
              ]}
            />
            <TouchableOpacity
              onPress={handleExport}
              activeOpacity={0.87}
              disabled={loading}
              style={styles.btnOuter}
            >
              <LinearGradient
                colors={
                  loading
                    ? ["#c8e8b0", "#b0d890"]
                    : ["#a8e858", "#6ec832", "#48a818"]
                }
                style={styles.btnInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="document-text-outline" size={18} color="#fff" />
                <Text style={styles.btnText}>
                  {loading ? "Generating PDF..." : "Export & Share PDF"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>Back to results</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
    gap: 12,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
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
  chipRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  infoChip: {
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
  infoChipText: { fontSize: 11, color: "#3a6a20", fontWeight: "500" },

  /* Preview card */
  previewCard: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#caeaa8",
  },
  mockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  mockTitle: { fontSize: 16, fontWeight: "700", color: "#3a7a10" },
  mockSub: { fontSize: 11, color: "#8aba70", marginTop: 2 },
  mockDate: { fontSize: 11, color: "#8aba70" },
  mockDivider: { height: 1, backgroundColor: "#dff0c8", marginBottom: 14 },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eef8e4",
  },
  previewLabel: { fontSize: 13, color: "#7a9a70" },
  previewValue: { fontSize: 13, fontWeight: "600", color: "#1a3a0a" },
  previewValueAccent: { color: "#3a7a10" },

  /* Included card */
  includedCard: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#caeaa8",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  accentBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#6ec832",
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1a4008" },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  chipOn: { backgroundColor: "#eaf8d8", borderColor: "#b8e890" },
  chipOff: { backgroundColor: "#f8f8f8", borderColor: "#e0e0e0" },
  chipText: { fontSize: 11, fontWeight: "500" },

  /* Info box */
  infoBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: "#e0f4ff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#b0d8f0",
  },
  infoText: { flex: 1, fontSize: 13, color: "#1a5a80", lineHeight: 19 },

  /* Glow button */
  btnWrapper: { position: "relative", alignItems: "stretch" },
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
  btnOuter: { borderRadius: 16, overflow: "hidden" },
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

  backLink: { alignItems: "center", paddingVertical: 4 },
  backLinkText: { fontSize: 14, color: "#5a8040" },
});
