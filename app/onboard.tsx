import i18n from "@/utils/i18n";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, View, Button } from "react-native";
import { useRouter } from "expo-router";
import { db } from "@/utils/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

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

  const handleNext = async () => {
    console.log("Saving vendor data:")
    try {
        await addDoc(collection(db, "vendors"), {
          vendorId,
          name,
          mobile,
          industry,
          createdAt: new Date().toISOString(),
        });
        console.log("Vendor data saved successfully:");
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    router.push({
        pathname: "/form",
        params: {
            lang :i18n.locale,
            vendorId,
            name,
            mobile,
            industry,
        },
    });
  }

  return (
    <View>
      <Text>{i18n.t("vendor_id")}</Text>
      <TextInput 
      value={vendorId} 
      onChangeText={setVendorId} />

      <Text>{i18n.t("name")}</Text>
      <TextInput 
      value={name} 
      onChangeText={setName} />

      <Text>{i18n.t("mobile")}</Text>
      <TextInput
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <Text>{i18n.t("industry")}</Text>
      <Button
        title={i18n.t("textile")}
        onPress={() => setIndustry("textile")}
      />
      <Button 
      title={i18n.t("dairy")} 
      onPress={() => setIndustry("dairy")} />

      <Button 
      title={i18n.t("next")} 
      onPress={handleNext} />
    </View>
  );
};

export default Onboard;