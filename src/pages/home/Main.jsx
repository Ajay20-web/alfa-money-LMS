import { dummyLoans } from "../../mock/mockdata";
import { SearchBar } from "./SearchBar";
import { Link } from "react-router-dom";

export function Main() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loan Index</h2>
          <span className="text-sm text-gray-500">
            Total Loans: {dummyLoans.length}
          </span>
        </div>
        <SearchBar />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyLoans.map((loan) => (
          <div
            key={loan.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {(loan.name || "Unnamed Loan").toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">Loan #{loan.id}</p>
                </div>
                <span className="text-xl font-bold text-gray-600">
                  ₹{loan.totalLoanAmount}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-m text-gray-900">Balance</h4>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{loan.remainingAmount}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">
                      Date of getting loan
                    </p>
                    <p className="font-medium text-gray-900">{"2025-10-15"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="font-medium text-gray-900">
                      {loan.term || "0"} months
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <Link to='/viewDetails' className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
