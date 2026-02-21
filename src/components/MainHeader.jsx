import { Link, NavLink } from "react-router-dom";
export function MainHeader() {
  const navItemClass = ({ isActive }) =>
    `inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
      isActive
        ? "bg-red-100 text-red-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-lg font-bold text-white shadow-sm transition-transform hover:scale-105"
            aria-label="Go to home"
          >
            A
          </Link>
          <Link to="/" className="truncate text-2xl font-bold tracking-tight text-gray-900">
            Alfa<span className="text-red-600">Money</span>
          </Link>
        </div>

        <nav className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <NavLink
            to="/allAmount"
            className={navItemClass}
          >
            Overview
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                isActive
                  ? "bg-red-700 text-white"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`
            }
          >
            Register Loan
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
