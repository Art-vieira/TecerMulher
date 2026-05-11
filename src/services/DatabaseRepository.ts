/**
 * DatabaseRepository
 * ──────────────────────────────────────────────────────────────────────
 * Camada de abstração (Repository Pattern) entre os Hooks e o Firebase.
 * Delega para Cloud Firestore (Fase 2) e Firebase Storage (Fase 3).
 *
 * Os hooks e telas NÃO precisam ser alterados ao trocar o backend.
 * ──────────────────────────────────────────────────────────────────────
 */

import {
  addDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} from '../firebase/firestore';
import { Material, Duvida } from '../types';

// ── Materiais ─────────────────────────────────────────────────────────

export const getMateriais = async (): Promise<Material[]> => {
  const snapshot = await getDocuments('materiais');
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Material));
};

export const getMaterialById = async (id: string): Promise<Material | null> => {
  const snap = await getDocument('materiais', id);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Material;
};

export const addMaterial = async (
  data: Omit<Material, 'id' | 'createdAt'>
): Promise<Material> => {
  const createdAt = new Date().toISOString();
  const docRef = await addDocument('materiais', { ...data, createdAt });
  return { id: docRef.id, ...data, createdAt };
};

export const updateMaterial = async (
  id: string,
  data: Partial<Omit<Material, 'id' | 'createdAt'>>
): Promise<void> => {
  await updateDocument(`materiais/${id}`, data);
};

export const deleteMaterial = async (id: string): Promise<void> => {
  await deleteDocument(`materiais/${id}`);
};

// ── Dúvidas ───────────────────────────────────────────────────────────

export const getDuvidas = async (): Promise<Duvida[]> => {
  const snapshot = await getDocuments('duvidas');
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Duvida));
};

export const getDuvidaById = async (id: string): Promise<Duvida | null> => {
  const snap = await getDocument('duvidas', id);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Duvida;
};

export const addDuvida = async (
  data: Omit<Duvida, 'id' | 'createdAt'>
): Promise<Duvida> => {
  const createdAt = new Date().toISOString();
  const docRef = await addDocument('duvidas', { ...data, createdAt });
  return { id: docRef.id, ...data, createdAt };
};

export const updateDuvida = async (
  id: string,
  data: Partial<Omit<Duvida, 'id' | 'createdAt'>>
): Promise<void> => {
  await updateDocument(`duvidas/${id}`, data);
};

export const deleteDuvida = async (id: string): Promise<void> => {
  await deleteDocument(`duvidas/${id}`);
};
