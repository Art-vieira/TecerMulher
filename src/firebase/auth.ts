import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./config";

/**
 * Sign in a user with email and password.
 * Returns the Firebase UserCredential on success.
 */
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Firebase signIn error:', error);
    throw error;
  }
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Firebase signOut error:', error);
    throw error;
  }
};
