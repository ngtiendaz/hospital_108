// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7P_Q_8rjzBarYdU-IpfKuO2z1HO0oojU",
  authDomain: "hospital-b6490.firebaseapp.com",
  projectId: "hospital-b6490",
  storageBucket: "hospital-b6490.appspot.com", // I've corrected this to the standard format, but use your original if it differs.
  messagingSenderId: "867869335053",
  appId: "1:867869335053:web:476353f9fef0e93015ff44",
  measurementId: "G-Q9JW3ZS8E2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and export it
export const storage = getStorage(app);
