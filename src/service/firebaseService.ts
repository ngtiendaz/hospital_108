import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads an image file to Firebase Storage and returns its public URL.
 * @param file The image file object to upload.
 * @returns A promise that resolves with the public download URL of the uploaded image.
 */
export const uploadImageAndGetURL = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Create a unique file reference (e.g., 'images/166888123456-image-name.jpg')
  const imageRef = ref(storage, `images/${Date.now()}-${file.name}`);

  try {
    // Upload the file to the created reference
    const snapshot = await uploadBytes(imageRef, file);
    
    // Get the public URL of the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ File uploaded successfully! URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("❌ Error uploading image to Firebase:", error);
    // Re-throw the error so the component can handle it (e.g., show an alert)
    throw error;
  }
};