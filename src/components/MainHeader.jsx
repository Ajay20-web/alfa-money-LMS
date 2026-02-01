import { Link } from "react-router-dom";
export function MainHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 flex justify-between">
      <div className="flex justify-between h-16 items-center p-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-sm transform transition hover:scale-105">
            <Link to="/" className="text-white font-bold text-xl">
              A
            </Link>
          </div>
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 tracking-tight"
          >
            Alfa<span className="text-red-600">Money</span>
          </Link>
        </div>
      </div>
      <div className="p-3">
        <Link
          to="/allAmount"
          className=" p-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          state
        </Link>
      </div>
      <div className="p-3">
        <Link
          to="/register"
          className=" p-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          Register Loan
        </Link>
      </div>
    </header>
  );
}
