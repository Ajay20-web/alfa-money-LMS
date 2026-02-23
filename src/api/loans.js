// src/api/loans.js
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  arrayUnion,
  runTransaction,
  serverTimestamp,
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

const getServerNow = async () => {
  const serverTimeRef = doc(db, "_meta", "server_time");
  await setDoc(serverTimeRef, { now: serverTimestamp() }, { merge: true });

  const snap = await getDocFromServer(serverTimeRef);
  const serverNow = snap.data()?.now;

  if (!serverNow) {
    throw new Error("Unable to fetch server timestamp");
  }

  return serverNow;
};

// ADD Payment (Updates Balance & History)
export const addPayment = async ({ loanId, payment }) => {
  const serverNow = await getServerNow();
  const loanRef = doc(db, "loans", loanId);

  await runTransaction(db, async (transaction) => {
    const loanSnap = await transaction.get(loanRef);

    if (!loanSnap.exists()) {
      throw new Error("Loan not found");
    }

    const loanData = loanSnap.data();
    const currentBalance = Number(loanData.balance);
    if (!Number.isFinite(currentBalance) || currentBalance < 0) {
      throw new Error("Invalid loan balance");
    }

    const amount = Number(payment?.amount);
    if (!Number.isFinite(amount)) {
      throw new Error("Invalid payment amount");
    }
    if (amount < 0) {
      throw new Error("Payment amount cannot be negative");
    }

    const paymentType = payment?.type;
    if (paymentType !== "credit" && paymentType !== "skip") {
      throw new Error("Invalid payment type");
    }
    if (paymentType === "credit" && amount <= 0) {
      throw new Error("Credit payment must be greater than 0");
    }
    if (paymentType === "skip" && amount !== 0) {
      throw new Error("Skip payment amount must be 0");
    }

    const newBalance = currentBalance - amount;

    if (newBalance < 0) {
      throw new Error("Payment exceeds remaining balance");
    }

    // Keep a concrete value inside arrayUnion payload.
    const paymentWithTimestamp = {
      ...payment,
      amount,
      timestamp: serverNow,
    };

    transaction.update(loanRef, {
      payments: arrayUnion(paymentWithTimestamp),
      balance: newBalance,
      status: newBalance === 0 ? "Closed" : loanData.status,
    });
  });
};

