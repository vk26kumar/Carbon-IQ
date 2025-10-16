import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Read from EXPO_PUBLIC_ environment variables for EAS builds
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

// ✅ Initialize only once (safe for Expo hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Export initialized Firebase app and Firestore
export const firebaseApp = app;
export const db = getFirestore(app);
