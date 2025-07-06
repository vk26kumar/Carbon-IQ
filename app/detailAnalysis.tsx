import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#f5f5f5",
  backgroundGradientTo: "#f5f5f5",
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

type HistoryEntry = {
  normalized: number;
  date: string;
};

const DetailAnalysis = () => {
  const { vendorId, industry, lang } = useLocalSearchParams();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [industryScores, setIndustryScores] = useState<number[]>([]);

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();
  }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for current vendor
        const vendorQuery = query(
          collection(db, "results"),
          where("vendorId", "==", vendorId)
        );
        const vendorSnap = await getDocs(vendorQuery);
        const vendorData = vendorSnap.docs.map((doc) => doc.data());

        const vendorHistory: HistoryEntry[] = vendorData.map((entry) => {
          const date =
             typeof entry.createdAt?.toDate === "function"
             ? entry.createdAt.toDate()
             : new Date(entry.createdAt);

          return {
            normalized: entry.normalized,
            date: new Date(date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }),
          };
        });

        setHistory(vendorHistory);

        // Fetch industry-level data
        const industryQuery = query(
          collection(db, "results"),
          where("industry", "==", industry)
        );
        const industrySnap = await getDocs(industryQuery);
        const industryData = industrySnap.docs.map((doc) => doc.data());
        const industryNormalized = industryData.map((entry) => entry.normalized);
        setIndustryScores(industryNormalized);
      } catch (err) {
        console.error("🔥 Error fetching detail analysis data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {i18n.t("emission_trends")}
      </Text>

      {history.length > 0 ? (
        <LineChart
          data={{
            labels: history.map((d) => d.date),
            datasets: [{ data: history.map((d) => d.normalized) }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 10 }}
        />
      ) : (
        <Text>{i18n.t("no_data") || i18n.t("no_vendor_history_data")}</Text>
      )}

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        {i18n.t("industry_comparison")}
      </Text>

      {industryScores.length > 0 ? (
        <BarChart
          data={{
            labels: industryScores.map((_, idx) => `V${idx + 1}`),
            datasets: [{ data: industryScores }],
          }}
          width={screenWidth - 40}
          height={250}
          fromZero
          chartConfig={chartConfig}
          style={{ borderRadius: 10 }}
          yAxisLabel=""
          yAxisSuffix=""
        />
      ) : (
        <Text>
          {i18n.t("no_data") || i18n.t("no_industry_comparison_data")}
        </Text>
      )}
    </ScrollView>
  );
};

export default DetailAnalysis;
