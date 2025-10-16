import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Onboard = () => {
  const { lang } = useLocalSearchParams();
  const router = useRouter();

  const [vendorId, setVendorId] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    if (lang) {
      i18n.locale = lang.toString();
    }
  }, [lang]);

  const isFormValid = vendorId && name && mobile && industry;

  const handleNext = async () => {
    if (!isFormValid) {
      Alert.alert(i18n.t("fill_all_fields"));
      return;
    }

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
        params: {
          lang: i18n.locale,
          vendorId,
          name,
          mobile,
          industry,
        },
      });
    } catch (error) {
      console.error("Error adding document:", error);
      Alert.alert("Error", "Failed to save vendor data.");
    }
  };

  const industries = [
    { key: "textile", icon: "shirt-outline" },
    { key: "dairy", icon: "cafe-outline" },
    { key: "agriculture", icon: "leaf-outline" },
    { key: "manufacturing", icon: "business-outline" },
    { key: "food_processing", icon: "restaurant-outline" },
    { key: "logistics", icon: "car-outline" },
    { key: "electronics", icon: "hardware-chip-outline" },
    { key: "pharmaceuticals", icon: "medkit-outline" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{i18n.t("vendor_registration")}</Text>
        <Text style={styles.subheading}>{i18n.t("toolkit_subtitle")}</Text>

        <Text style={styles.label}>{i18n.t("vendor_id")}</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons
            name="card-outline"
            size={20}
            color="#0071CE"
            style={styles.icon}
          />
          <TextInput
            value={vendorId}
            onChangeText={setVendorId}
            placeholder={i18n.t("vendor_id_placeholder")}
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>{i18n.t("name")}</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#0071CE"
            style={styles.icon}
          />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={i18n.t("name_placeholder")}
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>{i18n.t("mobile")}</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons
            name="call-outline"
            size={20}
            color="#0071CE"
            style={styles.icon}
          />
          <TextInput
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            placeholder={i18n.t("mobile_placeholder")}
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>{i18n.t("industry")}</Text>
        <View style={styles.buttonGroup}>
          {industries.map(({ key, icon }) => (
            <TouchableOpacity
              key={key}
              style={[styles.button, industry === key && styles.selected]}
              onPress={() => setIndustry(key)}
            >
              <Ionicons
                name={icon as any}
                size={18}
                color={industry === key ? "#fff" : "#333"}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={[
                  styles.buttonText,
                  industry === key && styles.selectedText,
                ]}
              >
                {i18n.t(key)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.centeredButton}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !isFormValid && styles.inactiveNextButton,
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>{i18n.t("next")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0071CE",
    marginTop: 40,
    textAlign: "center",
  },
  subheading: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 4,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    width: "48%",
    marginVertical: 6,
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    backgroundColor: "#0071CE",
    borderColor: "#005bb5",
  },
  buttonText: {
    color: "#1A1A1A",
    fontWeight: "600",
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "700",
  },
  centeredButton: {
    marginTop: 28,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#0071CE",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  inactiveNextButton: {
    opacity: 1,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default Onboard;
