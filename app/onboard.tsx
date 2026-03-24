import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Industry data ────────────────────────────────────────────────────────────
const INDUSTRIES = [
  { key: "textile", icon: "shirt-outline" },
  { key: "dairy", icon: "cafe-outline" },
  { key: "agriculture", icon: "leaf-outline" },
  { key: "manufacturing", icon: "business-outline" },
  { key: "food_processing", icon: "restaurant-outline" },
  { key: "logistics", icon: "car-outline" },
  { key: "electronics", icon: "hardware-chip-outline" },
  { key: "pharmaceuticals", icon: "medkit-outline" },
];

// ─── Animated text input ──────────────────────────────────────────────────────
function FormInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
}: {
  label: string;
  icon: any;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: any;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#caeaa8", "#6ec832"],
  });

  return (
    <View style={fi.wrap}>
      <Text style={fi.label}>{label}</Text>
      <Animated.View style={[fi.row, { borderColor }]}>
        <View style={fi.iconBox}>
          <Ionicons
            name={icon}
            size={17}
            color={focused ? "#4a9a20" : "#8aba70"}
          />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#b0cca0"
          style={fi.input}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          maxLength={maxLength}
        />
        {value.length > 0 && (
          <Ionicons
            name="checkmark-circle"
            size={17}
            color="#6ec832"
            style={fi.check}
          />
        )}
      </Animated.View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
const Onboard = () => {
  const { lang } = useLocalSearchParams();
  const router = useRouter();

  const [vendorId, setVendorId] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);

  // Page entrance
  const pageFade = useRef(new Animated.Value(0)).current;
  const pageSlide = useRef(new Animated.Value(28)).current;

  // CTA button animation (same as Home)
  const scaleBtn = useRef(new Animated.Value(0.94)).current;
  const fadeBtn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(pageFade, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pageSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
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

  const isFormValid = !!(vendorId && name && mobile && industry);

  const handleNext = async () => {
    if (!isFormValid) {
      Alert.alert(i18n.t("fill_all_fields"));
      return;
    }
    if (mobile.length !== 10) {
      Alert.alert(
        "Invalid Mobile",
        "Please enter a valid 10-digit mobile number.",
      );
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "vendors"), {
        vendorId,
        name,
        mobile,
        industry,
        createdAt: new Date().toISOString(),
      });
      router.push({
        pathname: "/form",
        params: { lang: i18n.locale, vendorId, name, mobile, industry },
      });
    } catch {
      Alert.alert("Error", "Failed to save vendor data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#f0fce8", "#e4f7d4", "#d8f2be"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={{
                opacity: pageFade,
                transform: [{ translateY: pageSlide }],
              }}
            >
              {/* ── HEADER ── */}
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
                  <Ionicons name="storefront-outline" size={24} color="#fff" />
                </LinearGradient>

                <Text style={styles.heading}>
                  {i18n.t("vendor_registration")}
                </Text>
                <Text style={styles.subheading}>
                  {i18n.t("toolkit_subtitle")}
                </Text>

                {/* Step progress */}
                <View style={styles.progressRow}>
                  <View style={[styles.progressDot, styles.progressDotOn]} />
                  <View style={styles.progressLine} />
                  <View style={styles.progressDot} />
                  <View style={styles.progressLine} />
                  <View style={styles.progressDot} />
                </View>
              </LinearGradient>

              {/* ── FORM ── */}
              <View style={styles.formCard}>
                <FormInput
                  label={i18n.t("vendor_id")}
                  icon="card-outline"
                  value={vendorId}
                  onChangeText={setVendorId}
                  placeholder={i18n.t("vendor_id_placeholder")}
                />
                <FormInput
                  label={i18n.t("name")}
                  icon="person-outline"
                  value={name}
                  onChangeText={setName}
                  placeholder={i18n.t("name_placeholder")}
                />
                <FormInput
                  label={i18n.t("mobile")}
                  icon="call-outline"
                  value={mobile}
                  onChangeText={(t) =>
                    setMobile(t.replace(/[^0-9]/g, "").slice(0, 10))
                  }
                  placeholder={i18n.t("mobile_placeholder")}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              {/* ── INDUSTRY ── */}
              <View style={styles.industryCard}>
                <View style={styles.sectionRow}>
                  <View style={styles.accentBar} />
                  <Text style={styles.industryTitle}>{i18n.t("industry")}</Text>
                </View>

                <View style={styles.industryGrid}>
                  {INDUSTRIES.map(({ key, icon }) => {
                    const sel = industry === key;
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => setIndustry(key)}
                        activeOpacity={0.75}
                        style={styles.industryItem}
                      >
                        {sel ? (
                          <LinearGradient
                            colors={["#90d84a", "#54b820"]}
                            style={styles.industryInner}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          >
                            <View style={styles.iconCircleSel}>
                              <Ionicons
                                name={icon as any}
                                size={20}
                                color="#3a8010"
                              />
                            </View>
                            <Text
                              style={styles.industryLabelSel}
                              numberOfLines={1}
                            >
                              {i18n.t(key)}
                            </Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.industryInner}>
                            <View style={styles.iconCircle}>
                              <Ionicons
                                name={icon as any}
                                size={20}
                                color="#6ec832"
                              />
                            </View>
                            <Text
                              style={styles.industryLabel}
                              numberOfLines={1}
                            >
                              {i18n.t(key)}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* ── CTA BUTTON (same style as Home page) ── */}
              <Animated.View
                style={{
                  opacity: fadeBtn,
                  transform: [{ scale: scaleBtn }],
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={handleNext}
                  disabled={loading}
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
                        name="storefront-outline"
                        size={16}
                        color="#3a7a10"
                      />
                    </View>
                    <Text style={styles.ctaText}>
                      {loading ? "..." : i18n.t("next")}
                    </Text>
                    <View style={styles.ctaArrow}>
                      <Ionicons
                        name="arrow-forward"
                        size={13}
                        color="#3a7a10"
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Onboard;

// ─── FormInput styles ─────────────────────────────────────────────────────────
const fi = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#3a6a20",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6fdf0",
    borderRadius: 13,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#eaf8d8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1a3a0a",
    paddingVertical: 12,
  },
  check: { marginLeft: 6 },
});

// ─── Main styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 36,
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
    fontSize: 21,
    fontWeight: "700",
    color: "#1a4008",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  subheading: {
    fontSize: 13,
    color: "#5a8040",
    marginTop: 5,
    textAlign: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 6,
  },
  progressDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#caeaa8",
    borderWidth: 1,
    borderColor: "#a8d880",
  },
  progressDotOn: {
    backgroundColor: "#6ec832",
    borderColor: "#4aaa18",
  },
  progressLine: {
    width: 26,
    height: 2,
    backgroundColor: "#caeaa8",
    borderRadius: 1,
  },

  /* Form card */
  formCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#caeaa8",
  },

  /* Industry card */
  industryCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
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
  industryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a4008",
  },
  industryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  industryItem: {
    width: "22%",
    flexGrow: 1,
  },
  industryInner: {
    backgroundColor: "#f4fcea",
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#caeaa8",
    gap: 8,
    minHeight: 82,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eaf8d8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#c0e898",
  },
  iconCircleSel: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },
  industryLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#3a5a20",
    textAlign: "center",
  },
  industryLabelSel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
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
