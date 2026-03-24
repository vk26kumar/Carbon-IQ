import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
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

// ─── Industry config ──────────────────────────────────────────────────────────
const INDUSTRY_CONFIG: Record<
  string,
  {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    lightColor: string;
    fields: {
      key: string;
      icon: keyof typeof Ionicons.glyphMap;
      unit: string;
    }[];
  }
> = {
  textile: {
    icon: "shirt-outline",
    color: "#6ec832",
    lightColor: "#eaf8d8",
    fields: [
      { key: "fabric_produced", icon: "cut-outline", unit: "m" },
      { key: "electricity_used", icon: "flash-outline", unit: "kWh" },
      { key: "water_used", icon: "water-outline", unit: "L" },
      { key: "chemicals_used", icon: "flask-outline", unit: "kg" },
      { key: "diesel_used", icon: "speedometer-outline", unit: "L" },
    ],
  },
  dairy: {
    icon: "cafe-outline",
    color: "#38aae0",
    lightColor: "#e0f4ff",
    fields: [
      { key: "milk_produced", icon: "wine-outline", unit: "L" },
      { key: "cows", icon: "paw-outline", unit: "nos" },
      { key: "electricity_used", icon: "flash-outline", unit: "kWh" },
      { key: "fodder_used", icon: "leaf-outline", unit: "kg" },
      { key: "diesel_used", icon: "speedometer-outline", unit: "L" },
    ],
  },
  agriculture: {
    icon: "leaf-outline",
    color: "#28b060",
    lightColor: "#e0f8ec",
    fields: [
      { key: "land_area", icon: "map-outline", unit: "acres" },
      { key: "fertilizer_used", icon: "flask-outline", unit: "kg" },
      { key: "electricity_used", icon: "flash-outline", unit: "kWh" },
      { key: "diesel_used", icon: "speedometer-outline", unit: "L" },
      { key: "crop_yield", icon: "bar-chart-outline", unit: "kg" },
    ],
  },
  manufacturing: {
    icon: "business-outline",
    color: "#e07830",
    lightColor: "#fff0e0",
    fields: [
      { key: "units_produced", icon: "cube-outline", unit: "nos" },
      { key: "electricity_used", icon: "flash-outline", unit: "kWh" },
      { key: "water_used", icon: "water-outline", unit: "L" },
      { key: "chemicals_used", icon: "flask-outline", unit: "kg" },
      { key: "diesel_used", icon: "speedometer-outline", unit: "L" },
    ],
  },
  food_processing: {
    icon: "restaurant-outline",
    color: "#d09020",
    lightColor: "#fff8e0",
    fields: [
      { key: "units_produced", icon: "cube-outline", unit: "nos" },
      { key: "electricity_used", icon: "flash-outline", unit: "kWh" },
      { key: "water_used", icon: "water-outline", unit: "L" },
      { key: "chemicals_used", icon: "flask-outline", unit: "kg" },
      { key: "diesel_used", icon: "speedometer-outline", unit: "L" },
    ],
  },
  logistics: {
    icon: "car-outline",
    color: "#8050d0",
    lightColor: "#f0e8ff",
    fields: [
      { key: "units_produced", icon: "cube-outline", unit: "nos" },
      { key: "electricity_used", icon: "flash-outline", unit: "kWh" },
      { key: "water_used", icon: "water-outline", unit: "L" },
      { key: "chemicals_used", icon: "flask-outline", unit: "kg" },
      { key: "diesel_used", icon: "speedometer-outline", unit: "L" },
    ],
  },
  electronics: {
    icon: "hardware-chip-outline",
    color: "#d03878",
    lightColor: "#ffe0ee",
    fields: [
      { key: "units_produced", icon: "cube-outline", unit: "nos" },
      { key: "electricity_used", icon: "flash-outline", unit: "kWh" },
      { key: "water_used", icon: "water-outline", unit: "L" },
      { key: "chemicals_used", icon: "flask-outline", unit: "kg" },
      { key: "diesel_used", icon: "speedometer-outline", unit: "L" },
    ],
  },
  pharmaceuticals: {
    icon: "medkit-outline",
    color: "#c02828",
    lightColor: "#ffe8e8",
    fields: [
      { key: "units_produced", icon: "cube-outline", unit: "nos" },
      { key: "electricity_used", icon: "flash-outline", unit: "kWh" },
      { key: "water_used", icon: "water-outline", unit: "L" },
      { key: "chemicals_used", icon: "flask-outline", unit: "kg" },
      { key: "diesel_used", icon: "speedometer-outline", unit: "L" },
    ],
  },
};

// ─── Single animated field ────────────────────────────────────────────────────
function FieldInput({
  fieldKey,
  icon,
  unit,
  value,
  onChange,
  accentColor,
  index,
}: {
  fieldKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  unit: string;
  value: string;
  onChange: (k: string, v: string) => void;
  accentColor: string;
  index: number;
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const entranceFade = useRef(new Animated.Value(0)).current;
  const entranceSlide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceFade, {
        toValue: 1,
        duration: 320,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(entranceSlide, {
        toValue: 0,
        duration: 320,
        delay: index * 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 160,
      useNativeDriver: false,
    }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#caeaa8", accentColor],
  });

  const filled = value.length > 0;

  return (
    <Animated.View
      style={[
        styles.fieldWrap,
        { opacity: entranceFade, transform: [{ translateY: entranceSlide }] },
      ]}
    >
      {/* Label */}
      <View style={styles.fieldLabelRow}>
        <View
          style={[
            styles.fieldIconBox,
            { backgroundColor: focused ? accentColor + "22" : "#f0fce8" },
          ]}
        >
          <Ionicons
            name={icon}
            size={14}
            color={focused ? accentColor : "#8aba70"}
          />
        </View>
        <Text style={styles.fieldLabel}>{i18n.t(fieldKey)}</Text>
        {filled && (
          <Ionicons
            name="checkmark-circle"
            size={15}
            color="#6ec832"
            style={{ marginLeft: "auto" }}
          />
        )}
      </View>

      {/* Input */}
      <Animated.View style={[styles.fieldRow, { borderColor }]}>
        <TextInput
          keyboardType="numeric"
          value={value}
          onChangeText={(t) => onChange(fieldKey, t)}
          style={styles.fieldInput}
          placeholder="0"
          placeholderTextColor="#b8d8a8"
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType="next"
        />
        <View
          style={[styles.unitBadge, { backgroundColor: accentColor + "18" }]}
        >
          <Text style={[styles.unitText, { color: accentColor }]}>{unit}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
const FormScreen = () => {
  const { lang, vendorId, name, industry } = useLocalSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-18)).current;
  const scaleBtn = useRef(new Animated.Value(0.94)).current;
  const fadeBtn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();

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

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const industryKey = industry?.toString() ?? "";
  const config = INDUSTRY_CONFIG[industryKey];
  const fields = config?.fields ?? [];
  const accentColor = config?.color ?? "#6ec832";
  const lightColor = config?.lightColor ?? "#eaf8d8";
  const industryIcon = config?.icon ?? "leaf-outline";

  const filledCount = fields.filter(
    (f) => (formData[f.key] ?? "").trim() !== "",
  ).length;
  const isAllFilled = filledCount === fields.length && fields.length > 0;
  const progressPct =
    fields.length > 0 ? (filledCount / fields.length) * 100 : 0;

  const handleSubmit = async () => {
    if (!isAllFilled) {
      alert(i18n.t("fill_all_fields"));
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "formdata"), {
        vendorId: vendorId?.toString(),
        industry: industryKey,
        ...formData,
        timestamp: new Date().toISOString(),
      });
      router.push({
        pathname: "/results",
        params: { lang, industry, vendorId, ...formData },
      });
    } catch {
      alert(i18n.t("error_saving_data"));
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
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {/* ── HEADER CARD ── */}
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
                <View
                  style={[
                    styles.industryCircle,
                    {
                      backgroundColor: lightColor,
                      borderColor: accentColor + "60",
                    },
                  ]}
                >
                  <Ionicons name={industryIcon} size={34} color={accentColor} />
                </View>

                <Text style={styles.heading}>
                  {i18n.t("industry")}: {i18n.t(industryKey)}
                </Text>

                <View style={styles.vendorChip}>
                  <Ionicons
                    name="person-circle-outline"
                    size={13}
                    color="#5a8040"
                  />
                  <Text style={styles.vendorText}>
                    {name} · {vendorId}
                  </Text>
                </View>

                {/* Live progress bar */}
                <View style={styles.progressWrap}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${progressPct}%` as any,
                          backgroundColor: accentColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressLabel, { color: accentColor }]}>
                    {filledCount}/{fields.length}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* ── FIELDS CARD ── */}
            <View style={styles.fieldsCard}>
              <View style={styles.sectionRow}>
                <View
                  style={[styles.accentBar, { backgroundColor: accentColor }]}
                />
                <Text style={styles.fieldsTitle}>{i18n.t("form_data")}</Text>
              </View>

              {fields.map((field, index) => (
                <FieldInput
                  key={field.key}
                  fieldKey={field.key}
                  icon={field.icon}
                  unit={field.unit}
                  value={formData[field.key] ?? ""}
                  onChange={handleChange}
                  accentColor={accentColor}
                  index={index}
                />
              ))}
            </View>

            {/* ── CTA BUTTON (matches Home page style) ── */}
            <Animated.View
              style={{
                opacity: fadeBtn,
                transform: [{ scale: scaleBtn }],
              }}
            >
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={handleSubmit}
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
                      name="checkmark-done-outline"
                      size={16}
                      color="#3a7a10"
                    />
                  </View>
                  <Text style={styles.ctaText}>
                    {loading ? "..." : i18n.t("submit")}
                  </Text>
                  <View style={styles.ctaArrow}>
                    <Ionicons name="arrow-forward" size={13} color="#3a7a10" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FormScreen;

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
  industryCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1.5,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a4008",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  vendorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    backgroundColor: "#eaf8d8",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c0e898",
  },
  vendorText: {
    fontSize: 12,
    color: "#3a6a20",
    fontWeight: "500",
  },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    width: "100%",
    paddingHorizontal: 4,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#d8f0c0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "700",
    minWidth: 26,
    textAlign: "right",
  },

  /* Fields card */
  fieldsCard: {
    backgroundColor: "rgba(255,255,255,0.86)",
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
  },
  fieldsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a4008",
  },

  /* Field item */
  fieldWrap: { marginBottom: 14 },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 7,
  },
  fieldIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2e5a10",
    flex: 1,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6fdf0",
    borderRadius: 13,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1a3a0a",
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  unitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 4,
    borderRadius: 8,
    minWidth: 46,
    alignItems: "center",
  },
  unitText: {
    fontSize: 11,
    fontWeight: "700",
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
