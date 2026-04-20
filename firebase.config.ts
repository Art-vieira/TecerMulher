// =====================================================
//  CONFIGURAÇÃO DO FIREBASE - TecerMulher
// =====================================================
//  PASSO 1: Acesse https://console.firebase.google.com
//  PASSO 2: Crie ou abra seu projeto
//  PASSO 3: Clique em "Adicionar app" > ícone Web (</>)
//  PASSO 4: Copie o firebaseConfig e substitua abaixo
// =====================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD-fpeEMVXSLidyZwPo9eMmHwH1G0nTmcw",
  authDomain: "tecer-mulher-app.firebaseapp.com",
  projectId: "tecer-mulher-app",
  storageBucket: "tecer-mulher-app.firebasestorage.app",
  messagingSenderId: "73841184288",
  appId: "1:73841184288:web:be02d6f907c48232d8b645",
  measurementId: "G-2ZTS2PSJ5L"
};

// Evitar re-init
let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
