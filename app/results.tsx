import { exportCSV } from "@/utils/exportToCSV";
import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text } from "react-native";

const ResultScreen = () => {

    const router = useRouter();

  const {
    lang,
    vendorId,
    industry,
    fabric_produced,
    electricity_used,
    water_used,
    chemicals_used,
    diesel_used,
    milk_produced,
    cows,
    fodder_used,
  } = useLocalSearchParams();

  const [score, setScore] = useState(0);
  const [normalized, setNormalized] = useState(0);
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [standardNormalized, setStandardNormalized] = useState(0);
  const [tips, setTips] = useState<string[]>([]);
  const [overusedItems, setOverusedItems] = useState<string[]>([]);

  const formData = industry === "textile"
    ? { fabric_produced, electricity_used, water_used, chemicals_used, diesel_used }
    : { milk_produced, cows, electricity_used, fodder_used, diesel_used };

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();
  }, [lang]);

  useEffect(() => {
    const calculateResult = async () => {
      let total = 0;
      let normalizedVal = 0;
      const exceeded: string[] = [];

      if (industry === "textile") {
        const fabric = Number(fabric_produced);
        const elec = Number(electricity_used);
        const water = Number(water_used);
        const chem = Number(chemicals_used);
        const diesel = Number(diesel_used);

        const stdElec = Number((fabric * 0.3).toFixed(2));
        const stdWater = Number((fabric * 50).toFixed(2));
        const stdChem = Number((fabric * 0.1).toFixed(2));
        const stdDiesel = Number((fabric * 0.08).toFixed(2));  //limit upto two decimal place


        if (elec > stdElec) exceeded.push(`${i18n.t("electricity_used")} (${i18n.t("allowed")}: ${stdElec}, ${i18n.t("used")}: ${elec})`);
        if (water > stdWater) exceeded.push(`${i18n.t("water_used")} (${i18n.t("allowed")}: ${stdWater}, ${i18n.t("used")}: ${water})`);
        if (chem > stdChem) exceeded.push(`${i18n.t("chemicals_used")} (${i18n.t("allowed")}: ${stdChem}, ${i18n.t("used")}: ${chem})`);
        if (diesel > stdDiesel) exceeded.push(`${i18n.t("diesel_used")} (${i18n.t("allowed")}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`);

        total = fabric * 0.2 + elec * 0.7 + water * 0.05 + chem * 0.2 + diesel * 2;
        normalizedVal = fabric > 0 ? total / fabric : 0;
        setTips(i18n.t("textile_tips"));
        setStandardNormalized(0.6);
      } else if (industry === "dairy") {
        const milk = Number(milk_produced);
        const cowsCount = Number(cows);
        const elec = Number(electricity_used);
        const fodder = Number(fodder_used);
        const diesel = Number(diesel_used);

        const stdElec = Number((milk * 0.25).toFixed(2));
        const stdFodder = Number((milk * 0.3).toFixed(2));
        const stdDiesel = Number((milk * 0.05).toFixed(2));

        if (elec > stdElec) exceeded.push(`${i18n.t("electricity_used")} (${i18n.t("allowed")}: ${stdElec}, ${i18n.t("used")}: ${elec})`);
        if (fodder > stdFodder) exceeded.push(`${i18n.t("fodder_used")} (${i18n.t("allowed")}: ${stdFodder}, ${i18n.t("used")}: ${fodder})`);
        if (diesel > stdDiesel) exceeded.push(`${i18n.t("diesel_used")} (${i18n.t("allowed")}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`);

        total = milk * 0.1 + cowsCount * 5 + elec * 0.5 + fodder * 0.3 + diesel * 1.5;
        normalizedVal = milk > 0 ? total / milk : 0;
        setTips(i18n.t("dairy_tips"));
        setStandardNormalized(0.8);
      }

      setOverusedItems(exceeded);
      setScore(Number(total.toFixed(2)));
      setNormalized(Number(normalizedVal.toFixed(2)));

      const stars = normalizedVal < 0.3 ? 5 : normalizedVal < 0.6 ? 4 : normalizedVal < 0.9 ? 3 : normalizedVal < 1.2 ? 2 : 1;
      const ratingKey = stars === 5 ? "rating_outstanding" : stars === 4 ? "rating_excellent" : stars === 3 ? "rating_good" : stars === 2 ? "rating_average" : "rating_poor";
      setRating(`${i18n.t(ratingKey)} (${stars}/5)`);
      setStatus(exceeded.length > 0 ? i18n.t("status_overuse") : i18n.t("status_within"));

      try {
        await addDoc(collection(db, "results"), {
          vendorId,
          industry,
          formData,
          score: Number(total.toFixed(2)),
          normalized: Number(normalizedVal.toFixed(2)),
          rating,
          status,
          tips,
          exceeded,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error saving result:", error);
      }
    };

    calculateResult();
  }, []);

  const handleExportCSV = async () => {
    if (lang) {
    i18n.locale = lang.toString(); 
  }
    await exportCSV({
      vendorId: vendorId?.toString() ?? "",
      industry: industry?.toString() ?? "",
      formData,
      score,
      normalized,
      rating,
      status,
      tips,
      exceeded: overusedItems,
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{i18n.t("form_data")}</Text>
      {Object.entries(formData).map(([key, value]) => (
        <Text key={key}>{i18n.t(key)}: {value}</Text>
      ))}

      <Text style={{ marginTop: 15, fontWeight: "bold", fontSize: 18 }}>{i18n.t("carbon_footprint_results")}</Text>
      <Text>{i18n.t("vendor_id")}: {vendorId}</Text>
      <Text>{i18n.t("industry")}: {i18n.t(industry ?? "")}</Text>
      <Text>{i18n.t("total_emission_score")}: {score}</Text>
      <Text>{i18n.t("normalized_emission_score")}: {normalized} {i18n.t("co2_per_unit")}</Text>
      <Text>{i18n.t("rating")}: {rating}</Text>
      <Text>{i18n.t("status")}: {status}</Text>
      <Text>{i18n.t("govt_standard_normalized_score")}: {standardNormalized} {i18n.t("co2_per_unit")}</Text>

      {overusedItems.length > 0 && (
        <>
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>{i18n.t("exceeded_items")}</Text>
          {overusedItems.map((item, idx) => (
            <Text key={idx}>• {item}</Text>
          ))}
        </>
      )}

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>{i18n.t("suggestions")}</Text>
      {tips.map((tip, idx) => (
        <Text key={idx}>• {tip}</Text>
      ))}

      <Button title={i18n.t("download_csv")} onPress={handleExportCSV} />
      <Button
        title={i18n.t("detailed_analysis")}
        onPress={() =>
          router.push({
            pathname: "/detailAnalysis",
            params: { vendorId, industry, lang },
          })
        }
      />
    </ScrollView>
  );
};

export default ResultScreen;
