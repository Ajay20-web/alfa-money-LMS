import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { MainHeader } from "../../components/MainHeader";
import { fetchLoanById } from "../../api/loans";

function calculateMonthlyTotals(payments = []) {
  const groups = {};

  payments.forEach((payment) => {
    if (!payment.amount || payment.amount <= 0) return;

    const monthKey = payment.date.substring(0, 7);

    if (!groups[monthKey]) {
      groups[monthKey] = {
        key: monthKey,
        total: 0,
        principal: 0,
        interest: 0,
        count: 0,
      };
    }

    groups[monthKey].total += payment.amount;
    groups[monthKey].count += 1;

    if (payment.type === "interest") {
      groups[monthKey].interest += payment.amount;
    } else {
      groups[monthKey].principal += payment.amount;
    }
  });

  return Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));
}

function FormatMonth({ dateKey }) {
  const date = new Date(dateKey + "-01");
  const label = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return <span className="font-medium text-gray-900">{label}</span>;
}

/* --- MAIN PAGE COMPONENT --- */
export function MonthlyAmount() {
  const { id } = useParams();

  const {
    data: loan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loan", id],
    queryFn: () => fetchLoanById(id),
  });

  if (isLoading)
    return <div className="p-10 text-center">Loading Summary...</div>;
  if (isError)
    return (
      <div className="p-10 text-center text-red-600">Error loading data.</div>
    );

  // Calculate the summary live
  const monthlyData = calculateMonthlyTotals(loan.payments);

  return (
    <>
      <MainHeader />

      <main className="max-w-4xl mx-auto p-6">
        {/* Card Container */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Card Header */}
          <header className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {loan.borrowerName.toUpperCase()}
              </h2>
              <p className="text-sm text-gray-500">Monthly Payment Summary</p>
            </div>
            <Link
              to={`/viewDetails/${id}`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Daily View
            </Link>
          </header>

          <div className="flow-root">
            {/* Summary Section */}
            <section
              aria-label="Financial Summary"
              className="p-6 border-b border-gray-100 grid grid-cols-2 gap-4"
            >
              <div>
                <p className="text-xs text-gray-500">Total Loan Amount</p>
                <p className="font-bold text-xl text-gray-900">
                  ₹{loan.amount?.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Remaining Balance</p>
                <p className="font-bold text-xl text-red-600">
                  ₹{loan.balance?.toLocaleString()}
                </p>
              </div>
            </section>

            {/* List of Payments */}
            <ul role="list" className="divide-y divide-gray-200">
              {/* Items */}
              {monthlyData.map((month) => (
                <li
                  key={month.key}
                  className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">
                    <FormatMonth dateKey={month.key} />
                  </p>
                  <p className="font-medium text-green-600 text-lg">
                    ₹{month.total?.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
