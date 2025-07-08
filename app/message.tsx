import i18n from "@/utils/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MessageScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f0f4f8", "#ffffff"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>{i18n.t("carbon_usage_summary")}</Text>
        <Text style={styles.message}>{i18n.t("simple_carbon_message")}</Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("home")}
      >
        <Text style={styles.buttonText}>{i18n.t("go_home")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFE",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0071CE",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#0071CE",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
