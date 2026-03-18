import i18n from "@/utils/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Feature cards data (all keys exist in i18n) ───────────────────────────────
const FEATURES = [
  {
    key: "feature_tracking",
    icon: "📍",
    gradient: ["#e8fad4", "#d4f2b8"] as [string, string],
    border: "#b8e890",
  },
  {
    key: "feature_comparison",
    icon: "📊",
    gradient: ["#e4f8d0", "#cceea8"] as [string, string],
    border: "#aade80",
  },
  {
    key: "feature_insights",
    icon: "💡",
    gradient: ["#f0fde4", "#ddf8c0"] as [string, string],
    border: "#c0e898",
  },
];

// ── Step row component ────────────────────────────────────────────────────────
function StepRow({
  number,
  text,
  delay,
}: {
  number: string;
  text: string;
  delay: number;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

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
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.stepRow,
        { opacity: fade, transform: [{ translateX: slide }] },
      ]}
    >
      <LinearGradient colors={["#90d84a", "#6ec832"]} style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </LinearGradient>
      <Text style={styles.stepText}>{text}</Text>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const { lang } = useLocalSearchParams();

  if (lang) i18n.locale = lang.toString();

  // Entrance animations
  const fadeHero = useRef(new Animated.Value(0)).current;
  const slideHero = useRef(new Animated.Value(-20)).current;
  const fadeCards = useRef(new Animated.Value(0)).current;
  const scaleBtn = useRef(new Animated.Value(0.94)).current;
  const fadeBtn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeHero, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideHero, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeCards, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
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

  return (
    <LinearGradient
      colors={["#f0fce8", "#e4f7d4", "#d8f2be"]}
      style={styles.gradientBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── HERO ── */}
          <Animated.View
            style={{
              opacity: fadeHero,
              transform: [{ translateY: slideHero }],
            }}
          >
            <LinearGradient
              colors={["#ffffff", "#edfadf", "#dff7c8"]}
              style={styles.heroCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Decorative dots */}
              <View style={styles.dotTR} />
              <View style={styles.dotBL} />

              <Text style={styles.heroTitle}>
                {i18n.t("carbon_toolkit_title")}
              </Text>
              <View style={styles.heroDivider} />
              <Text style={styles.heroSub}>
                {i18n.t("carbon_toolkit_subtitle")}
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* ── FEATURE CARDS ── */}
          <Animated.View style={{ opacity: fadeCards }}>
            <View style={styles.featureRow}>
              {FEATURES.map((f) => (
                <LinearGradient
                  key={f.key}
                  colors={f.gradient}
                  style={[styles.featureCard, { borderColor: f.border }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <Text style={styles.featureText}>{i18n.t(f.key)}</Text>
                </LinearGradient>
              ))}
            </View>
          </Animated.View>

          {/* ── WHY USE SECTION ── */}
          <Animated.View style={{ opacity: fadeCards }}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionHeading}>
                  {i18n.t("why_use_toolkit")}
                </Text>
              </View>
              <Text style={styles.sectionBody}>{i18n.t("home_purpose")}</Text>
            </View>
          </Animated.View>

          {/* ── HOW IT WORKS ── */}
          <Animated.View style={{ opacity: fadeCards }}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionHeading}>
                  {i18n.t("how_it_works")}
                </Text>
              </View>
              <StepRow number="1" text={i18n.t("register")} delay={100} />
              <StepRow number="2" text={i18n.t("fill_form")} delay={200} />
              <StepRow number="3" text={i18n.t("get_report")} delay={300} />
            </View>
          </Animated.View>

          {/* ── CTA BUTTON ── */}
          <Animated.View
            style={{
              opacity: fadeBtn,
              transform: [{ scale: scaleBtn }],
            }}
          >
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() =>
                router.push({ pathname: "/onboard", params: { lang } })
              }
              style={styles.ctaWrap}
            >
              <LinearGradient
                colors={["#90d84a", "#6ec832", "#54b820"]}
                style={styles.ctaBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>
                  {i18n.t("vendor_registration")}
                </Text>
                <View style={styles.ctaArrow}>
                  <Text style={styles.ctaArrowText}>›</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    gap: 16,
  },

  /* ── Hero ── */
  heroCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#c8eea0",
    overflow: "hidden",
    position: "relative",
  },
  dotTR: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#a0dc6a",
    opacity: 0.5,
  },
  dotBL: {
    position: "absolute",
    bottom: 14,
    left: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#78c840",
    opacity: 0.4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a4008",
    textAlign: "center",
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  heroDivider: {
    width: 40,
    height: 3,
    backgroundColor: "#7ad440",
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 12,
  },
  heroSub: {
    fontSize: 14,
    color: "#4a7030",
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 8,
  },

  /* ── Feature cards ── */
  featureRow: {
    flexDirection: "row",
    gap: 10,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    gap: 8,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2e5a10",
    textAlign: "center",
    lineHeight: 15,
  },

  /* ── Section card ── */
  sectionCard: {
    backgroundColor: "rgba(255,255,255,0.80)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#caeaa8",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: "#6ec832",
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a4008",
    letterSpacing: -0.2,
  },
  sectionBody: {
    fontSize: 14,
    color: "#4a6a30",
    lineHeight: 22,
    paddingLeft: 14,
  },

  /* ── Steps ── */
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
    paddingLeft: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddf0c8",
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  stepText: {
    fontSize: 14,
    color: "#3a5a20",
    flex: 1,
    lineHeight: 20,
  },

  /* ── CTA ── */
  ctaWrap: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#6ec832",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaBtn: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  ctaArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaArrowText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
  },
});
