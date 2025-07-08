import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    land_area,
    fertilizer_used,
    crop_yield,
    units_produced,
  } = useLocalSearchParams();

  const [score, setScore] = useState(0);
  const [normalized, setNormalized] = useState(0);
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [standardNormalized, setStandardNormalized] = useState(0);
  const [tips, setTips] = useState<string[]>([]);
  const [overusedItems, setOverusedItems] = useState<string[]>([]);

  const formData =
    industry === "textile"
      ? {
          fabric_produced,
          electricity_used,
          water_used,
          chemicals_used,
          diesel_used,
        }
      : industry === "dairy"
      ? { milk_produced, cows, electricity_used, fodder_used, diesel_used }
      : industry === "agriculture"
      ? {
          land_area,
          fertilizer_used,
          electricity_used,
          diesel_used,
          crop_yield,
        }
      : {
          units_produced,
          electricity_used,
          water_used,
          chemicals_used,
          diesel_used,
        };

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();
  }, [lang]);

  useEffect(() => {
    const calculateResult = async () => {
      let total = 0;
      let normalizedVal = 0;
      const exceeded: string[] = [];

      const toNum = (val: any) => Number(val) || 0;

      if (industry === "textile") {
        const fabric = toNum(fabric_produced);
        const elec = toNum(electricity_used);
        const water = toNum(water_used);
        const chem = toNum(chemicals_used);
        const diesel = toNum(diesel_used);

        const stdElec = Number((fabric * 0.3).toFixed(2));
        const stdWater = Number((fabric * 50).toFixed(2));
        const stdChem = Number((fabric * 0.1).toFixed(2));
        const stdDiesel = Number((fabric * 0.08).toFixed(2));

        if (elec > stdElec)
          exceeded.push(
            `${i18n.t("electricity_used")} (${i18n.t(
              "allowed"
            )}: ${stdElec}, ${i18n.t("used")}: ${elec})`
          );
        if (water > stdWater)
          exceeded.push(
            `${i18n.t("water_used")} (${i18n.t(
              "allowed"
            )}: ${stdWater}, ${i18n.t("used")}: ${water})`
          );
        if (chem > stdChem)
          exceeded.push(
            `${i18n.t("chemicals_used")} (${i18n.t(
              "allowed"
            )}: ${stdChem}, ${i18n.t("used")}: ${chem})`
          );
        if (diesel > stdDiesel)
          exceeded.push(
            `${i18n.t("diesel_used")} (${i18n.t(
              "allowed"
            )}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`
          );

        total =
          fabric * 0.2 + elec * 0.7 + water * 0.005 + chem * 0.2 + diesel * 1.2;
        normalizedVal = fabric > 0 ? total / fabric : 0;
        setStandardNormalized(0.6);
        setTips(
          i18n.t("textile_tips", { returnObjects: true }) as unknown as string[]
        );
      } else if (industry === "dairy") {
        const milk = toNum(milk_produced);
        const cowsCount = toNum(cows);
        const elec = toNum(electricity_used);
        const fodder = toNum(fodder_used);
        const diesel = toNum(diesel_used);

        const stdElec = milk * 0.25;
        const stdFodder = milk * 0.3;
        const stdDiesel = milk * 0.05;

        if (elec > stdElec)
          exceeded.push(
            `${i18n.t("electricity_used")} (${i18n.t(
              "allowed"
            )}: ${stdElec}, ${i18n.t("used")}: ${elec})`
          );
        if (fodder > stdFodder)
          exceeded.push(
            `${i18n.t("fodder_used")} (${i18n.t(
              "allowed"
            )}: ${stdFodder}, ${i18n.t("used")}: ${fodder})`
          );
        if (diesel > stdDiesel)
          exceeded.push(
            `${i18n.t("diesel_used")} (${i18n.t(
              "allowed"
            )}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`
          );

        total =
          milk * 0.1 + cowsCount * 5 + elec * 0.5 + fodder * 0.3 + diesel * 1.5;
        normalizedVal = milk > 0 ? total / milk : 0;
        setStandardNormalized(0.8);
        setTips(
          i18n.t("dairy_tips", { returnObjects: true }) as unknown as string[]
        );
      } else if (industry === "agriculture") {
        const land = toNum(land_area);
        const fert = toNum(fertilizer_used);
        const elec = toNum(electricity_used);
        const diesel = toNum(diesel_used);
        const yieldCrop = toNum(crop_yield);

        const stdFert = land * 0.5;
        const stdDiesel = land * 0.1;
        const stdElec = land * 1.0;

        if (fert > stdFert)
          exceeded.push(
            `${i18n.t("fertilizer_used")} (${i18n.t(
              "allowed"
            )}: ${stdFert}, ${i18n.t("used")}: ${fert})`
          );
        if (elec > stdElec)
          exceeded.push(
            `${i18n.t("electricity_used")} (${i18n.t(
              "allowed"
            )}: ${stdElec}, ${i18n.t("used")}: ${elec})`
          );
        if (diesel > stdDiesel)
          exceeded.push(
            `${i18n.t("diesel_used")} (${i18n.t(
              "allowed"
            )}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`
          );

        total = fert * 0.6 + elec * 0.3 + diesel * 2;
        normalizedVal = yieldCrop > 0 ? total / yieldCrop : 0;
        setStandardNormalized(0.5);
        setTips(
          i18n.t("agriculture_tips", {
            returnObjects: true,
          }) as unknown as string[]
        );
      } else if (industry === "manufacturing") {
        const units = toNum(units_produced);
        const elec = toNum(electricity_used);
        const water = toNum(water_used);
        const chem = toNum(chemicals_used);
        const diesel = toNum(diesel_used);

        const stdElec = units * 0.4;
        const stdWater = units * 10;
        const stdChem = units * 0.05;
        const stdDiesel = units * 0.1;

        if (elec > stdElec)
          exceeded.push(
            `${i18n.t("electricity_used")} (${i18n.t(
              "allowed"
            )}: ${stdElec}, ${i18n.t("used")}: ${elec})`
          );
        if (water > stdWater)
          exceeded.push(
            `${i18n.t("water_used")} (${i18n.t(
              "allowed"
            )}: ${stdWater}, ${i18n.t("used")}: ${water})`
          );
        if (chem > stdChem)
          exceeded.push(
            `${i18n.t("chemicals_used")} (${i18n.t(
              "allowed"
            )}: ${stdChem}, ${i18n.t("used")}: ${chem})`
          );
        if (diesel > stdDiesel)
          exceeded.push(
            `${i18n.t("diesel_used")} (${i18n.t(
              "allowed"
            )}: ${stdDiesel}, ${i18n.t("used")}: ${diesel})`
          );

        total = elec * 0.6 + water * 0.05 + chem * 0.3 + diesel * 1.8;
        normalizedVal = units > 0 ? total / units : 0;
        setStandardNormalized(1.0);
        setTips(
          i18n.t("manufacturing_tips", {
            returnObjects: true,
          }) as unknown as string[]
        );
      }

      const stars =
        normalizedVal < 0.3
          ? 5
          : normalizedVal < 0.6
          ? 4
          : normalizedVal < 0.9
          ? 3
          : normalizedVal < 1.2
          ? 2
          : 1;

      const ratingKey = [
        "rating_poor",
        "rating_average",
        "rating_good",
        "rating_excellent",
        "rating_outstanding",
      ][stars - 1];

      setScore(Number(total.toFixed(2)));
      setNormalized(Number(normalizedVal.toFixed(2)));
      setRating(`${i18n.t(ratingKey)} (${stars}/5)`);
      setStatus(
        exceeded.length > 0 ? i18n.t("status_overuse") : i18n.t("status_within")
      );
      setOverusedItems(exceeded);

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
    };

    calculateResult();
  }, []);

  const renderStars = () => {
    const starsCount =
      normalized < 0.3
        ? 5
        : normalized < 0.6
        ? 4
        : normalized < 0.9
        ? 3
        : normalized < 1.2
        ? 2
        : 1;

    return (
      <View style={styles.starContainer}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Ionicons
            key={idx}
            name={idx < starsCount ? "star" : "star-outline"}
            size={22}
            color={idx < starsCount ? "#FFD700" : "#ccc"}
            style={{ marginHorizontal: 2 }}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{i18n.t("carbon_footprint_results")}</Text>

      <View style={styles.section}>
        <Ionicons name="person-circle-outline" size={26} style={styles.icon} />
        <Text style={styles.sectionText}>
          <Text style={styles.label}>{i18n.t("vendor_id")}:</Text> {vendorId}
        </Text>
        <Text style={styles.sectionText}>
          <Text style={styles.label}>{i18n.t("industry")}:</Text>{" "}
          {i18n.t(industry ?? "unknown")}
        </Text>
      </View>

      <View style={styles.section}>
        <Ionicons name="leaf-outline" size={26} style={styles.icon} />
        <Text style={styles.metricTitle}>{i18n.t("total_emission_score")}</Text>
        <Text style={styles.metricValue}>{score}</Text>
      </View>

      <View style={styles.section}>
        <Ionicons name="speedometer-outline" size={26} style={styles.icon} />
        <Text style={styles.metricTitle}>
          {i18n.t("normalized_emission_score")}
        </Text>
        <Text style={styles.metricValue}>
          {normalized} {i18n.t("co2_per_unit")}
        </Text>
      </View>

      <View style={styles.govtScoreCard}>
        <View style={styles.govtIconWrapper}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
        </View>
        <Text style={styles.govtScoreTitle}>
          {i18n.t("govt_standard_normalized_score")}
        </Text>
        <Text style={styles.govtScoreValue}>
          {standardNormalized} {i18n.t("co2_per_unit")}
        </Text>
      </View>

      <View style={styles.section}>
        <Ionicons name="star-outline" size={26} style={styles.icon} />
        <Text style={styles.metricTitle}>{i18n.t("rating")}</Text>
        {renderStars()}
        <Text style={styles.sectionText}>{rating}</Text>
      </View>

      <View style={styles.section}>
        <Ionicons name="alert-circle-outline" size={26} style={styles.icon} />
        <Text
          style={[
            styles.statusText,
            status.includes("⚠️") && styles.statusWarning,
          ]}
        >
          {status}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() =>
          router.push({
            pathname: "/emissionBreakdown",
            params: {
              lang,
              vendorId,
              industry,
              exceeded: overusedItems.join("||"),
              tips: tips.join("||"),
              score: score.toString(),
              normalized: normalized.toString(),
              rating,
              status,
              formData: JSON.stringify(formData),
            },
          })
        }
      >
        <Text style={styles.nextButtonText}>{i18n.t("next")}</Text>
        <Ionicons name="arrow-forward-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFE",
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0071CE",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 40,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 10,
    alignSelf: "center",
    color: "#0071CE",
  },
  label: {
    fontWeight: "600",
    color: "#1A1A1A",
  },
  sectionText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
    textAlign: "center",
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
    color: "#0071CE",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: "#1A1A1A",
  },
  govtScoreCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#2196F3",
  },
  govtIconWrapper: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 40,
    marginBottom: 12,
  },
  govtScoreTitle: {
    fontSize: 16,
    color: "#0D47A1",
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  govtScoreValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "green",
    textAlign: "center",
  },
  statusWarning: {
    color: "#E53935",
  },
  nextButton: {
    backgroundColor: "#0071CE",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: "center", // Center horizontally
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 50,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
