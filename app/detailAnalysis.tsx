import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width - 36;

// ── Chart config — green themed ───────────────────────────────────────────────
const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#f4fcea",
  color: (opacity = 1) => `rgba(78, 160, 30, ${opacity})`,
  labelColor: () => "#3a5a20",
  strokeWidth: 2,
  barPercentage: 0.55,
  decimalPlaces: 2,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#6ec832",
  },
};

type HistoryEntry = { normalized: number; date: string };

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({
  icon,
  title,
  accentColor = "#6ec832",
  children,
  delay = 0,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  accentColor?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 420,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 420,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity: fade, transform: [{ translateY: slide }] }}
    >
      <View style={styles.sectionCard}>
        <View style={styles.sectionRow}>
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
          <Ionicons name={icon} size={17} color={accentColor} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {children}
      </View>
    </Animated.View>
  );
}

// ── No data placeholder ───────────────────────────────────────────────────────
function NoData({ text }: { text: string }) {
  return (
    <View style={styles.noDataBox}>
      <Ionicons name="bar-chart-outline" size={28} color="#c0e898" />
      <Text style={styles.noDataText}>{text}</Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
const DetailAnalysis = () => {
  const { vendorId, industry, lang, formData } = useLocalSearchParams();
  const router = useRouter();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [industryScores, setIndustryScores] = useState<number[]>([]);
  const [formValues, setFormValues] = useState<any>(null);

  // Header entrance
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-18)).current;

  // Glow
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();

    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 480,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 950,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 950,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vendor history
        const vSnap = await getDocs(
          query(collection(db, "results"), where("vendorId", "==", vendorId)),
        );
        const vData = vSnap.docs.map((d) => d.data());
        setHistory(
          vData.map((e) => {
            const d =
              typeof e.createdAt?.toDate === "function"
                ? e.createdAt.toDate()
                : new Date(e.createdAt);
            return {
              normalized: e.normalized,
              date: new Date(d).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              }),
            };
          }),
        );

        // Industry comparison
        const iSnap = await getDocs(
          query(collection(db, "results"), where("industry", "==", industry)),
        );
        setIndustryScores(iSnap.docs.map((d) => d.data().normalized));
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData) {
      try {
        setFormValues(JSON.parse(formData.toString()));
      } catch {}
    }
  }, [formData]);

  // ── Pie chart data ──────────────────────────────────────────────────────────
  const getPieData = () => {
    if (!formValues) return [];
    const PALETTE = [
      "#6ec832",
      "#38aae0",
      "#f0b429",
      "#e07830",
      "#a060e0",
      "#e03878",
    ];
    return Object.entries(formValues)
      .map(([key, val], i) => ({
        name: i18n.t(key),
        population: parseFloat(val as string) || 0,
        color: PALETTE[i % PALETTE.length],
        legendFontColor: "#3a5a20",
        legendFontSize: 11,
      }))
      .filter((d) => d.population > 0);
  };

  const pieData = getPieData();

  const glowSize = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 22],
  });
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.58],
  });

  return (
    <LinearGradient
      colors={["#f0fce8", "#e4f7d4", "#d8f2be"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── HEADER ── */}
          <Animated.View
            style={{
              opacity: headerFade,
              transform: [{ translateY: headerSlide }],
            }}
          >
            <LinearGradient
              colors={["#ffffff", "#edfadf", "#dff7c8"]}
              style={styles.headerCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerTopRow}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backBtn}
                >
                  <Ionicons
                    name="arrow-back-outline"
                    size={18}
                    color="#4a9a20"
                  />
                </TouchableOpacity>
                <Text style={styles.heading}>
                  {i18n.t("detailed_analysis")}
                </Text>
                <View style={{ width: 36 }} />
              </View>

              {/* Vendor + industry chips */}
              <View style={styles.chipRow}>
                <View style={styles.chip}>
                  <Ionicons
                    name="person-circle-outline"
                    size={13}
                    color="#5a8040"
                  />
                  <Text style={styles.chipText}>{vendorId}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="business-outline" size={13} color="#5a8040" />
                  <Text style={styles.chipText}>
                    {i18n.t(industry?.toString() ?? "")}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── PIE CHART ── */}
          <SectionCard
            icon="pie-chart-outline"
            title={i18n.t("emission_distribution")}
            delay={100}
          >
            {pieData.length === 0 ? (
              <NoData
                text={i18n.t("no_data_available") || "No data available"}
              />
            ) : (
              <>
                <PieChart
                  data={pieData}
                  width={screenWidth - 36}
                  height={200}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="8"
                  absolute
                  style={styles.chart}
                />
              </>
            )}
          </SectionCard>

          {/* ── LINE CHART (Trends) ── */}
          <SectionCard
            icon="trending-up-outline"
            title={i18n.t("emission_trends")}
            accentColor="#38aae0"
            delay={200}
          >
            {history.length === 0 ? (
              <NoData text={i18n.t("no_vendor_history_data")} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: history.map((h) => h.date),
                    datasets: [{ data: history.map((h) => h.normalized) }],
                  }}
                  width={Math.max(screenWidth - 36, history.length * 72)}
                  height={200}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(56, 170, 224, ${opacity})`,
                    propsForDots: {
                      r: "5",
                      strokeWidth: "2",
                      stroke: "#38aae0",
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </ScrollView>
            )}
          </SectionCard>

          {/* ── BAR CHART (Industry comparison) ── */}
          <SectionCard
            icon="bar-chart-outline"
            title={i18n.t("industry_comparison")}
            accentColor="#f0b429"
            delay={300}
          >
            {industryScores.length === 0 ? (
              <NoData text={i18n.t("no_industry_comparison_data")} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={{
                    labels: industryScores.map((_, i) => `V${i + 1}`),
                    datasets: [{ data: industryScores }],
                  }}
                  width={Math.max(screenWidth - 36, industryScores.length * 60)}
                  height={220}
                  fromZero
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(240, 180, 41, ${opacity})`,
                  }}
                  style={styles.chart}
                  showValuesOnTopOfBars
                  yAxisLabel=""
                  yAxisSuffix=""
                />
              </ScrollView>
            )}
          </SectionCard>

          {/* ── GLOW NEXT BUTTON ── */}
          <View style={styles.btnWrapper}>
            <Animated.View
              style={[
                styles.glowLayer,
                { shadowRadius: glowSize, shadowOpacity: glowOpacity },
              ]}
            />
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: "/message", params: { lang } })
              }
              activeOpacity={0.87}
              style={styles.btnOuter}
            >
              <LinearGradient
                colors={["#a8e858", "#6ec832", "#48a818"]}
                style={styles.btnInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.btnText}>{i18n.t("view_message")}</Text>
                <View style={styles.btnArrow}>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DetailAnalysis;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 14,
  },

  /* Header */
  headerCard: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#c8eea0",
    overflow: "hidden",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#eaf8d8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#c0e898",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a4008",
    letterSpacing: -0.3,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#eaf8d8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c0e898",
  },
  chipText: {
    fontSize: 11,
    color: "#3a6a20",
    fontWeight: "500",
  },

  /* Section card */
  sectionCard: {
    backgroundColor: "rgba(255,255,255,0.86)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#caeaa8",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  accentBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a4008",
  },

  /* Chart */
  chart: {
    borderRadius: 14,
    marginTop: 4,
  },

  /* No data */
  noDataBox: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 10,
  },
  noDataText: {
    fontSize: 13,
    color: "#8aba70",
    textAlign: "center",
  },

  /* Glow button */
  btnWrapper: {
    position: "relative",
    alignItems: "stretch",
  },
  glowLayer: {
    position: "absolute",
    top: 6,
    left: 10,
    right: 10,
    bottom: 6,
    borderRadius: 16,
    backgroundColor: "transparent",
    shadowColor: "#6ec832",
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  btnOuter: {
    borderRadius: 16,
    overflow: "hidden",
  },
  btnInner: {
    paddingVertical: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  btnArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
});
