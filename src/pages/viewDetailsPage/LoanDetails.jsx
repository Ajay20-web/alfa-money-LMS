import { useState } from "react";
import { MainHeader } from "../../components/MainHeader";

// Mock data for a single loan, as we don't have access to the router or full mock data file.
const loanDetails = {
  id: "loan-001",
  borrowerName: "John Doe",
  loanDate: "2024-01-15",
  dueDate: "2025-01-15",
  totalLoanAmount: 50000,
  remainingAmount: 35000,
  payments: [
    { date: "2024-02-15", amount: 5000 },
    { date: "2024-03-15", amount: 5000 },
    { date: "2024-04-15", amount: 5000 },
  ],
};

export function LoanDetails() {
  const [payments, setPayments] = useState(loanDetails.payments);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!paymentAmount || !paymentDate) return;

    const newPayment = {
      date: paymentDate,
      amount: parseFloat(paymentAmount),
    };

    setPayments([...payments, newPayment]);
    // Here you would also update the loan's remaining amount
    // For this example, we'll just add to the list.
    setPaymentAmount("");
  };

  const handleNoPayment = () => {
    if (!paymentDate) return;

    const newPayment = {
      date: paymentDate,
      amount: 0,
    };

    setPayments([...payments, newPayment]);
  };

  return (
    <>
      <MainHeader />
      <div className="max-w-4xl mx-auto p-6 space-y-6 ">
        {/* Loan Information Header */}
        <header className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {loanDetails.borrowerName}
            </h2>
            <span
              className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 self-start`}
            >
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Loan Date</p>
              <p className="font-medium text-gray-900">
                {loanDetails.loanDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="font-medium text-gray-900">{loanDetails.dueDate}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="font-bold text-lg text-gray-900">
                ₹{loanDetails.totalLoanAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500">Balance</p>
              <p className="font-bold text-lg text-red-600">
                ₹{loanDetails.remainingAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </header>

        {/* Add Payment Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Update Daily Loan Amount Paid
          </h3>
          <form
            onSubmit={handleAddPayment}
            className="flex flex-col sm:flex-row items-end gap-4"
          >
            <div className="w-full sm:w-1/3">
              <label
                htmlFor="paymentAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount Paid
              </label>
              <input
                type="number"
                id="paymentAmount"
                name="paymentAmount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                placeholder="e.g., 1000"
                required
              />
            </div>
            <div className="w-full sm:w-1/3">
              <label
                htmlFor="paymentDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Date
              </label>
              <input
                type="date"
                id="paymentDate"
                name="paymentDate"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto mt-4 sm:mt-0 inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Add Payment
            </button>
            <button
              type="button"
              onClick={handleNoPayment}
              className="w-full sm:w-auto mt-4 sm:mt-0 inline-flex justify-center items-center px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              No Payment
            </button>
          </form>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <header className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Monthly Amount
            </button>
          </header>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments
                  .slice()
                  .reverse()
                  .map((payment, index) => (
                    <li
                      key={index}
                      className="p-4 sm:p-6 flex justify-between items-center"
                    >
                      <div>
                        <p
                          className={`font-semibold ${
                            payment.amount > 0
                              ? "text-gray-800"
                              : "text-red-500"
                          }`}
                        >
                          {payment.amount > 0
                            ? `₹${payment.amount.toLocaleString()}`
                            : "No Payment"}
                        </p>
                        <p className="text-sm text-gray-500">{payment.date}</p>
                      </div>
                      <span
                        className={`font-medium ${
                          payment.amount > 0
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {payment.amount > 0 ? "Received" : "Recorded"}
                      </span>
                    </li>
                  ))
              ) : (
                <li className="p-6 text-center text-gray-500">
                  No payments recorded yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
