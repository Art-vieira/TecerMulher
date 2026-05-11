// src/firebase/firestore.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  QuerySnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

/** Add a new document to a collection */
export const addDocument = async (
  collectionPath: string,
  data: DocumentData,
): Promise<DocumentReference> => {
  const colRef = collection(db, collectionPath);
  return await addDoc(colRef, data);
};

/** Get all documents from a collection */
export const getDocuments = async (
  collectionPath: string,
): Promise<QuerySnapshot> => {
  const colRef = collection(db, collectionPath);
  return await getDocs(colRef);
};

/** Set (overwrite) a document at a specific path */
export const setDocument = async (
  docPath: string,
  data: DocumentData,
): Promise<void> => {
  const docRef = doc(db, docPath);
  await setDoc(docRef, data);
};

/** Update fields of an existing document */
export const updateDocument = async (
  docPath: string,
  data: Partial<DocumentData>,
): Promise<void> => {
  const docRef = doc(db, docPath);
  await updateDoc(docRef, data);
};

/** Get a single document by collection path and document ID */
export const getDocument = async (
  collectionPath: string,
  id: string,
): Promise<DocumentSnapshot> => {
  const docRef = doc(db, collectionPath, id);
  return await getDoc(docRef);
};

/** Delete a document */
export const deleteDocument = async (docPath: string): Promise<void> => {
  const docRef = doc(db, docPath);
  await deleteDoc(docRef);
};
