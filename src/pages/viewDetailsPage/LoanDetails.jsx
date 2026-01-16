import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainHeader } from "../../components/MainHeader";
import { fetchLoanById, addPayment } from "../../api/loans";

/* --- 1. LOGIC HOOK (The "Brain" of the page) --- */
function useLoanLogic() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Track Online Status
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  // Fetch Data
  const {
    data: loan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loan", id],
    queryFn: () => fetchLoanById(id),
  });

  // Mutation (Add Payment)
  const mutation = useMutation({
    mutationFn: addPayment,
    onSuccess: () => {
      alert("Payment Added Successfully!");
      queryClient.invalidateQueries(["loan", id]);
    },
    onError: (error) => {
      const isNetworkError =
        error.message.includes("offline") || !navigator.onLine;
      alert(
        isNetworkError
          ? "⚠️ Network Error: You seem to be offline."
          : error.message
      );
    },
  });

  return { id, loan, isLoading, isError, isOnline, mutation };
}

/* --- 2. SUB-COMPONENTS (The "Building Blocks") --- */

const OfflineBanner = () => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
    <div className="flex">
      <div className="ml-3">
        <p className="text-sm text-red-700 font-bold">
          ⚠️ You are currently offline.
        </p>
        <p className="text-xs text-red-600">
          You cannot add new payments until connection is restored.
        </p>
      </div>
    </div>
  </div>
);

const LoanOverview = ({ loan }) => (
  <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <header className="flex justify-between items-start mb-4">
      <h2 className="text-2xl font-bold text-gray-900">{loan.borrowerName}</h2>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          loan.status === "Closed"
            ? "bg-gray-100 text-gray-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {loan.status || "Active"}
      </span>
    </header>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-4 border-t border-gray-200">
      <div>
        <p className="text-xs text-gray-500">Loan Date</p>
        <p className="font-medium text-gray-900">{loan.loanDate}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Due Date</p>
        <p className="font-medium text-gray-900">{loan.dueDate}</p>
      </div>

      <div className="lg:text-right">
        <p className="text-xs text-gray-500">Interest</p>
        <p className="font-medium text-gray-900">₹{loan.interest}</p>
      </div>

      <div className="lg:text-right">
        <p className="text-xs text-gray-500">Total Amount</p>
        <p className="font-bold text-lg text-gray-900">
          ₹{loan.amount?.toLocaleString()}
        </p>
      </div>

      <div className="lg:text-right">
        <p className="text-xs text-gray-500">Current Balance</p>
        <p className="font-bold text-lg text-red-600">
          ₹{loan.balance?.toLocaleString()}
        </p>
      </div>
    </div>
  </section>
);

const PaymentForm = ({ onAdd, isOnline, isPending }) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAdd(amount, date, "credit")) setAmount(""); // Clear amount on success
  };

  const isDisabled = !isOnline || isPending;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Update Daily Payment
      </h3>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-end gap-4"
      >
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Paid
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isDisabled}
            className="block w-full p-2 rounded-lg border shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
            placeholder="1000"
            required
          />
        </div>
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isDisabled}
            className="block w-full p-2 border rounded-lg border-gray-600 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full sm:w-auto px-6 py-2 rounded-lg text-white font-medium transition-colors ${
            isDisabled ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isPending ? "Adding..." : !isOnline ? "Offline" : "Add Payment"}
        </button>
        <button
          type="button"
          onClick={() => onAdd(0, date, "skip")}
          disabled={isDisabled}
          className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:bg-gray-100"
        >
          No Payment
        </button>
      </form>
    </section>
  );
};

const PaymentHistory = ({ payments = [], loanId }) => (
  <section className="bg-white rounded-xl shadow-sm border border-gray-200">
    <header className="p-6 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
      <Link
        to={`/monthlyAmount/${loanId}`}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
      >
        Monthly Amount
      </Link>
    </header>
    <ul className="divide-y divide-gray-200">
      {payments.length === 0 ? (
        <li className="p-8 text-center text-gray-500">
          No payments recorded yet.
        </li>
      ) : (
        payments
          .slice()
          .reverse()
          .map((pay, i) => (
            <li
              key={i}
              className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <p
                  className={`font-semibold ${
                    pay.amount === 0 ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  {pay.amount === 0
                    ? "No Payment"
                    : `₹${pay.amount.toLocaleString()}`}
                </p>
                <p className="text-sm text-gray-500">{pay.date}</p>
              </div>
              <span
                className={`font-medium ${
                  pay.amount === 0 ? "text-gray-500" : "text-green-600"
                }`}
              >
                {pay.amount === 0 ? "Recorded" : "Received"}
              </span>
            </li>
          ))
      )}
    </ul>
  </section>
);

/* --- 3. MAIN COMPONENT (The clean result) --- */
export function LoanDetails() {
  const { id, loan, isLoading, isError, isOnline, mutation } = useLoanLogic();

  // Helper to handle both "Add Payment" and "No Payment" logic
  const handlePaymentSubmit = (amount, date, type) => {
    if (!isOnline) return false;
    mutation.mutate({
      loanId: id,
      payment: {
        amount: Number(amount),
        date,
        type,
        timestamp: new Date().toISOString(),
      },
    });
    return true; // Return true to indicate submission started
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (isError)
    return (
      <div className="p-10 text-center text-red-600">Error loading loan.</div>
    );

  return (
    <>
      <MainHeader />
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {!isOnline && <OfflineBanner />}
        <LoanOverview loan={loan} />
        <PaymentForm
          onAdd={handlePaymentSubmit}
          isOnline={isOnline}
          isPending={mutation.isPending}
        />
        <PaymentHistory payments={loan.payments} loanId={id} />
      </main>
    </>
  );
}
