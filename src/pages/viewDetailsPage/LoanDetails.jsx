import { useState } from "react";
import { Link } from "react-router-dom";
import { MainHeader } from "../../components/MainHeader";
import { useLoanLogic } from "./useLoanLogic";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const toDateInputValue = (value) => {
  if (typeof value !== "string") return "";
  return value.slice(0, 10);
};

const validatePaymentDate = (date, loanDate) => {
  const value = toDateInputValue(date);
  if (!value) return "Payment date is required.";

  const today = getTodayDate();
  if (value > today) return "Payment date cannot be in the future.";

  const normalizedLoanDate = toDateInputValue(loanDate);
  if (normalizedLoanDate && value < normalizedLoanDate) {
    return "Payment date cannot be earlier than loan date.";
  }

  return "";
};

const formatInr = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "₹0";
  return `₹${numeric.toLocaleString("en-IN")}`;
};

const OfflineBanner = () => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
    <div className="flex">
      <div className="ml-3">
        <p className="text-sm text-red-700 font-bold">
          Warning: You are currently offline.
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
        <p className="font-medium text-gray-900">{formatInr(loan.interest)}</p>
      </div>

      <div className="lg:text-right">
        <p className="text-xs text-gray-500">Total Amount</p>
        <p className="font-bold text-lg text-gray-900">{formatInr(loan.amount)}</p>
      </div>

      <div className="lg:text-right">
        <p className="text-xs text-gray-500">Current Balance</p>
        <p className="font-bold text-lg text-red-600">{formatInr(loan.balance)}</p>
      </div>
    </div>
  </section>
);

const PaymentForm = ({
  onAdd,
  isOnline,
  isPending,
  loanDate,
  currentBalance,
  loanStatus,
}) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getTodayDate());

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loanStatus === "Closed") {
      alert("Loan is closed. Payments cannot be added.");
      return;
    }

    const dateError = validatePaymentDate(date, loanDate);
    if (dateError) {
      alert(dateError);
      return;
    }

    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      alert("Amount paid must be a valid number greater than 0.");
      return;
    }

    const numericBalance = Number(currentBalance);
    if (Number.isFinite(numericBalance) && amountNumber > numericBalance) {
      alert("Amount paid cannot exceed current balance.");
      return;
    }

    if (onAdd(amountNumber, toDateInputValue(date), "credit")) {
      setAmount("");
    }
  };

  const handleNoPayment = () => {
    if (loanStatus === "Closed") {
      alert("Loan is closed. No-payment entry is not allowed.");
      return;
    }

    const dateError = validatePaymentDate(date, loanDate);
    if (dateError) {
      alert(dateError);
      return;
    }

    onAdd(0, toDateInputValue(date), "skip");
  };

  const isClosed = loanStatus === "Closed";
  const isDisabled = !isOnline || isPending || isClosed;

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
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={getTodayDate()}
            disabled={isDisabled}
            className="block w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
            required
          />
        </div>

        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Paid
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            disabled={isDisabled}
            className="block w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
            placeholder="1000"
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
          {isPending
            ? "Adding..."
            : !isOnline
              ? "Offline"
              : isClosed
                ? "Closed"
                : "Add Payment"}
        </button>

        <button
          type="button"
          onClick={handleNoPayment}
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
                    : formatInr(pay.amount)}
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

    if (loan?.status === "Closed") {
      alert("Loan is closed. No more payments can be added.");
      return false;
    }

    const validTypes = new Set(["credit", "skip"]);
    if (!validTypes.has(type)) {
      alert("Invalid payment type.");
      return false;
    }

    const dateError = validatePaymentDate(date, loan?.loanDate);
    if (dateError) {
      alert(dateError);
      return false;
    }
    const normalizedDate = toDateInputValue(date);
    const hasPaymentOnDate = (loan?.payments || []).some(
      (payment) => toDateInputValue(payment?.date) === normalizedDate,
    );
    if (hasPaymentOnDate) {
      alert("Only one payment entry is allowed per date.");
      return false;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) {
      alert("Invalid payment amount.");
      return false;
    }

    if (numericAmount < 0) {
      alert("Payment amount cannot be negative.");
      return false;
    }

    if (type === "credit" && numericAmount <= 0) {
      alert("Amount paid must be greater than 0.");
      return false;
    }

    if (type === "skip" && numericAmount !== 0) {
      alert("No payment entry must have amount 0.");
      return false;
    }

    const currentBalance = Number(loan?.balance);
    if (
      type === "credit" &&
      Number.isFinite(currentBalance) &&
      numericAmount > currentBalance
    ) {
      alert("Amount paid cannot exceed current balance.");
      return false;
    }

    mutation.mutate({
      loanId: id,
      payment: {
        amount: numericAmount,
        date: normalizedDate,
        type,
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
          loanDate={loan?.loanDate}
          currentBalance={loan?.balance}
          loanStatus={loan?.status}
        />
        <PaymentHistory payments={loan.payments} loanId={id} />
      </main>
    </>
  );
}

