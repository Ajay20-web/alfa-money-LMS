import { MainHeader } from "../../components/MainHeader";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerLoan } from "../../api/loans.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation after submission to home page

export function RegisterLoan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    borrowerName: "",
    amount: "",
    interest: "",
    loanDate: "",
    dueDate: "",
    place: "",
    balance: "",
    status: "Active",
  });

  // 2. Define the Mutation Logic
  const mutation = useMutation({
    mutationFn: registerLoan,
    onSuccess: (data) => {
      // Success!
      alert("Loan Registered Successfully!");
      // Clear the form after successful submission
      setFormData({
        borrowerName: "",
        amount: "",
        interest: "",
        loanDate: "",
        dueDate: "",
        place: "",
        balance: "",
        status: "Active",
      });
      //Navigate back to home or home page
      navigate("/");
    },
    onError: (error) => {
      // Error!
      console.error("Error adding document: ", error);
      alert("Failed to register loan. Please try again.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 3. Prepare data (Convert strings to numbers for DB)
    const cleanData = {
      ...formData,
      amount: Number(formData.amount),
      interest: Number(formData.interest),
      balance: Number(formData.balance),
    };

    // 4. Trigger the mutation
    mutation.mutate(cleanData);
  };

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

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* --- Borrower Name --- */}
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
                value={formData.borrowerName}
                onChange={handleChange}
                // Disable input while loading
                disabled={mutation.isPending}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* --- Money Grid (Amount & Interest) --- */}
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
                  value={formData.amount}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
                  placeholder="e.g. 50000"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="interest"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Interest Amount
                </label>
                <input
                  type="number"
                  id="interest"
                  name="interest"
                  step="0.01"
                  value={formData.interest}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
                  placeholder="e.g. 5000.00"
                  required
                />
              </div>
            </div>

            {/* --- Status & Balance Grid --- */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="balance"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Opening Balance (₹)
                </label>
                <input
                  type="number"
                  id="balance"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
                  placeholder="Usually same as Amount"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Loan Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm bg-white disabled:bg-gray-100"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* --- Dates Grid --- */}
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
                  value={formData.loanDate}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
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
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            {/* --- Place --- */}
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
                value={formData.place}
                onChange={handleChange}
                disabled={mutation.isPending}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
                placeholder="Enter location"
                required
              />
            </div>

            {/* --- Submit Button --- */}
            <div className="pt-4">
              <button
                type="submit"
                // 5. Disable button when loading to prevent double-click
                disabled={mutation.isPending}
                className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors duration-200 
                  ${
                    mutation.isPending
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  }`}
              >
                {/* 6. Change text based on state */}
                {mutation.isPending
                  ? "Registering Loan..."
                  : "Submit Registration"}
              </button>

              {/* Optional: Show Error Message nicely */}
              {mutation.isError && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  Error: {mutation.error.message}
                </p>
              )}
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
