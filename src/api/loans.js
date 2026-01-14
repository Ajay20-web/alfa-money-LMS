// src/api/loans.js
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";

// This function sends data to your new database
export const registerLoan = async (loanData) => {
  // It creates a folder named "loans" automatically
  const response = await addDoc(collection(db, "loans"), loanData);
  return response.id;
};
// This function fetches data from your new database
export const fetchLoans = async () => {
  const querySnapshot = await getDocs(collection(db, "loans"));

  // Convert the "snapshot" into a clean array of objects
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Fetch a single loan by ID
export const fetchLoanById = async (id) => {
  const docRef = doc(db, "loans", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Loan not found");
  }
};

// ADD Payment (Updates Balance & History)
export const addPayment = async ({ loanId, payment }) => {
  const loanRef = doc(db, "loans", loanId);

  await runTransaction(db, async (transaction) => {
    const loanSnap = await transaction.get(loanRef);

    if (!loanSnap.exists()) {
      throw new Error("Loan not found");
    }

    const loanData = loanSnap.data();
    const currentBalance = loanData.balance;
    const newBalance = currentBalance - payment.amount;

    if (newBalance < 0) {
      throw new Error("Payment exceeds remaining balance");
    }

    transaction.update(loanRef, {
      payments: arrayUnion(payment),
      balance: newBalance,
      status: newBalance === 0 ? "Closed" : loanData.status,
    });
  });
};
