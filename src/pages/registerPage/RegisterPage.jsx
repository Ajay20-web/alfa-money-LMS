import { MainHeader } from "../../components/MainHeader";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerLoan } from "../../api/loans.js";
import { useNavigate } from "react-router-dom"; 

export function RegisterLoan() {
  const navigate = useNavigate();
  const defaultFormData = {
    borrowerName: "",
    amount: "",
    interest: "",
    loanDate: "",
    dueDate: "",
    place: "",
    balance: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(defaultFormData);

  const mutation = useMutation({
    mutationFn: registerLoan,
    onSuccess: (data) => {
      alert("Loan Registered Successfully!");
      setFormData(defaultFormData);
      navigate("/");
    },
    onError: (error) => {
      if (import.meta.env.DEV) {
        console.error("Error adding document: ", error);
      }
      alert("Failed to register loan. Please try again.");
    },
  });

  // --- THE MAGIC HAPPENS HERE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      
      // Auto-fill Balance if Amount is changed
      if (name === "amount") {
        updatedData.balance = value; 
      }
      
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(formData.amount);
    const interest = Number(formData.interest);
    const balance = Number(formData.balance);
    const loanDate = new Date(formData.loanDate);
    const dueDate = new Date(formData.dueDate);
    const allowedStatuses = new Set(["Active", "Pending", "Closed"]);

    if (!formData.borrowerName.trim()) {
      alert("Borrower name is required.");
      return;
    }

    if (!formData.place.trim()) {
      alert("Place is required.");
      return;
    }

    if (
      !Number.isFinite(amount) ||
      !Number.isFinite(interest) ||
      !Number.isFinite(balance)
    ) {
      alert("Amount, interest, and balance must be valid numbers.");
      return;
    }

    if (amount <= 0 || interest < 0 || balance < 0) {
      alert("Amount must be greater than 0. Interest and balance cannot be negative.");
      return;
    }

    if (Number.isNaN(loanDate.getTime()) || Number.isNaN(dueDate.getTime())) {
      alert("Please provide valid loan and due dates.");
      return;
    }

    if (dueDate < loanDate) {
      alert("Due date cannot be earlier than loan date.");
      return;
    }

    if (!allowedStatuses.has(formData.status)) {
      alert("Selected loan status is invalid.");
      return;
    }

    const cleanData = {
      ...formData,
      borrowerName: formData.borrowerName.trim(),
      place: formData.place.trim(),
      amount,
      interest,
      balance,
    };

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
              <label htmlFor="borrowerName" className="block text-sm font-medium text-gray-700 mb-1">
                Borrower Name
              </label>
              <input
                type="text"
                id="borrowerName"
                name="borrowerName"
                value={formData.borrowerName}
                onChange={handleChange}
                disabled={mutation.isPending}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* --- Money Grid (Amount & Interest) --- */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
                  placeholder="e.g. 50000"
                  required
                />
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Amount
                </label>
                <input
                  type="number"
                  id="interest"
                  name="interest"
                  min="0"
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
                <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Balance (₹)
                </label>
                <input
                  type="number"
                  id="balance"
                  name="balance"
                  min="0"
                  step="0.01"
                  value={formData.balance}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm disabled:bg-gray-100"
                  placeholder="Auto-fills from Amount"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="loanDate" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1">
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
                disabled={mutation.isPending}
                className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors duration-200 
                  ${
                    mutation.isPending
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  }`}
              >
                {mutation.isPending
                  ? "Registering Loan..."
                  : "Submit Registration"}
              </button>

              {mutation.isError && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  Failed to register loan. Please check your input and try again.
                </p>
              )}
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
