import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f0fce8" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="onboard" />
        <Stack.Screen name="form" />
        <Stack.Screen name="results" />
        <Stack.Screen name="emissionBreakdown" />
        <Stack.Screen name="detailAnalysis" />
        <Stack.Screen name="message" />
        <Stack.Screen name="carbonOffset" />
        <Stack.Screen name="pdfReport" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fce8",
  },
});
