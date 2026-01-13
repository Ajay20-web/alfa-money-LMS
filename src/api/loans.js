// src/api/loans.js
import { db } from "../config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// This function sends data to your new database
export const registerLoan = async (loanData) => {
  // It creates a folder named "loans" automatically
  const response = await addDoc(collection(db, "loans"), loanData);
  return response.id;
};

export const fetchLoans = async () => {
  const querySnapshot = await getDocs(collection(db, "loans"));
  
  // Convert the "snapshot" into a clean array of objects
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};