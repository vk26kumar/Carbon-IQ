import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
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

// ─── Offset calculation ───────────────────────────────────────────────────────
function computeOffsets(score: number) {
  const s = Math.max(0, score);
  return [
    {
      icon: "leaf-outline" as const,
      label: "Trees to plant",
      desc: "Native trees absorbing CO₂ for 1 year",
      value: Math.ceil(s / 21),
      unit: "trees",
      color: "#28a048",
      bg: "#eaf8d8",
    },
    {
      icon: "car-outline" as const,
      label: "Car km avoided",
      desc: "Equivalent petrol vehicle emissions",
      value: Math.round(s / 0.21),
      unit: "km",
      color: "#38aae0",
      bg: "#e0f4ff",
    },
    {
      icon: "sunny-outline" as const,
      label: "Solar energy needed",
      desc: "Renewable generation to offset footprint",
      value: +(s / 0.048 / 1000).toFixed(2),
      unit: "MWh",
      color: "#e07830",
      bg: "#fff0e0",
    },
    {
      icon: "airplane-outline" as const,
      label: "Flight hours offset",
      desc: "Equivalent to grounding a plane this long",
      value: +(s / 90).toFixed(1),
      unit: "hrs",
      color: "#8050d0",
      bg: "#f0e8ff",
    },
    {
      icon: "bulb-outline" as const,
      label: "LED bulb swaps",
      desc: "Switching from incandescent to LED per year",
      value: Math.ceil(s / 10),
      unit: "bulbs",
      color: "#d09020",
      bg: "#fff8e0",
    },
    {
      icon: "restaurant-outline" as const,
      label: "Meat-free meals",
      desc: "Choosing plant-based over meat this many times",
      value: Math.round(s / 0.5),
      unit: "meals",
      color: "#28a080",
      bg: "#e0f8f0",
    },
  ];
}

// ─── Animated offset card ─────────────────────────────────────────────────────
function OffsetCard({
  item,
  index,
}: {
  item: ReturnType<typeof computeOffsets>[0];
  index: number;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 380,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 380,
        delay: index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[{ opacity: fade, transform: [{ translateY: slide }] }]}
    >
      <View
        style={[
          styles.offsetCard,
          { backgroundColor: item.bg, borderColor: item.color + "30" },
        ]}
      >
        <View
          style={[
            styles.offsetIconCircle,
            {
              backgroundColor: item.color + "18",
              borderColor: item.color + "30",
            },
          ]}
        >
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.offsetContent}>
          <Text style={[styles.offsetValue, { color: item.color }]}>
            {item.value.toLocaleString()}
            <Text style={styles.offsetUnit}> {item.unit}</Text>
          </Text>
          <Text style={styles.offsetLabel}>{item.label}</Text>
          <Text style={styles.offsetDesc}>{item.desc}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CarbonOffsetScreen() {
  const router = useRouter();
  const { score, normalized, industry, vendorId, name, lang } =
    useLocalSearchParams();

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();
  }, [lang]);

  const numScore = parseFloat(score?.toString() ?? "0") || 0;
  const offsets = computeOffsets(numScore);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-18)).current;
  const scaleBtn = useRef(new Animated.Value(0.94)).current;
  const fadeBtn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 480,
          useNativeDriver: true,
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 480,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBtn, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(scaleBtn, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const ratingColor =
    numScore < 30 ? "#28a048" : numScore < 60 ? "#f0b429" : "#e03030";
  const ratingLabel =
    numScore < 30
      ? "Low Impact"
      : numScore < 60
        ? "Moderate Impact"
        : "High Impact";

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
                <Text style={styles.heading}>Carbon Offset</Text>
                <View style={{ width: 36 }} />
              </View>

              {/* Vendor chips */}
              <View style={styles.chipRow}>
                <View style={styles.chip}>
                  <Ionicons
                    name="person-circle-outline"
                    size={13}
                    color="#5a8040"
                  />
                  <Text style={styles.chipText}>{name ?? vendorId}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="card-outline" size={13} color="#5a8040" />
                  <Text style={styles.chipText}>{vendorId}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="business-outline" size={13} color="#5a8040" />
                  <Text style={styles.chipText}>
                    {i18n.t(industry?.toString() ?? "")}
                  </Text>
                </View>
              </View>

              {/* Score + rating */}
              <View style={styles.scoreSummary}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreNum}>{numScore.toFixed(1)}</Text>
                  <Text style={styles.scoreLabel}>Emission Score</Text>
                </View>
                <View style={styles.scoreDivider} />
                <View style={styles.scoreBox}>
                  <Text
                    style={[
                      styles.ratingBadge,
                      {
                        color: ratingColor,
                        backgroundColor: ratingColor + "15",
                      },
                    ]}
                  >
                    {ratingLabel}
                  </Text>
                  <Text style={styles.scoreLabel}>
                    {parseFloat(normalized?.toString() ?? "0").toFixed(2)}{" "}
                    CO₂/unit
                  </Text>
                </View>
              </View>

              <Text style={styles.introText}>
                To fully offset{" "}
                <Text style={{ fontWeight: "700", color: "#1a4008" }}>
                  {numScore.toFixed(1)} kg CO₂
                </Text>
                , equivalent actions:
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* ── OFFSET CARDS ── */}
          {offsets.map((item, i) => (
            <OffsetCard key={item.label} item={item} index={i} />
          ))}

          {/* ── CTA BUTTON (matches Home page style) ── */}
          <Animated.View
            style={{
              opacity: fadeBtn,
              transform: [{ scale: scaleBtn }],
            }}
          >
            <TouchableOpacity
              activeOpacity={0.82}
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
                  },
                })
              }
              style={styles.ctaWrap}
            >
              <LinearGradient
                colors={["#edfadf", "#d4f5a8", "#c2ee8a"]}
                style={styles.ctaBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.ctaIconWrap}>
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color="#3a7a10"
                  />
                </View>
                <Text style={styles.ctaText}>Export PDF Report</Text>
                <View style={styles.ctaArrow}>
                  <Ionicons name="arrow-forward" size={13} color="#3a7a10" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
    gap: 12,
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
  chipRow: {
    flexDirection: "row",
    gap: 6,
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
  scoreSummary: {
    flexDirection: "row",
    backgroundColor: "#f0fce8",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#c8eea0",
    overflow: "hidden",
  },
  scoreBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    gap: 4,
  },
  scoreDivider: {
    width: 1,
    backgroundColor: "#c8eea0",
  },
  scoreNum: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a4008",
    letterSpacing: -0.5,
  },
  scoreLabel: {
    fontSize: 11,
    color: "#5a8040",
    fontWeight: "500",
  },
  ratingBadge: {
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  introText: {
    fontSize: 13,
    color: "#4a7030",
    lineHeight: 19,
    textAlign: "center",
  },

  /* Offset card */
  offsetCard: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
  },
  offsetIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexShrink: 0,
  },
  offsetContent: { flex: 1 },
  offsetValue: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  },
  offsetUnit: {
    fontSize: 13,
    fontWeight: "500",
  },
  offsetLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a3a0a",
    marginTop: 2,
  },
  offsetDesc: {
    fontSize: 11,
    color: "#5a7a5a",
    marginTop: 3,
    lineHeight: 16,
  },

  /* ── CTA Button (matches Home page exactly) ── */
  ctaWrap: {
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
  ctaBtn: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ctaIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "#c0e898",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#2a6008",
    letterSpacing: 0.2,
  },
  ctaArrow: {
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
