import { LoginPage } from "./pages/login/Login";
import { HomePage } from "./pages/home/HomePage";
import { RegisterLoan } from "./pages/registerPage/RegisterPage";
import { LoanDetails } from "./pages/viewDetailsPage/LoanDetails";
import { MonthlyAmount } from "./pages/monthlyAmountPage/MonthlyAmount";
import { LoanStats } from "./pages/allAmount/LoanStats";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config/firebase.js";

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

  const adminEmails = useMemo(() => {
    const raw =
      import.meta.env.VITE_ADMIN_EMAILS || import.meta.env.VITE_ADMIN_EMAIL || "";
    return raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const isAdminUser =
    !!user?.email && adminEmails.includes(user.email.toLowerCase());

  // Listen to Firebase to see if the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setAuthError("");
        setIsCheckingAuth(false);
      },
      () => {
        setAuthError("Unable to verify login status. Please refresh.");
        setIsCheckingAuth(false);
      },
    );
    return () => unsubscribe();
  }, [adminEmails]);
  // Show a blank screen or spinner while checking Firebase
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  // IF NO USER IS LOGGED IN: Only show the Login Page!
  if (!user) {
    return <LoginPage />;
  }

  if (adminEmails.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <section className="max-w-lg w-full rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-red-700">Admin Access Not Configured</h1>
          <p className="mt-2 text-sm text-gray-700">
            Set <code>VITE_ADMIN_EMAILS</code> (comma-separated) or{" "}
            <code>VITE_ADMIN_EMAIL</code> in your environment file.
          </p>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Sign Out
          </button>
        </section>
      </main>
    );
  }

  if (!isAdminUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <section className="max-w-lg w-full rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-red-700">Access Denied</h1>
          <p className="mt-2 text-sm text-gray-700">
            Signed in as <strong>{user.email}</strong>, but this account is not
            allowed for admin access.
          </p>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Sign Out
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {authError ? (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-700 text-center">
          {authError}
        </div>
      ) : null}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterLoan />} />
        <Route path="/viewDetails/:id" element={<LoanDetails />} />
        <Route path="/monthlyAmount/:id" element={<MonthlyAmount />} />
        <Route path="/allAmount" element={<LoanStats />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
