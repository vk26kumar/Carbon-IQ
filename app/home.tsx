import i18n from "@/utils/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const { lang } = useLocalSearchParams();

  if (lang) {
    i18n.locale = lang.toString();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Section */}
      <LinearGradient colors={["#E0F7FA", "#FAFCFE"]} style={styles.hero}>
        <Text style={styles.title}>{i18n.t("carbon_toolkit_title")}</Text>
        <Text style={styles.subtitle}>{i18n.t("carbon_toolkit_subtitle")}</Text>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.cardSection}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {i18n.t("feature_tracking") || "Accurate Tracking"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {i18n.t("feature_comparison") || "Industry Comparison"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {i18n.t("feature_insights") || "Actionable Insights"}
          </Text>
        </View>
      </View>

      {/* Why Section */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>
          {i18n.t("why_use_toolkit") || "Why use this Toolkit?"}
        </Text>
        <Text style={styles.sectionText}>
          {i18n.t("home_purpose") ||
            "Empowers vendors to track, compare,\nand report emissions accurately.\nSupports transparency and sustainability."}
        </Text>
      </View>

      {/* How it Works Section */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>
          {i18n.t("how_it_works") || "How It Works"}
        </Text>
        <Text style={styles.sectionText}>
          1. {i18n.t("register") || "Register your business."}
        </Text>
        <Text style={styles.sectionText}>
          2. {i18n.t("fill_form") || "Submit usage data."}
        </Text>
        <Text style={styles.sectionText}>
          3. {i18n.t("get_report") || "Get your score and tips."}
        </Text>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: "/onboard", params: { lang } })}
      >
        <Text style={styles.buttonText}>{i18n.t("vendor_registration")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: "#FAFCFE",
  },
  hero: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0071CE",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  cardSection: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0071CE",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0071CE",
    paddingVertical: 15, // smaller height
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15, // slightly smaller font
    fontWeight: "600",
  },
});
