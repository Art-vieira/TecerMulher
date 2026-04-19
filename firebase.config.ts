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
  apiKey: "AIzaSyAFQnpug8N7b87XuLLP1PxBq_6k_UvtiO0",
  authDomain: "app-material-test.firebaseapp.com",
  projectId: "app-material-test",
  storageBucket: "app-material-test.firebasestorage.app",
  messagingSenderId: "698779218975",
  appId: "1:698779218975:web:52670e886a1611c36e912a",
  measurementId: "G-HEESXPZ5K0"
};

// Evita re-inicializar o app em hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
