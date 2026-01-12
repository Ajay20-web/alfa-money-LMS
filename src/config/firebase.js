// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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