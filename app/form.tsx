import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Industry images
const industryImages: { [key: string]: any } = {
  textile: require("@/assets/images/textile.png"),
  dairy: require("@/assets/images/dairy.png"),
  agriculture: require("@/assets/images/agriculture.png"),
  manufacturing: require("@/assets/images/manufacturing.png"),
};

const FormScreen = () => {
  const { lang, vendorId, name, mobile, industry } = useLocalSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (lang) {
      i18n.locale = lang.toString();
    }
  }, [lang]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    let requiredKeys: string[] = [];

    if (industry === "textile") {
      requiredKeys = [
        "fabric_produced",
        "electricity_used",
        "water_used",
        "chemicals_used",
        "diesel_used",
      ];
    } else if (industry === "dairy") {
      requiredKeys = [
        "milk_produced",
        "cows",
        "electricity_used",
        "fodder_used",
        "diesel_used",
      ];
    } else if (industry === "agriculture") {
      requiredKeys = [
        "land_area",
        "fertilizer_used",
        "electricity_used",
        "diesel_used",
        "crop_yield",
      ];
    } else if (industry === "manufacturing") {
      requiredKeys = [
        "units_produced",
        "electricity_used",
        "water_used",
        "chemicals_used",
        "diesel_used",
      ];
    }

    const hasEmptyFields = requiredKeys.some(
      (key) => !formData[key] || formData[key].trim() === ""
    );
    if (hasEmptyFields) {
      alert(i18n.t("fill_all_fields"));
      return;
    }

    const formPayload = {
      vendorId: vendorId?.toString(),
      industry: industry?.toString(),
      ...formData,
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "formdata"), formPayload);
      router.push({
        pathname: "/results",
        params: { lang, industry, vendorId, ...formData },
      });
    } catch (error) {
      console.error("Error saving form data:", error);
      alert(i18n.t("error_saving_data"));
    }
  };

  const renderTextInput = (
    fieldKey: string,
    label: string,
    iconName: keyof typeof Ionicons.glyphMap
  ) => (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Ionicons
          name={iconName}
          size={18}
          color="#0071CE"
          style={styles.labelIcon}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        keyboardType="numeric"
        value={formData[fieldKey] || ""}
        onChangeText={(text) => handleChange(fieldKey, text)}
        style={styles.input}
        placeholder="0"
        placeholderTextColor="#999"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>
          {i18n.t("industry")}: {i18n.t(industry?.toString() || "")}
        </Text>

        {industry && industryImages[industry as string] && (
          <Image
            source={industryImages[industry as string]}
            style={styles.industryImage}
            resizeMode="contain"
          />
        )}

        {industry === "textile" && (
          <>
            {renderTextInput(
              "fabric_produced",
              i18n.t("fabric_produced"),
              "cut-outline"
            )}
            {renderTextInput(
              "electricity_used",
              i18n.t("electricity_used"),
              "flash-outline"
            )}
            {renderTextInput(
              "water_used",
              i18n.t("water_used"),
              "water-outline"
            )}
            {renderTextInput(
              "chemicals_used",
              i18n.t("chemicals_used"),
              "flask-outline"
            )}
            {renderTextInput(
              "diesel_used",
              i18n.t("diesel_used"),
              "speedometer-outline"
            )}
          </>
        )}

        {industry === "dairy" && (
          <>
            {renderTextInput(
              "milk_produced",
              i18n.t("milk_produced"),
              "wine-outline"
            )}
            {renderTextInput("cows", i18n.t("cows"), "paw-outline")}
            {renderTextInput(
              "electricity_used",
              i18n.t("electricity_used"),
              "flash-outline"
            )}
            {renderTextInput(
              "fodder_used",
              i18n.t("fodder_used"),
              "leaf-outline"
            )}
            {renderTextInput(
              "diesel_used",
              i18n.t("diesel_used"),
              "speedometer-outline"
            )}
          </>
        )}

        {industry === "agriculture" && (
          <>
            {renderTextInput("land_area", i18n.t("land_area"), "map-outline")}
            {renderTextInput(
              "fertilizer_used",
              i18n.t("fertilizer_used"),
              "flask-outline"
            )}
            {renderTextInput(
              "electricity_used",
              i18n.t("electricity_used"),
              "flash-outline"
            )}
            {renderTextInput(
              "diesel_used",
              i18n.t("diesel_used"),
              "speedometer-outline"
            )}
            {renderTextInput(
              "crop_yield",
              i18n.t("crop_yield"),
              "bar-chart-outline"
            )}
          </>
        )}

        {industry === "manufacturing" && (
          <>
            {renderTextInput(
              "units_produced",
              i18n.t("units_produced"),
              "cube-outline"
            )}
            {renderTextInput(
              "electricity_used",
              i18n.t("electricity_used"),
              "flash-outline"
            )}
            {renderTextInput(
              "water_used",
              i18n.t("water_used"),
              "water-outline"
            )}
            {renderTextInput(
              "chemicals_used",
              i18n.t("chemicals_used"),
              "flask-outline"
            )}
            {renderTextInput(
              "diesel_used",
              i18n.t("diesel_used"),
              "speedometer-outline"
            )}
          </>
        )}

        <View style={styles.submitWrapper}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>{i18n.t("submit")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 50,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0071CE",
    marginBottom: 16,
    textAlign: "center",
  },
  industryImage: {
    width: "100%",
    height: 180,
    marginBottom: 24,
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  submitWrapper: {
    alignItems: "center",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#0071CE",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: 160,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
