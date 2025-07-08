import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Use Constants to get values at runtime in Expo
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY ?? "",
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN ?? "",
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID ?? "",
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId:
    Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID ?? "",
  measurementId: Constants.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID ?? "",
};

// ✅ Avoid initializing twice (important in Expo with hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Firestore instance
export const db = getFirestore(app);
