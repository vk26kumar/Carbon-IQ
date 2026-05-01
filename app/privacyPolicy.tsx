import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SECTIONS = [
  {
    icon: "information-circle-outline" as const,
    title: "Information We Collect",
    color: "#38aae0",
    body: "We collect information you provide during registration: Vendor ID, name, mobile number, and industry type. We also collect the resource usage data you enter (electricity, water, fuel, chemicals, etc.) to calculate your carbon emission score.",
  },
  {
    icon: "analytics-outline" as const,
    title: "How We Use Your Data",
    color: "#6ec832",
    body: "Your data is used solely to calculate carbon emission scores, generate sustainability recommendations, and display analytics. We do not sell, rent, or share your personal data with third parties for marketing.",
  },
  {
    icon: "server-outline" as const,
    title: "Data Storage",
    color: "#f0b429",
    body: "All data is stored securely in Google Firebase Firestore with industry-standard encryption. Data is associated with your Vendor ID and is accessible only through the Carbon IQ app.",
  },
  {
    icon: "trash-outline" as const,
    title: "Account & Data Deletion",
    color: "#c0392b",
    body: 'You may permanently delete your account and all associated data at any time from the app\'s Settings screen. Select "Delete Account" and confirm. All vendor records and emission reports will be permanently erased within 24 hours.',
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Third-Party Services",
    color: "#8050d0",
    body: "Carbon IQ uses Google Firebase for data storage and processing. Firebase's own privacy policy applies to data handled by their infrastructure. We do not use any advertising or analytics SDKs.",
  },
  {
    icon: "lock-closed-outline" as const,
    title: "Data Security",
    color: "#28a080",
    body: "We implement reasonable technical safeguards to protect your information. However, no method of transmission over the internet is 100% secure. We encourage you to use a unique Vendor ID.",
  },
  {
    icon: "refresh-outline" as const,
    title: "Changes to This Policy",
    color: "#e07830",
    body: "We may update this Privacy Policy from time to time. Any changes will be reflected in the app. Continued use of Carbon IQ after changes constitutes acceptance of the updated policy.",
  },
  {
    icon: "mail-outline" as const,
    title: "Contact Us",
    color: "#6ec832",
    body: "For any privacy-related questions or data deletion requests, contact us at: vkumar26062003@gmail.com",
  },
];

function PolicySection({
  section,
  index,
}: {
  section: (typeof SECTIONS)[0];
  index: number;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 380,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 380,
        delay: index * 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity: fade, transform: [{ translateY: slide }] }}
    >
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <View
            style={[
              styles.sectionIconCircle,
              {
                backgroundColor: section.color + "18",
                borderColor: section.color + "30",
              },
            ]}
          >
            <Ionicons name={section.icon} size={18} color={section.color} />
          </View>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
        <Text style={styles.sectionBody}>{section.body}</Text>
      </View>
    </Animated.View>
  );
}

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { lang } = useLocalSearchParams();

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-18)).current;

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();

    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
                <Text style={styles.heading}>Privacy Policy</Text>
                <View style={{ width: 36 }} />
              </View>

              <LinearGradient
                colors={["#90d84a", "#54b820"]}
                style={styles.headerIconCircle}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={26}
                  color="#fff"
                />
              </LinearGradient>

              <Text style={styles.headerTitle}>Carbon IQ Privacy Policy</Text>
              <Text style={styles.headerSub}>Last updated: May 2025</Text>
              <Text style={styles.headerBody}>
                Carbon IQ is committed to protecting your privacy. This policy
                explains how we collect, use, and protect information you
                provide while using our app.
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* ── POLICY SECTIONS ── */}
          {SECTIONS.map((section, i) => (
            <PolicySection key={section.title} section={section} index={i} />
          ))}

          {/* ── FIREBASE LINK ── */}
          <Animated.View style={{ opacity: headerFade }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                Linking.openURL("https://firebase.google.com/support/privacy")
              }
              style={styles.linkCard}
            >
              <Ionicons name="open-outline" size={16} color="#38aae0" />
              <Text style={styles.linkText}>
                View Google Firebase Privacy Policy
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#38aae0" />
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
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#c8eea0",
    overflow: "hidden",
    alignItems: "center",
    gap: 8,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
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
  headerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a4008",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  headerSub: { fontSize: 12, color: "#7a9a60", fontWeight: "500" },
  headerBody: {
    fontSize: 13,
    color: "#4a6a30",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 4,
    marginTop: 4,
  },

  /* Section cards */
  sectionCard: {
    backgroundColor: "rgba(255,255,255,0.86)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#caeaa8",
    gap: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a4008",
    flex: 1,
  },
  sectionBody: {
    fontSize: 13,
    color: "#4a6a30",
    lineHeight: 20,
    paddingLeft: 46,
  },

  /* Firebase link */
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.80)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#b8daf0",
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: "#38aae0",
    fontWeight: "600",
  },
});
