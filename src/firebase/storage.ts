// src/firebase/storage.ts
import { storage } from "./config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/**
 * Upload a file (e.g., image or video) to Firebase Storage.
 * @param path - Storage folder path (e.g., "uploads/images")
 * @param file - Blob/File to upload
 * @param fileName - Desired name for the file in storage
 * @param onProgress - Optional callback receiving upload progress (0‑100)
 * @returns Promise that resolves to the public download URL
 */
export const uploadFile = (
  path: string,
  file: Blob,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `${path}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (onProgress) {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error("Firebase upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

/**
 * Get a download URL for an existing file in Firebase Storage.
 * @param filePath - Full storage path (e.g., "uploads/images/photo.jpg")
 */
export const getFileUrl = async (filePath: string): Promise<string> => {
  const fileRef = ref(storage, filePath);
  return await getDownloadURL(fileRef);
};
