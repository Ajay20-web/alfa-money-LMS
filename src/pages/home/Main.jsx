import { SearchBar } from "./SearchBar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLoans } from "../../api/loans";

//--Cards---//
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
                {(loan.borrowerName || "Unnamed").toUpperCase()}
              </h3>
              {/* Using Firestore ID now */}
              <p className="text-sm text-gray-500">
                ID: {loan.id.slice(0, 8)}...
              </p>
            </div>
            <span className="text-xl font-bold text-gray-600">
              ₹{loan.amount?.toLocaleString()}
            </span>
          </header>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="text-m text-gray-900">Balance</h4>
              <span className="text-xl font-bold text-gray-900">
                ₹{loan.balance?.toLocaleString()}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Loan Date</p>
                <p className="font-medium text-gray-900">{loan.loanDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Interest</p>
                <p className="font-medium text-gray-900">₹{loan.interest}</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-gray-50 px-6 py-3 border-t border-gray-100 mt-auto">
          {/* We will fix this link later to pass the specific ID */}
          <Link
            to={`/viewDetails/${loan.id}`}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            View Details
          </Link>
        </footer>
      </article>
    </li>
  );
}

//--Main component--//
export function Main() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  // 2. FETCH DATA: Use React Query to get real data
  const {
    data: loans = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loans"],
    queryFn: fetchLoans,
  });

  if (isLoading)
    return <div className="p-10 text-center">Loading loans...</div>;
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">Error loading data.</div>
    );

  const activeCount = loans.filter((loan) => loan.status !== "Closed").length;
  const closedCount = loans.filter((loan) => loan.status === "Closed").length;

  // 3. FILTER LOGIC: This runs automatically whenever filters change
  const filteredLoans = loans.filter((loan) => {
    const borrowerName = String(loan.borrowerName || "").toLowerCase();
    const matchesSearch = !searchTerm || borrowerName.includes(searchTerm.toLowerCase());
    const isClosed = loan.status === "Closed";
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !isClosed) ||
      (statusFilter === "closed" && isClosed);

    return matchesSearch && matchesStatus;
  });

  const isOffline = !navigator.onLine;
  const hasLoansInDb = loans.length > 0;
  const hasSearchResults = filteredLoans.length > 0;

  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen">
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loan Index</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredLoans.length} of {loans.length} Loans
          </p>
        </div>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </section>

      <section className="mb-6">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === "active"
                ? "bg-red-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("closed")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === "closed"
                ? "bg-red-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Closed ({closedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === "all"
                ? "bg-red-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All ({loans.length})
          </button>
        </div>
      </section>

      {/* RENDER LOGIC */}
      {hasSearchResults ? (
        <ul role="list" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </ul>
      ) : (
        /* EMPTY STATE HANDLING */
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-bold">
            {
              isOffline
                ? "⚠️ You appear to be offline. Check your internet connection."
                : !hasLoansInDb
                  ? "No loans found in database." // Database is empty
                  : `No results found for "${searchTerm}"` // Search found nothing
            }
          </p>
        </div>
      )}
    </main>
  );
}
