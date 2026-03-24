import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MessageScreen() {
  const router = useRouter();
  const { lang } = useLocalSearchParams();

  if (lang) i18n.locale = lang.toString();

  const iconScale = useRef(new Animated.Value(0.5)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(28)).current;
  const btnFade = useRef(new Animated.Value(0)).current;
  const btnSlide = useRef(new Animated.Value(20)).current;

  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 6,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(btnFade, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(btnSlide, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.5,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.4,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={["#f0fce8", "#e4f7d4", "#d8f2be"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* ── ICON WITH PULSE RING ── */}
          <Animated.View
            style={[
              styles.iconWrap,
              { opacity: iconOpacity, transform: [{ scale: iconScale }] },
            ]}
          >
            <Animated.View
              style={[
                styles.pulseRing,
                { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
              ]}
            />
            <LinearGradient
              colors={["#90d84a", "#54b820"]}
              style={styles.iconCircle}
            >
              <Ionicons name="leaf-outline" size={38} color="#fff" />
            </LinearGradient>
          </Animated.View>

          {/* ── MESSAGE CARD ── */}
          <Animated.View
            style={[
              styles.card,
              { opacity: cardFade, transform: [{ translateY: cardSlide }] },
            ]}
          >
            <LinearGradient
              colors={["#ffffff", "#edfadf", "#dff7c8"]}
              style={styles.cardInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.dotTR} />
              <View style={styles.dotBL} />

              <Text style={styles.cardTitle}>
                {i18n.t("carbon_usage_summary")}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.cardMessage}>
                {i18n.t("simple_carbon_message")}
              </Text>

              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Ionicons name="leaf-outline" size={18} color="#6ec832" />
                  <Text style={styles.statLabel}>Eco Score</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color="#38aae0"
                  />
                  <Text style={styles.statLabel}>Reported</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Ionicons
                    name="trending-down-outline"
                    size={18}
                    color="#6ec832"
                  />
                  <Text style={styles.statLabel}>Tracked</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── GO HOME BUTTON ── */}
          <Animated.View
            style={[
              styles.btnContainer,
              { opacity: btnFade, transform: [{ translateY: btnSlide }] },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.push("/home")}
              activeOpacity={0.82}
              style={styles.homeBtn}
            >
              <LinearGradient
                colors={["#edfadf", "#d4f5a8", "#c2ee8a"]}
                style={styles.homeBtnInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.homeBtnIconWrap}>
                  <Ionicons name="home-outline" size={16} color="#3a7a10" />
                </View>
                <Text style={styles.homeBtnText}>{i18n.t("go_home")}</Text>
                <View style={styles.homeBtnArrow}>
                  <Ionicons name="arrow-forward" size={13} color="#3a7a10" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 24,
  },

  /* Icon */
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 110,
    height: 110,
  },
  pulseRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#6ec832",
  },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Card */
  card: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#c8eea0",
  },
  cardInner: {
    padding: 24,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  dotTR: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#a0dc6a",
    opacity: 0.5,
  },
  dotBL: {
    position: "absolute",
    bottom: 14,
    left: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#78c840",
    opacity: 0.4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a4008",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: "#7ad440",
    borderRadius: 2,
    marginVertical: 14,
  },
  cardMessage: {
    fontSize: 14,
    color: "#4a7030",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#f0fce8",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#c8eea0",
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  statLabel: {
    fontSize: 11,
    color: "#5a8040",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#c8eea0",
  },

  /* Go Home button */
  btnContainer: {
    width: "100%",
  },
  homeBtn: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#b8e890",
    shadowColor: "#6ec832",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  homeBtnInner: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  homeBtnIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "#c0e898",
    alignItems: "center",
    justifyContent: "center",
  },
  homeBtnText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#2a6008",
    letterSpacing: 0.2,
  },
  homeBtnArrow: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "#c0e898",
    alignItems: "center",
    justifyContent: "center",
  },
});
