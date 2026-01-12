import { dummyLoans } from "../../mock/mockdata";
import { SearchBar } from "./SearchBar";
import { Link } from "react-router-dom";

/* --- 1. SUB-COMPONENT: The Single Loan Card --- */
/* Extracting this makes the Main component much cleaner */
function LoanCard({ loan }) {
  return (
    <li>
      <article
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
        aria-labelledby={`loan-title-${loan.id}`}
      >
        <div className="p-6 flex-1">
          <header className="flex justify-between items-start mb-4">
            <div>
              <h3
                id={`loan-title-${loan.id}`}
                className="font-semibold text-gray-900 text-lg"
              >
                {(loan.name || "Unnamed Loan").toUpperCase()}
              </h3>
              <p className="text-sm text-gray-500">Loan #{loan.id}</p>
            </div>
            <span className="text-xl font-bold text-gray-600">
              ₹{loan.totalLoanAmount.toLocaleString()}
            </span>
          </header>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="text-m text-gray-900">Balance</h4>
              <span className="text-xl font-bold text-gray-900">
                ₹{loan.remainingAmount.toLocaleString()}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Date of Loan</p>
                <p className="font-medium text-gray-900">2025-10-15</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Term</p>
                <p className="font-medium text-gray-900">
                  {loan.term || "0"} months
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-gray-50 px-6 py-3 border-t border-gray-100 mt-auto">
          <Link
            to="/viewDetails"
            aria-label={`View details for ${loan.name}`}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            View Details
          </Link>
        </footer>
      </article>
    </li>
  );
}

/* --- 2. MAIN COMPONENT --- */
export function Main() {
  const hasLoans = dummyLoans.length > 0;

  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <section
        aria-labelledby="loan-index-title"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h2
            id="loan-index-title"
            className="text-2xl font-bold text-gray-900"
          >
            Loan Index
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Total Loans: {dummyLoans.length}
          </p>
        </div>
        <SearchBar />
      </section>

      {/* Grid Content */}
      {hasLoans ? (
        <ul role="list" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dummyLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </ul>
      ) : (
        /* Empty State (If no loans exist) */
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            No loans found. Create a new one to get started.
          </p>
        </div>
      )}
    </main>
  );
}
