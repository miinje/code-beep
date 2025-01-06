import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
};

let app = null;
let auth = null;
let database = null;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  database = getDatabase(app);
} else {
  app = getApp();
}

async function saveAlarmData(userId, data) {
  const { selectedTime, selectedDays, selectedTitle } = data;
  const alarmRef = ref(database, `${userId}/alarm/${selectedTime}`);

  await set(alarmRef, {
    selectedTime: `${selectedTime}`,
    selectedDays: `${selectedDays}`,
    selectedTitle: `${selectedTitle}`,
  });
}

async function getAlarmData(userId) {
  const alarmRef = ref(database, `${userId}/alarm/`);
  const snapshot = await get(alarmRef);
  const data = snapshot.val();

  return data;
}

async function saveReposCodeData(userId, repoName, data) {
  const repoCodeRef = ref(database, `${userId}/code/${repoName}`);

  await set(repoCodeRef, data);
}

export { app, auth, database, getAlarmData, saveAlarmData, saveReposCodeData };
