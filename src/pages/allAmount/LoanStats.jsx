import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MainHeader } from "../../components/MainHeader";
import { fetchLoans } from "../../api/loans";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const getLocalDayRangeMs = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { startMs: start.getTime(), endMs: end.getTime() };
};

const getPaymentTimestampMs = (payment) => {
  const rawTimestamp = payment?.timestamp;

  if (rawTimestamp && typeof rawTimestamp.toDate === "function") {
    const dateValue = rawTimestamp.toDate();
    const time = dateValue instanceof Date ? dateValue.getTime() : NaN;
    return Number.isFinite(time) ? time : null;
  }

  if (
    typeof rawTimestamp === "string" ||
    rawTimestamp instanceof Date ||
    typeof rawTimestamp === "number"
  ) {
    const parsedTime = new Date(rawTimestamp).getTime();
    return Number.isFinite(parsedTime) ? parsedTime : null;
  }

  return null;
};

/* --- 1. HELPER: Calculate Totals --- */
function calculateGlobalStats(loans = []) {
  return loans.reduce(
    (stats, loan) => {
      const amount = Number(loan.amount) || 0;
      const balance = Number(loan.balance) || 0;
      const interest = Number(loan.interest) || 0;
      const isClosed = loan.status === "Closed";

      stats.totalGiven += amount;
      if (!isClosed) {
        stats.totalGivenActive += amount;
      }

      stats.totalBalance += balance;

      stats.totalInterest += interest;
      if (!isClosed) {
        stats.totalInterestActive += interest;
      }

      if (isClosed) {
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
  const [todayCollection, setTodayCollection] = useState({ total: 0, count: 0 });

  // Fetch ALL loans
  const {
    data: loansData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loans"],
    queryFn: fetchLoans,
  });

  useEffect(() => {
    const loans = Array.isArray(loansData) ? loansData : [];
    const { startMs, endMs } = getLocalDayRangeMs();
    let total = 0;
    let count = 0;

    for (const loan of loans) {
      const payments = Array.isArray(loan?.payments) ? loan.payments : [];

      for (const payment of payments) {
        if (payment?.type !== "credit") continue;

        const paymentMs = getPaymentTimestampMs(payment);
        if (paymentMs === null) continue;
        if (paymentMs < startMs || paymentMs > endMs) continue;

        const amount = Number(payment?.amount);
        if (!Number.isFinite(amount)) continue;

        total += amount;
        count += 1;
      }
    }

    setTodayCollection((prev) => {
      if (prev.total === total && prev.count === count) return prev;
      return { total, count };
    });
  }, [loansData]);

  if (isLoading)
    return <div className="p-10 text-center">Loading Analytics...</div>;
  if (isError)
    return (
      <div className="p-10 text-center text-red-600">Error loading data.</div>
    );

  const loans = Array.isArray(loansData) ? loansData : [];

  // Run the math
  const stats = calculateGlobalStats(loans);
  const totalLoans = loans.length;
  const recoveredPrincipal = stats.totalGivenActive - stats.totalBalance;
  const activeDisbursed = stats.totalGivenActive;

  return (
    <>
      <MainHeader />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <div className="h-full">
            <StatCard
              title="Total Disbursed"
              value={currencyFormatter.format(activeDisbursed)}
              color="text-gray-900"
              subtext="Total principal amount lent to active borrowers only."
            />
          </div>

          <div className="h-full">
            <StatCard
              title="Total Outstanding"
              value={currencyFormatter.format(stats.totalBalance)}
              color="text-red-600"
              subtext="Total principal money yet to be recovered."
            />
          </div>

          <div className="h-full">
            <StatCard
              title="Today's Collection"
              value={currencyFormatter.format(todayCollection.total)}
              color="text-indigo-700"
              subtext={`${todayCollection.count} payments recorded today`}
            />
          </div>

          <div className="h-full">
            <StatCard
              title="Interest Profit"
              value={currencyFormatter.format(stats.totalInterestActive)}
              color="text-green-600"
              subtext="Total interest amount from active loans only."
            />
          </div>

          <div className="h-full">
            <StatCard
              title="Disbursed - Outstanding"
              value={currencyFormatter.format(recoveredPrincipal)}
              color="text-blue-700"
              subtext="Net principal recovered so far."
            />
          </div>
        </div>
      </main>
    </>
  );
}
