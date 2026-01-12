import { MainHeader } from "../../components/MainHeader";

export function RegisterLoan() {
  return (
    <>
      <MainHeader />

      <main className="max-w-2xl mx-auto p-6">
        <section
          aria-labelledby="register-loan-title"
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <header className="p-6 border-b border-gray-200 bg-gray-50">
            <h2
              id="register-loan-title"
              className="text-xl font-bold text-gray-900"
            >
              Register New Loan
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter the details below to create a new loan record.
            </p>
          </header>

          <form className="p-6 space-y-6">
            {/* Borrower Name */}
            <div>
              <label
                htmlFor="borrowerName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Borrower Name
              </label>
              <input
                type="text"
                id="borrowerName"
                name="borrowerName"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Financial Details Grid (Amount & Interest) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                  placeholder="e.g. 50000"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="interest"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  id="interest"
                  name="interest"
                  step="0.01"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                  placeholder="e.g. 2.0"
                  required
                />
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="loanDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Loan Date
                </label>
                <input
                  type="date"
                  id="loanDate"
                  name="loanDate"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Place */}
            <div>
              <label
                htmlFor="place"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Place
              </label>
              <input
                type="text"
                id="place"
                name="place"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                placeholder="Enter location"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Submit Registration
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
