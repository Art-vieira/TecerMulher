import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-fpeEMVXSLidyZwPo9eMmHwH1G0nTmcw",
  authDomain: "tecer-mulher-app.firebaseapp.com",
  projectId: "tecer-mulher-app",
  storageBucket: "tecer-mulher-app.firebasestorage.app",
  messagingSenderId: "73841184288",
  appId: "1:73841184288:web:be02d6f907c48232d8b645",
  measurementId: "G-2ZTS2PSJ5L",
};

const app = initializeApp(firebaseConfig);

/**
 * Auth com persistência condicional por plataforma:
 * - Web (dev/preview): getAuth padrão (sem getReactNativePersistence, que não existe no web)
 * - Native (iOS/Android): initializeAuth com AsyncStorage — sessão persiste após fechar o app
 *
 * O ternário JavaScript é avaliado de forma lazy (short-circuit), então
 * getReactNativePersistence(AsyncStorage) NUNCA é chamada no build web.
 */
export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
