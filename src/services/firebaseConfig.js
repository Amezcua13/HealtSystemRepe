import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB4d7yFxkNcgD8jCmt18mk9RVaqKUwXYU0",
  authDomain: "citas-65ed7.firebaseapp.com",
  projectId: "citas-65ed7",
  storageBucket: "citas-65ed7.appspot.com",
  messagingSenderId: "275429010330",
  appId: "1:275429010330:web:65abfeecac4eaed8d46823",
  measurementId: "G-LW85ZG0XPD",
};

// 📌 Evita inicializar Firebase más de una vez
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 📌 Asegura que la autenticación use AsyncStorage para la persistencia de sesión
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 📌 Inicializa Firestore
const db = getFirestore(app);

export { auth, db };
