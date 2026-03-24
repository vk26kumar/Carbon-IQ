import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
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

// ─── Animated metric card ─────────────────────────────────────────────────────
function MetricCard({
  icon,
  title,
  value,
  sub,
  delay,
  accent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  sub?: string;
  delay: number;
  accent: string;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 400,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.metricCard,
        { opacity: fade, transform: [{ translateY: slide }] },
      ]}
    >
      <View
        style={[
          styles.metricIconCircle,
          { backgroundColor: accent + "18", borderColor: accent + "40" },
        ]}
      >
        <Ionicons name={icon} size={22} color={accent} />
      </View>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={[styles.metricValue, { color: accent }]}>{value}</Text>
      {sub && <Text style={styles.metricSub}>{sub}</Text>}
    </Animated.View>
  );
}

// ─── Star row ─────────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < count ? "star" : "star-outline"}
          size={26}
          color={i < count ? "#f0b429" : "#cde8a8"}
          style={{ marginHorizontal: 3 }}
        />
      ))}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
const ResultScreen = () => {
  const router = useRouter();
  const {
    lang,
    vendorId,
    name,
    industry,
    fabric_produced,
    electricity_used,
    water_used,
    chemicals_used,
    diesel_used,
    milk_produced,
    cows,
    fodder_used,
    land_area,
    fertilizer_used,
    crop_yield,
    units_produced,
  } = useLocalSearchParams();

  const [score, setScore] = useState(0);
  const [normalized, setNormalized] = useState(0);
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [standardNormalized, setStandardNormalized] = useState(0);
  const [tips, setTips] = useState<string[]>([]);
  const [overusedItems, setOverusedItems] = useState<string[]>([]);
  const [starsCount, setStarsCount] = useState(0);
  const [ready, setReady] = useState(false);

  // Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const scaleBtn = useRef(new Animated.Value(0.94)).current;
  const fadeBtn = useRef(new Animated.Value(0)).current;

  const formData =
    industry === "textile"
      ? {
          fabric_produced,
          electricity_used,
          water_used,
          chemicals_used,
          diesel_used,
        }
      : industry === "dairy"
        ? { milk_produced, cows, electricity_used, fodder_used, diesel_used }
        : industry === "agriculture"
          ? {
              land_area,
              fertilizer_used,
              electricity_used,
              diesel_used,
              crop_yield,
            }
          : {
              units_produced,
              electricity_used,
              water_used,
              chemicals_used,
              diesel_used,
            };

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();
  }, [lang]);

  useEffect(() => {
    const calculate = async () => {
      let total = 0;
      let normalizedVal = 0;
      const exceeded: string[] = [];
      const toNum = (v: any) => Number(v) || 0;

      if (industry === "textile") {
        const fabric = toNum(fabric_produced);
        const elec = toNum(electricity_used);
        const water = toNum(water_used);
        const chem = toNum(chemicals_used);
        const diesel = toNum(diesel_used);
        const stdElec = +(fabric * 0.3).toFixed(2);
        const stdWater = +(fabric * 50).toFixed(2);
        const stdChem = +(fabric * 0.1).toFixed(2);
        const stdDiesel = +(fabric * 0.08).toFixed(2);
        if (elec > stdElec)
          exceeded.push(
            `${i18n.t("electricity_used")} (${i18n.t("allowed")}: ${stdElec}, ${i18n.t("used")}: ${elec})`,
          );
        if (water > stdWater)
          exceeded.push(
            `${i18n.t("water_used")} (${i18n.t("allowed")}: ${stdWater}, ${i18n.t("used")}: ${water})`,
          );
        if (chem > stdChem)
          exceeded.push(
            `${i18n.t("chemicals_used")} (${i18n.t("allowed")}: ${stdChem}, ${i18n.t("used")}: ${chem})`,
          );
        if (diesel > stdDiesel)
          exceeded.push(
            `${i18n.t("diesel_used")} (${i18n.t("allowed")}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`,
          );
        total =
          fabric * 0.2 + elec * 0.7 + water * 0.005 + chem * 0.2 + diesel * 1.2;
        normalizedVal = fabric > 0 ? total / fabric : 0;
        setStandardNormalized(0.6);
        setTips(
          i18n.t("textile_tips", {
            returnObjects: true,
          }) as unknown as string[],
        );
      } else if (industry === "dairy") {
        const milk = toNum(milk_produced);
        const cowsN = toNum(cows);
        const elec = toNum(electricity_used);
        const fodder = toNum(fodder_used);
        const diesel = toNum(diesel_used);
        const stdElec = milk * 0.25;
        const stdFodder = milk * 0.3;
        const stdDiesel = milk * 0.05;
        if (elec > stdElec)
          exceeded.push(
            `${i18n.t("electricity_used")} (${i18n.t("allowed")}: ${stdElec}, ${i18n.t("used")}: ${elec})`,
          );
        if (fodder > stdFodder)
          exceeded.push(
            `${i18n.t("fodder_used")} (${i18n.t("allowed")}: ${stdFodder}, ${i18n.t("used")}: ${fodder})`,
          );
        if (diesel > stdDiesel)
          exceeded.push(
            `${i18n.t("diesel_used")} (${i18n.t("allowed")}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`,
          );
        total =
          milk * 0.1 + cowsN * 5 + elec * 0.5 + fodder * 0.3 + diesel * 1.5;
        normalizedVal = milk > 0 ? total / milk : 0;
        setStandardNormalized(0.8);
        setTips(
          i18n.t("dairy_tips", { returnObjects: true }) as unknown as string[],
        );
      } else if (industry === "agriculture") {
        const land = toNum(land_area);
        const fert = toNum(fertilizer_used);
        const elec = toNum(electricity_used);
        const diesel = toNum(diesel_used);
        const yld = toNum(crop_yield);
        const stdFert = land * 0.5;
        const stdDiesel = land * 0.1;
        const stdElec = land * 1.0;
        if (fert > stdFert)
          exceeded.push(
            `${i18n.t("fertilizer_used")} (${i18n.t("allowed")}: ${stdFert}, ${i18n.t("used")}: ${fert})`,
          );
        if (elec > stdElec)
          exceeded.push(
            `${i18n.t("electricity_used")} (${i18n.t("allowed")}: ${stdElec}, ${i18n.t("used")}: ${elec})`,
          );
        if (diesel > stdDiesel)
          exceeded.push(
            `${i18n.t("diesel_used")} (${i18n.t("allowed")}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`,
          );
        total = fert * 0.6 + elec * 0.3 + diesel * 2;
        normalizedVal = yld > 0 ? total / yld : 0;
        setStandardNormalized(0.5);
        setTips(
          i18n.t("agriculture_tips", {
            returnObjects: true,
          }) as unknown as string[],
        );
      } else {
        const units = toNum(units_produced);
        const elec = toNum(electricity_used);
        const water = toNum(water_used);
        const chem = toNum(chemicals_used);
        const diesel = toNum(diesel_used);
        const stdElec = units * 0.4;
        const stdWater = units * 10;
        const stdChem = units * 0.05;
        const stdDiesel = units * 0.1;
        if (elec > stdElec)
          exceeded.push(
            `${i18n.t("electricity_used")} (${i18n.t("allowed")}: ${stdElec}, ${i18n.t("used")}: ${elec})`,
          );
        if (water > stdWater)
          exceeded.push(
            `${i18n.t("water_used")} (${i18n.t("allowed")}: ${stdWater}, ${i18n.t("used")}: ${water})`,
          );
        if (chem > stdChem)
          exceeded.push(
            `${i18n.t("chemicals_used")} (${i18n.t("allowed")}: ${stdChem}, ${i18n.t("used")}: ${chem})`,
          );
        if (diesel > stdDiesel)
          exceeded.push(
            `${i18n.t("diesel_used")} (${i18n.t("allowed")}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`,
          );
        total = elec * 0.6 + water * 0.05 + chem * 0.3 + diesel * 1.8;
        normalizedVal = units > 0 ? total / units : 0;
        setStandardNormalized(1.0);
        setTips(
          i18n.t("manufacturing_tips", {
            returnObjects: true,
          }) as unknown as string[],
        );
      }

      const stars =
        normalizedVal < 0.3
          ? 5
          : normalizedVal < 0.6
            ? 4
            : normalizedVal < 0.9
              ? 3
              : normalizedVal < 1.2
                ? 2
                : 1;

      const ratingKey = [
        "rating_poor",
        "rating_average",
        "rating_good",
        "rating_excellent",
        "rating_outstanding",
      ][stars - 1];

      const finalScore = +total.toFixed(2);
      const finalNorm = +normalizedVal.toFixed(2);
      const ratingStr = `${i18n.t(ratingKey)} (${stars}/5)`;
      const statusStr =
        exceeded.length > 0
          ? i18n.t("status_overuse")
          : i18n.t("status_within");

      setScore(finalScore);
      setNormalized(finalNorm);
      setRating(ratingStr);
      setStatus(statusStr);
      setStarsCount(stars);
      setOverusedItems(exceeded);
      setReady(true);

      // Animate score counting up
      Animated.timing(scoreAnim, {
        toValue: finalScore,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();

      // Header entrance → then button entrance
      Animated.sequence([
        Animated.parallel([
          Animated.timing(headerFade, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(headerSlide, {
            toValue: 0,
            duration: 500,
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

      try {
        await addDoc(collection(db, "results"), {
          vendorId,
          industry,
          formData,
          score: finalScore,
          normalized: finalNorm,
          rating: ratingStr,
          status: statusStr,
          tips: [],
          exceeded,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Save error:", e);
      }
    };

    calculate();
  }, []);

  const isOveruse = status.includes("⚠️");
  const statusColor = isOveruse ? "#e03030" : "#28a048";
  const statusBg = isOveruse ? "#fff0f0" : "#f0fce8";
  const statusBorder = isOveruse ? "#ffb0b0" : "#b8e890";

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
              <LinearGradient
                colors={["#90d84a", "#54b820"]}
                style={styles.headerIconCircle}
              >
                <Ionicons name="leaf-outline" size={26} color="#fff" />
              </LinearGradient>

              <Text style={styles.heading}>
                {i18n.t("carbon_footprint_results")}
              </Text>

              {/* Vendor + industry chip row */}
              <View style={styles.chipRow}>
                <View style={styles.chip}>
                  <Ionicons
                    name="person-circle-outline"
                    size={13}
                    color="#5a8040"
                  />
                  <Text style={styles.chipText}>{vendorId}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="business-outline" size={13} color="#5a8040" />
                  <Text style={styles.chipText}>
                    {i18n.t(industry?.toString() ?? "unknown")}
                  </Text>
                </View>
              </View>

              {/* Animated score counter */}
              <View style={styles.scoreBig}>
                <Animated.Text style={styles.scoreNumber}>
                  {
                    scoreAnim.interpolate({
                      inputRange: [0, score || 1],
                      outputRange: ["0", (score || 0).toFixed(2)],
                    }) as any
                  }
                </Animated.Text>
                <Text style={styles.scoreLabel}>
                  {i18n.t("total_emission_score")}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── METRICS ROW ── */}
          <View style={styles.metricRow}>
            <MetricCard
              icon="speedometer-outline"
              title={i18n.t("normalized_emission_score")}
              value={normalized.toFixed(2)}
              sub={i18n.t("co2_per_unit")}
              delay={200}
              accent="#6ec832"
            />
            <MetricCard
              icon="shield-checkmark-outline"
              title={i18n.t("govt_standard_normalized_score")}
              value={standardNormalized.toFixed(1)}
              sub={i18n.t("co2_per_unit")}
              delay={300}
              accent="#38aae0"
            />
          </View>

          {/* ── RATING CARD ── */}
          {ready && (
            <View style={styles.ratingCard}>
              <View style={styles.sectionRow}>
                <View style={styles.accentBar} />
                <Text style={styles.sectionTitle}>{i18n.t("rating")}</Text>
              </View>
              <Stars count={starsCount} />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          )}

          {/* ── STATUS CARD ── */}
          {ready && (
            <View
              style={[
                styles.statusCard,
                { backgroundColor: statusBg, borderColor: statusBorder },
              ]}
            >
              <View
                style={[
                  styles.statusIconCircle,
                  { backgroundColor: statusColor + "18" },
                ]}
              >
                <Ionicons
                  name={
                    isOveruse
                      ? "alert-circle-outline"
                      : "checkmark-circle-outline"
                  }
                  size={22}
                  color={statusColor}
                />
              </View>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {status}
              </Text>
            </View>
          )}

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
                  pathname: "/emissionBreakdown",
                  params: {
                    lang,
                    vendorId,
                    name,
                    industry,
                    exceeded: overusedItems.join("||"),
                    tips: tips.join("||"),
                    score: score.toString(),
                    normalized: normalized.toString(),
                    rating,
                    status,
                    formData: JSON.stringify(formData),
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
                    name="analytics-outline"
                    size={16}
                    color="#3a7a10"
                  />
                </View>
                <Text style={styles.ctaText}>{i18n.t("next")}</Text>
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
};

export default ResultScreen;

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
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c8eea0",
    overflow: "hidden",
  },
  headerIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a4008",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#eaf8d8",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c0e898",
  },
  chipText: {
    fontSize: 12,
    color: "#3a6a20",
    fontWeight: "500",
  },

  /* Animated score */
  scoreBig: {
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#f0fce8",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: "#c8eea0",
    width: "100%",
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1a4008",
    letterSpacing: -1,
    lineHeight: 54,
  },
  scoreLabel: {
    fontSize: 12,
    color: "#5a8040",
    marginTop: 4,
    fontWeight: "500",
  },

  /* Metric cards */
  metricRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#caeaa8",
    gap: 6,
  },
  metricIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 2,
  },
  metricTitle: {
    fontSize: 11,
    color: "#5a8040",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 15,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  metricSub: {
    fontSize: 10,
    color: "#8aba70",
    fontWeight: "500",
  },

  /* Rating */
  ratingCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#caeaa8",
    alignItems: "center",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    alignSelf: "flex-start",
  },
  accentBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#6ec832",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a4008",
  },
  starRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3a6a20",
  },

  /* Status */
  statusCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    lineHeight: 20,
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
