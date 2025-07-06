import { TextInput } from "react-native";
import { Text, View, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import i18n from "@/utils/i18n";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "@/utils/firebaseConfig";
import { addDoc, collection, doc } from "firebase/firestore";

const FormScreen = () => {
  const { lang, vendorId, name, mobile, industry } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (lang) {
      i18n.locale = lang.toString();
    }
  }, [lang]);

  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const formPayload = {
      vendorId: vendorId?.toString(),
      industry: industry?.toString(),
      ...formData,
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "formdata"), formPayload);

    console.log("✅ Form data saved to 'formdata' collection");

      router.push({
        pathname: "/results",
        params: {
          lang,
          industry,
          vendorId,
          ...formData,
        },
      });
    } catch (error) {
      console.error("Error saving form data:", error);
      alert(i18n.t("error_saving_data"));
    }
  };

  const renderTextInput = (fieldKey: string, label: string) => (
    <>
      <Text>{label}</Text>
      <TextInput
        keyboardType="numeric"
        value={formData[fieldKey] || ""}
        onChangeText={(text) => handleChange(fieldKey, text)}
      />
    </>
  );

  return (
    <ScrollView>
      <Text>
        {i18n.t("industry")}: {industry}
      </Text>

      {industry === "textile" ? (
        <>
          {renderTextInput("fabric_produced", i18n.t("fabric_produced"))}
          {renderTextInput("electricity_used", i18n.t("electricity_used"))}
          {renderTextInput("water_used", i18n.t("water_used"))}
          {renderTextInput("chemicals_used", i18n.t("chemicals_used"))}
          {renderTextInput("diesel_used", i18n.t("diesel_used"))}
        </>
      ) : (
        <>
          {renderTextInput("milk_produced", i18n.t("milk_produced"))}
          {renderTextInput("cows", i18n.t("cows"))}
          {renderTextInput("electricity_used", i18n.t("electricity_used"))}
          {renderTextInput("fodder_used", i18n.t("fodder_used"))}
          {renderTextInput("diesel_used", i18n.t("diesel_used"))}
        </>
      )}

      <Button title={i18n.t("submit")} onPress={handleSubmit} />
    </ScrollView>
  );
};

export default FormScreen;
