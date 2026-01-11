import { HomePage } from "./pages/home/HomePage";
import { RegisterLoan } from "./pages/registerPage/RegisterPage";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterLoan />} />
      </Routes>
    </div>
  );
}

export default App;
