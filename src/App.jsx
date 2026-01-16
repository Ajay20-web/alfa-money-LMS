import { HomePage } from "./pages/home/HomePage";
import { RegisterLoan } from "./pages/registerPage/RegisterPage";
import { LoanDetails } from "./pages/viewDetailsPage/LoanDetails";
import { MonthlyAmount } from "./pages/monthlyAmountPage/MonthlyAmount";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterLoan />} />
        <Route path="/viewDetails/:id" element={<LoanDetails />} />
        <Route path="/monthlyAmount/:id" element={<MonthlyAmount />} />
      </Routes>
    </div>
  );
}

export default App;
