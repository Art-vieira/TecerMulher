// =====================================================
//  CONFIGURAÇÃO DO FIREBASE - TecerMulher
// =====================================================
//  PASSO 1: Acesse https://console.firebase.google.com
//  PASSO 2: Crie ou abra seu projeto
//  PASSO 3: Clique em "Adicionar app" > ícone Web (</>)
//  PASSO 4: Copie o firebaseConfig e substitua abaixo
// =====================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD-fpeEMVXSLidyZwPo9eMmHwH1G0nTmcw",
  authDomain: "tecer-mulher-app.firebaseapp.com",
  projectId: "tecer-mulher-app",
  storageBucket: "tecer-mulher-app.firebasestorage.app",
  messagingSenderId: "73841184288",
  appId: "1:73841184288:web:be02d6f907c48232d8b645",
  measurementId: "G-2ZTS2PSJ5L"
};

// Evita re-inicializar o app em hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
