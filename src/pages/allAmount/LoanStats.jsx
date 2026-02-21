import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MainHeader } from "../../components/MainHeader";
import { fetchLoans } from "../../api/loans"; // Reusing your existing fetch function

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

/* --- 1. HELPER: Calculate Totals --- */
function calculateGlobalStats(loans = []) {
  return loans.reduce(
    (stats, loan) => {
      // 1. Sum up total money given (Principal)
      stats.totalGiven += loan.amount || 0;
      if (loan.status !== "Closed") {
        stats.totalGivenActive += loan.amount || 0;
      }

      // 2. Sum up total money pending (Balance)
      stats.totalBalance += loan.balance || 0;

      // 3. Sum up total Interest earned
      stats.totalInterest += loan.interest || 0;
      if (loan.status !== "Closed") {
        stats.totalInterestActive += loan.interest || 0;
      }

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
      totalGivenActive: 0,
      totalBalance: 0,
      totalInterest: 0,
      totalInterestActive: 0,
      activeCount: 0,
      closedCount: 0,
    },
  );
}

/* --- 2. SUB-COMPONENT: Stat Card --- */
const StatCard = ({ title, value, color, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-40">
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
  const recoveredPrincipal = stats.totalGivenActive - stats.totalBalance;
  const activeDisbursed = stats.totalGivenActive;

  return (
    <>
      <MainHeader />
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
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
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-gray-100 text-sm font-medium rounded-lg transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Big Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* 1. Total Amount Given */}
          <StatCard
            title="Total Disbursed"
            value={currencyFormatter.format(activeDisbursed)}
            color="text-gray-900"
            subtext="Total principal amount lent to active borrowers only."
          />

          {/* 2. Total Balance Pending (The most important number) */}
          <StatCard
            title="Total Outstanding"
            value={currencyFormatter.format(stats.totalBalance)}
            color="text-red-600"
            subtext="Total principal money yet to be recovered."
          />

          {/* 3. Total Interest Profit */}
          <StatCard
            title="Interest Profit"
            value={currencyFormatter.format(stats.totalInterestActive)}
            color="text-green-600"
            subtext="Total interest amount from active loans only."
          />

          {/* 4. Total Disbursed - Total Outstanding */}
          <StatCard
            title="Disbursed - Outstanding"
            value={currencyFormatter.format(recoveredPrincipal)}
            color="text-blue-700"
            subtext="Net principal recovered so far."
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

