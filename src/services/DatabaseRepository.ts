/**
 * DatabaseRepository
 * ──────────────────────────────────────────────────────────────────────
 * Camada de abstração (Repository Pattern) entre os Hooks e o serviço
 * de persistência. Atualmente delega para LocalStorage (AsyncStorage),
 * mas pode ser substituído por Firebase, REST API ou qualquer outro
 * backend sem tocar nos hooks ou nas telas.
 *
 * COMO MIGRAR PARA FIREBASE (no futuro):
 *  1. Importe os SDKs do Firebase aqui.
 *  2. Substitua o corpo de cada função pelo equivalente do Firestore.
 *  3. Os hooks e telas NÃO precisam ser alterados.
 * ──────────────────────────────────────────────────────────────────────
 */

import { LocalStorage } from './localStorage';
import { Material, Duvida } from '../types';

// ── Materiais ─────────────────────────────────────────────────────────

export const getMateriais = (): Promise<Material[]> =>
  LocalStorage.getMateriais();

export const getMaterialById = (id: string): Promise<Material | null> =>
  LocalStorage.getMaterialById(id);

export const addMaterial = (
  data: Omit<Material, 'id' | 'createdAt'>
): Promise<Material> => LocalStorage.addMaterial(data);

export const updateMaterial = (
  id: string,
  data: Partial<Omit<Material, 'id' | 'createdAt'>>
): Promise<void> => LocalStorage.updateMaterial(id, data);

export const deleteMaterial = (id: string): Promise<void> =>
  LocalStorage.deleteMaterial(id);

// ── Dúvidas ───────────────────────────────────────────────────────────

export const getDuvidas = (): Promise<Duvida[]> =>
  LocalStorage.getDuvidas();

export const getDuvidaById = (id: string): Promise<Duvida | null> =>
  LocalStorage.getDuvidaById(id);

export const addDuvida = (
  data: Omit<Duvida, 'id' | 'createdAt'>
): Promise<Duvida> => LocalStorage.addDuvida(data);

export const updateDuvida = (
  id: string,
  data: Partial<Omit<Duvida, 'id' | 'createdAt'>>
): Promise<void> => LocalStorage.updateDuvida(id, data);

export const deleteDuvida = (id: string): Promise<void> =>
  LocalStorage.deleteDuvida(id);

// ── Autenticação ──────────────────────────────────────────────────────

export const getUserSession = (): Promise<{ email: string } | null> =>
  LocalStorage.getUserSession();

export const saveUserSession = (
  session: { email: string } | null
): Promise<void> => LocalStorage.saveUserSession(session);
