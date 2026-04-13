import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// alfa-money Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATFPpcM0-WG-w9OfckcVCiO2Qd5GfeW6c",
  authDomain: "alfa-money.firebaseapp.com",
  projectId: "alfa-money",
  storageBucket: "alfa-money.firebasestorage.app",
  messagingSenderId: "788806676528",
  appId: "1:788806676528:web:d0a7a3a2d66013a3f33df5",
  measurementId: "G-4Z68BB4XEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
export const db = getFirestore(app);
// Initialize Auth
export const auth = getAuth(app);