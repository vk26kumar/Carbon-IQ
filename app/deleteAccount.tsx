import { db } from "@/utils/firebaseConfig";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { lang } = useLocalSearchParams(); // vendorId no longer passed — user enters it

  const [vendorIdInput, setVendorIdInput] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-18)).current;
  const scaleBtn = useRef(new Animated.Value(0.94)).current;
  const fadeBtn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lang) i18n.locale = lang.toString();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 480,
          useNativeDriver: true,
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBtn, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(scaleBtn, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const isVendorIdFilled = vendorIdInput.trim().length > 0;
  const isConfirmed = confirmText.trim() === "DELETE";
  const canDelete = isVendorIdFilled && isConfirmed && !loading;

  const handleDelete = async () => {
    if (!isVendorIdFilled) {
      Alert.alert("Required", "Please enter your Vendor ID.");
      return;
    }
    if (!isConfirmed) {
      Alert.alert(
        "Confirmation Required",
        'Please type "DELETE" exactly to confirm.',
      );
      return;
    }

    Alert.alert(
      "Final Confirmation",
      `This will permanently erase all data for vendor "${vendorIdInput.trim()}". This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete Everything",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const vid = vendorIdInput.trim();

              // ── Delete from "vendors" collection ────────────────────────
              const vendorSnap = await getDocs(
                query(collection(db, "vendors"), where("vendorId", "==", vid)),
              );

              if (vendorSnap.empty) {
                Alert.alert(
                  "Not Found",
                  "No account found with this Vendor ID. Please check and try again.",
                );
                setLoading(false);
                return;
              }

              for (const d of vendorSnap.docs) {
                await deleteDoc(d.ref);
              }

              // ── Delete from "results" collection ────────────────────────
              const resultsSnap = await getDocs(
                query(collection(db, "results"), where("vendorId", "==", vid)),
              );
              for (const d of resultsSnap.docs) {
                await deleteDoc(d.ref);
              }

              // ── Delete from "formdata" collection ───────────────────────
              const formSnap = await getDocs(
                query(collection(db, "formdata"), where("vendorId", "==", vid)),
              );
              for (const d of formSnap.docs) {
                await deleteDoc(d.ref);
              }

              Alert.alert(
                "Account Deleted",
                "All your data has been permanently removed.",
                [{ text: "OK", onPress: () => router.replace("/") }],
              );
            } catch (error: any) {
              Alert.alert(
                "Error",
                error?.message ?? "Failed to delete account. Please try again.",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <LinearGradient
      colors={["#f0fce8", "#e4f7d4", "#d8f2be"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── HEADER ── */}
            <Animated.View
              style={{
                opacity: headerFade,
                transform: [{ translateY: headerSlide }],
              }}
            >
              <LinearGradient
                colors={["#ffffff", "#fff0f0", "#ffe0e0"]}
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
                  <Text style={styles.heading}>Delete Account</Text>
                  <View style={{ width: 36 }} />
                </View>

                {/* Warning icon */}
                <View style={styles.warningIconWrap}>
                  <LinearGradient
                    colors={["#ffcccc", "#ff9999"]}
                    style={styles.warningIconCircle}
                  >
                    <Ionicons
                      name="warning-outline"
                      size={32}
                      color="#c0392b"
                    />
                  </LinearGradient>
                </View>

                <Text style={styles.warningTitle}>This is irreversible</Text>
                <Text style={styles.warningDesc}>
                  Deleting your account will permanently remove:
                </Text>

                {[
                  {
                    icon: "person-outline" as const,
                    text: "Your vendor profile & registration",
                  },
                  {
                    icon: "analytics-outline" as const,
                    text: "All emission records & scores",
                  },
                  {
                    icon: "document-text-outline" as const,
                    text: "All generated reports & history",
                  },
                ].map((item) => (
                  <View key={item.text} style={styles.deleteItem}>
                    <View style={styles.deleteItemIcon}>
                      <Ionicons name={item.icon} size={15} color="#c0392b" />
                    </View>
                    <Text style={styles.deleteItemText}>{item.text}</Text>
                  </View>
                ))}
              </LinearGradient>
            </Animated.View>

            {/* ── CONFIRM INPUT CARD ── */}
            <Animated.View style={{ opacity: headerFade }}>
              <View style={styles.confirmCard}>
                {/* Step 1 — Vendor ID */}
                <View style={styles.sectionRow}>
                  <View
                    style={[styles.accentBar, { backgroundColor: "#c0392b" }]}
                  />
                  <Text style={styles.confirmTitle}>
                    Step 1 — Enter Your Vendor ID
                  </Text>
                </View>

                <Text style={styles.confirmInstruction}>
                  Enter the Vendor ID you registered with:
                </Text>

                <View
                  style={[
                    styles.inputRow,
                    isVendorIdFilled && styles.inputRowConfirmed,
                  ]}
                >
                  <Ionicons
                    name="card-outline"
                    size={17}
                    color={isVendorIdFilled ? "#c0392b" : "#999"}
                  />
                  <TextInput
                    value={vendorIdInput}
                    onChangeText={setVendorIdInput}
                    placeholder="Your Vendor ID"
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {isVendorIdFilled && (
                    <Ionicons
                      name="checkmark-circle"
                      size={17}
                      color="#c0392b"
                    />
                  )}
                </View>

                {/* Divider between steps */}
                <View style={styles.stepDivider} />

                {/* Step 2 — DELETE confirmation */}
                <View style={styles.sectionRow}>
                  <View
                    style={[styles.accentBar, { backgroundColor: "#c0392b" }]}
                  />
                  <Text style={styles.confirmTitle}>
                    Step 2 — Confirm Deletion
                  </Text>
                </View>

                <Text style={styles.confirmInstruction}>
                  Type <Text style={styles.confirmKeyword}>"DELETE"</Text> below
                  to confirm:
                </Text>

                <View
                  style={[
                    styles.inputRow,
                    isConfirmed && styles.inputRowConfirmed,
                  ]}
                >
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color={isConfirmed ? "#c0392b" : "#999"}
                  />
                  <TextInput
                    value={confirmText}
                    onChangeText={setConfirmText}
                    placeholder='Type "DELETE" here'
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                  {isConfirmed && (
                    <Ionicons
                      name="checkmark-circle"
                      size={17}
                      color="#c0392b"
                    />
                  )}
                </View>
              </View>
            </Animated.View>

            {/* ── DELETE BUTTON ── */}
            <Animated.View
              style={{ opacity: fadeBtn, transform: [{ scale: scaleBtn }] }}
            >
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={handleDelete}
                disabled={!canDelete}
                style={[
                  styles.deleteWrap,
                  !canDelete && styles.deleteWrapDisabled,
                ]}
              >
                <LinearGradient
                  colors={canDelete ? ["#ff6b6b", "#c0392b"] : ["#eee", "#ddd"]}
                  style={styles.deleteBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.deleteBtnIconWrap}>
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={canDelete ? "#fff" : "#aaa"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.deleteBtnText,
                      { color: canDelete ? "#fff" : "#aaa" },
                    ]}
                  >
                    {loading ? "Deleting..." : "Delete My Account Permanently"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* ── CANCEL BUTTON ── */}
            <Animated.View style={{ opacity: fadeBtn }}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => router.back()}
                style={styles.cancelWrap}
              >
                <LinearGradient
                  colors={["#edfadf", "#d4f5a8", "#c2ee8a"]}
                  style={styles.cancelBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cancelIconWrap}>
                    <Ionicons
                      name="arrow-back-outline"
                      size={16}
                      color="#3a7a10"
                    />
                  </View>
                  <Text style={styles.cancelText}>Keep My Account</Text>
                  <View style={styles.cancelArrow}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={13}
                      color="#3a7a10"
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#ffcccc",
    overflow: "hidden",
    gap: 10,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
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
    color: "#c0392b",
    letterSpacing: -0.3,
  },

  warningIconWrap: { alignItems: "center", marginVertical: 4 },
  warningIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  warningTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#c0392b",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  warningDesc: {
    fontSize: 13,
    color: "#7a4040",
    textAlign: "center",
    lineHeight: 19,
  },
  deleteItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ffcccc",
  },
  deleteItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#ffe0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteItemText: { fontSize: 13, color: "#7a3030", flex: 1, lineHeight: 18 },

  /* Confirm card */
  confirmCard: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ffcccc",
    gap: 12,
  },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  accentBar: { width: 4, height: 20, borderRadius: 2 },
  confirmTitle: { fontSize: 14, fontWeight: "700", color: "#c0392b" },
  confirmInstruction: { fontSize: 13, color: "#5a4040", lineHeight: 20 },
  confirmKeyword: {
    fontWeight: "700",
    color: "#c0392b",
    fontFamily: "monospace",
  },
  stepDivider: {
    height: 1,
    backgroundColor: "#ffcccc",
    borderRadius: 1,
    marginVertical: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5f5",
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#ffcccc",
    paddingHorizontal: 12,
    minHeight: 50,
    gap: 10,
  },
  inputRowConfirmed: {
    borderColor: "#c0392b",
    backgroundColor: "#fff0f0",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#3a0a0a",
    paddingVertical: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  /* Delete button */
  deleteWrap: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#c0392b",
    elevation: 3,
  },
  deleteWrapDisabled: { borderColor: "#ddd", elevation: 0 },
  deleteBtn: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deleteBtnIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: { flex: 1, fontSize: 13, fontWeight: "700" },

  /* Cancel button */
  cancelWrap: {
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
  cancelBtn: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cancelIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "#c0e898",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#2a6008",
    letterSpacing: 0.2,
  },
  cancelArrow: {
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
