// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7P_Q_8rjzBarYdU-IpfKuO2z1HO0oojU",
  authDomain: "hospital-b6490.firebaseapp.com",
  projectId: "hospital-b6490",
  storageBucket: "hospital-b6490.firebasestorage.app",
  messagingSenderId: "867869335053",
  appId: "1:867869335053:web:476353f9fef0e93015ff44",
  measurementId: "G-Q9JW3ZS8E2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app); 