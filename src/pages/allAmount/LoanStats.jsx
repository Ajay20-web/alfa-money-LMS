import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MainHeader } from "../../components/MainHeader";
import { fetchLoans } from "../../api/loans"; // Reusing your existing fetch function

/* --- 1. HELPER: Calculate Totals --- */
function calculateGlobalStats(loans = []) {
  return loans.reduce(
    (stats, loan) => {
      // 1. Sum up total money given (Principal)
      stats.totalGiven += loan.amount || 0;

      // 2. Sum up total money pending (Balance)
      stats.totalBalance += loan.balance || 0;

      // 3. Sum up total Interest earned
      stats.totalInterest += loan.interest || 0;

      // 4. Count Active vs Closed
      if (loan.status === "Closed") {
        stats.closedCount++;
      } else {
        stats.activeCount++;
      }

      return stats;
    },
    {
      totalGiven: 0,
      totalBalance: 0,
      totalInterest: 0,
      activeCount: 0,
      closedCount: 0,
    },
  );
}

/* --- 2. SUB-COMPONENT: Stat Card --- */
const StatCard = ({ title, value, color, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">
      {title}
    </p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
  </div>
);

/* --- 3. MAIN PAGE COMPONENT --- */
export function LoanStats() {
  // Fetch ALL loans
  const {
    data: loans = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loans"],
    queryFn: fetchLoans,
  });

  if (isLoading)
    return <div className="p-10 text-center">Loading Analytics...</div>;
  if (isError)
    return (
      <div className="p-10 text-center text-red-600">Error loading data.</div>
    );

  // Run the math
  const stats = calculateGlobalStats(loans);
  const totalLoans = loans.length;

  return (
    <>
      <MainHeader />
      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Business Overview
            </h1>
            <p className="text-gray-500">
              Total Loans: {totalLoans} ({stats.activeCount} Active,{" "}
              {stats.closedCount} Closed)
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Big Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Total Amount Given */}
          <StatCard
            title="Total Disbursed"
            value={`₹${stats.totalGiven.toLocaleString()}`}
            color="text-gray-900"
            subtext="Total principal amount lent to all borrowers."
          />

          {/* 2. Total Balance Pending (The most important number) */}
          <StatCard
            title="Total Outstanding"
            value={`₹${stats.totalBalance.toLocaleString()}`}
            color="text-red-600"
            subtext="Total principal money yet to be recovered."
          />

          {/* 3. Total Interest Profit */}
          <StatCard
            title="Interest Profit"
            value={`₹${stats.totalInterest.toLocaleString()}`}
            color="text-green-600"
            subtext="Total interest earnings collected so far."
          />
        </div>

        {/* Optional: Summary Bar */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-blue-900 font-bold text-lg">Recovery Rate</h3>
            <p className="text-blue-700 text-sm">
              Percentage of principal collected
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-blue-800">
              {stats.totalGiven > 0
                ? Math.round(
                    ((stats.totalGiven - stats.totalBalance) /
                      stats.totalGiven) *
                      100,
                  )
                : 0}
              %
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
