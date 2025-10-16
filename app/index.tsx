import { router } from "expo-router";
import React, { useState } from "react";
import {
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>{i18n.t("carbon_toolkit_title")}</Text>
          <Text style={styles.subtitle}>{i18n.t("carbon_toolkit_subtitle")}</Text>

          <Text style={styles.languagePrompt}>{i18n.t("select_language")}</Text>

          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.languageGrid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.languageCard,
                  language === item.code && styles.selectedCard,
                ]}
                onPress={() => handleLanguageSelect(item.code)}
              >
                <Text
                  style={[
                    styles.languageText,
                    language === item.code && styles.selectedText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />

          <Image
            source={require("../assets/images/walmart.png")}
            style={styles.dividerImage}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>{i18n.t("next")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0071CE",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  languagePrompt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  languageGrid: {
    alignItems: "center",
    justifyContent: "center",
  },
  languageCard: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
    margin: 10,
    minWidth: 120,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedCard: {
    backgroundColor: "#0071CE",
    borderColor: "#005bb5",
  },
  languageText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "700",
  },
  dividerImage: {
    width: 300,
    height: 300,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#0071CE",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
