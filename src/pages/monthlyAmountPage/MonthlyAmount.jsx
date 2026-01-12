import { useEffect } from "react";
import { MainHeader } from "../../components/MainHeader";

export function MonthlyAmount({ onBack }) {
  useEffect(() => {
    document.title = "Monthly Payment Summary | ALFA";
  }, []);

  return (
    <>
      <MainHeader />

      <main className="max-w-4xl mx-auto p-6">
        {/* Card Container */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Card Header */}
          <header className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">ALFA</h2>
              <p className="text-sm text-gray-500">Monthly Payment Summary</p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Daily View
            </button>
          </header>

          <div className="flow-root">
            {/* Summary Section */}
            <section
              aria-label="Financial Summary"
              className="p-6 border-b border-gray-100 grid grid-cols-2 gap-4"
            >
              <div>
                <p className="text-xs text-gray-500">Total Loan Amount</p>
                <p className="font-bold text-xl text-gray-900">₹50,000</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Remaining Balance</p>
                <p className="font-bold text-xl text-red-600">₹35,000</p>
              </div>
            </section>

            {/* List of Payments */}
            <ul role="list" className="divide-y divide-gray-200">
              {/* Items */}
              <li className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50">
                <p className="font-semibold text-gray-800">April 2024</p>
                <p className="font-medium text-green-600 text-lg">₹5,000</p>
              </li>
              <li className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50">
                <p className="font-semibold text-gray-800">March 2024</p>
                <p className="font-medium text-green-600 text-lg">₹5,000</p>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
