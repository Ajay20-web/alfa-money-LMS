import { MainHeader } from "../../components/MainHeader";
import { Link } from "react-router-dom";

export function LoanDetails() {
  return (
    <>
      <MainHeader />

      {/* Page Wrapper */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* --- SECTION 1: Loan Overview --- */}
        <section
          aria-labelledby="loan-overview-title"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          {/* Card Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start mb-4">
            <h2
              id="loan-overview-title"
              className="text-2xl font-bold text-gray-900"
            >
              {/* Firebase: Borrower Name */}
              John Doe
            </h2>
            <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 self-start">
              {/* Firebase: Status */}
              Active
            </span>
          </header>

          {/* Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Loan Date</p>
              <p className="font-medium text-gray-900">2024-01-15</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="font-medium text-gray-900">2025-01-15</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="font-bold text-lg text-gray-900">₹50,000</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500">Balance</p>
              <p className="font-bold text-lg text-red-600">₹35,000</p>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: Add Payment Form --- */}
        <section
          aria-labelledby="add-payment-title"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3
            id="add-payment-title"
            className="text-lg font-bold text-gray-900 mb-4"
          >
            Update Daily Loan Amount Paid
          </h3>

          {/* Add your Firebase onSubmit handler here */}
          <form className="flex flex-col sm:flex-row items-end gap-4">
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
              className="w-full sm:w-auto mt-4 sm:mt-0 inline-flex justify-center items-center px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              No Payment
            </button>
          </form>
        </section>

        {/* --- SECTION 3: Payment History --- */}
        <section
          aria-labelledby="history-title"
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <header className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 id="history-title" className="text-lg font-bold text-gray-900">
              Payment History
            </h3>
            <Link
              to="/monthlyAmount"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Monthly Amount
            </Link>
          </header>

          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              {/* Example Item 1: Received Payment */}
              <li className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">₹5,000</p>
                  <p className="text-sm text-gray-500">2024-04-15</p>
                </div>
                <span className="font-medium text-green-600">Received</span>
              </li>

              {/* Example Item 2: No Payment (Zero) */}
              <li className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-red-500">No Payment</p>
                  <p className="text-sm text-gray-500">2024-03-15</p>
                </div>
                <span className="font-medium text-gray-500">Recorded</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
