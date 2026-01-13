// src/api/loans.js
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

// This function sends data to your new database
export const registerLoan = async (loanData) => {
  // It creates a folder named "loans" automatically
  const response = await addDoc(collection(db, "loans"), loanData);
  return response.id;
};