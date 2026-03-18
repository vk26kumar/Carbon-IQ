import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../utils/i18n";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
];

export default function LandingScreen() {
  const [language, setLanguage] = useState(i18n.locale || "en");

  // ── Entrance animations ──
  const fadeTop = useRef(new Animated.Value(0)).current;
  const slideTop = useRef(new Animated.Value(-24)).current;
  const fadeImg = useRef(new Animated.Value(0)).current;
  const scaleImg = useRef(new Animated.Value(0.92)).current;
  const fadeLang = useRef(new Animated.Value(0)).current;
  const slideBtn = useRef(new Animated.Value(30)).current;
  const fadeBtn = useRef(new Animated.Value(0)).current;

  // ── Pulse ring animation on logo ──
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Staggered entrance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeTop, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideTop, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeImg, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleImg, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeLang, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBtn, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideBtn, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous pulse on logo ring
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.35,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.45,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  const handleLanguageSelect = async (code: string) => {
    setLanguage(code);
    i18n.locale = code;
    if (code === "ar") {
      await I18nManager.forceRTL(true);
    } else {
      await I18nManager.forceRTL(false);
    }
  };

  const handleGetStarted = () => {
    router.push({ pathname: "/home", params: { lang: language } });
  };

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
          keyboardShouldPersistTaps="handled"
        >
          {/* ── TOP: Logo + Title ── */}
          <Animated.View
            style={[
              styles.topSection,
              { opacity: fadeTop, transform: [{ translateY: slideTop }] },
            ]}
          >
            {/* Pulse ring behind logo */}
            <View style={styles.logoWrap}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
                ]}
              />
              <LinearGradient
                colors={["#ffffff", "#e8fad8"]}
                style={styles.logoBg}
              >
                <Image
                  source={require("../assets/images/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </LinearGradient>
            </View>

            <Text style={styles.title}>{i18n.t("carbon_toolkit_title")}</Text>
            <Text style={styles.subtitle}>
              {i18n.t("carbon_toolkit_subtitle")}
            </Text>
          </Animated.View>

          {/* ── ILLUSTRATION ── */}
          <Animated.View
            style={{
              opacity: fadeImg,
              transform: [{ scale: scaleImg }],
            }}
          >
            <LinearGradient
              colors={["#ffffff", "#edfadf", "#e0f7cc"]}
              style={styles.illustrationCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Decorative corner accent */}
              <View style={styles.accentDotTL} />
              <View style={styles.accentDotBR} />
              <Image
                source={require("../assets/images/carbon.png")}
                style={styles.illustration}
                resizeMode="contain"
              />
            </LinearGradient>
          </Animated.View>

          {/* ── LANGUAGE PICKER ── */}
          <Animated.View style={[styles.langCard, { opacity: fadeLang }]}>
            <Text style={styles.langPrompt}>{i18n.t("select_language")}</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.langGrid}
              renderItem={({ item }) => {
                const sel = language === item.code;
                return (
                  <TouchableOpacity
                    onPress={() => handleLanguageSelect(item.code)}
                    activeOpacity={0.75}
                    style={{ flex: 1, margin: 5 }}
                  >
                    {sel ? (
                      <LinearGradient
                        colors={["#c8f0a0", "#a8e878"]}
                        style={[styles.langItem, styles.langItemSel]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <View style={styles.selCheck} />
                        <Text style={styles.langTextSel}>{item.label}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.langItem}>
                        <Text style={styles.langText}>{item.label}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Animated.View>

          {/* ── CTA BUTTON ── */}
          <Animated.View
            style={{
              opacity: fadeBtn,
              transform: [{ translateY: slideBtn }],
            }}
          >
            <TouchableOpacity
              onPress={handleGetStarted}
              activeOpacity={0.88}
              style={styles.ctaWrap}
            >
              <LinearGradient
                colors={["#90d84a", "#6ec832", "#54b820"]}
                style={styles.ctaBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>{i18n.t("next")}</Text>
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
    paddingTop: 24,
    paddingBottom: 32,
    gap: 18,
  },

  /* ── Top section ── */
  topSection: {
    alignItems: "center",
    paddingTop: 8,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    width: 100,
    height: 100,
  },
  pulseRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2.5,
    borderColor: "#7ad440",
  },
  logoBg: {
    width: 82,
    height: 82,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#c8eea0",
  },
  logo: {
    width: 62,
    height: 62,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a4008",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 13,
    color: "#5a8040",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 24,
  },

  /* ── Illustration card ── */
  illustrationCard: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#c8eea0",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  accentDotTL: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#a0dc6a",
    opacity: 0.6,
  },
  accentDotBR: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#78c840",
    opacity: 0.5,
  },
  illustration: {
    width: "100%",
    height: 200,
  },

  /* ── Language card ── */
  langCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#caeaa8",
  },
  langPrompt: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2e5a10",
    marginBottom: 10,
    textAlign: "center",
  },
  langGrid: {
    gap: 4,
  },
  langItem: {
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "#caeaa8",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  langItemSel: {
    borderColor: "#78c840",
    borderWidth: 1.5,
  },
  selCheck: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#2e7a08",
  },
  langText: {
    fontSize: 14,
    color: "#3a4a30",
    fontWeight: "500",
  },
  langTextSel: {
    fontSize: 14,
    color: "#1a3a08",
    fontWeight: "700",
  },

  /* ── CTA ── */
  ctaWrap: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#6ec832",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
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
    letterSpacing: 0.4,
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
