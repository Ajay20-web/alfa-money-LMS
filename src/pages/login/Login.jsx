import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-email"
      ) {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-2">
        <section className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-red-700 via-red-600 to-orange-500 p-10 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent_35%)]" />
          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
              Secure Finance Workspace
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight">
              AlfaMoney
            </h1>
            <p className="mt-3 max-w-sm text-sm text-red-50">
              Manage lending operations with clear records, disciplined tracking,
              and trusted daily updates.
            </p>
          </div>
          <div className="relative z-10 rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm font-semibold">Protected Access</p>
            <p className="mt-1 text-xs text-red-100">
              This dashboard is restricted to authorized administrators only.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <p className="text-xs font-semibold tracking-[0.2em] text-red-600">
                ADMIN LOGIN
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to your dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              >
                {isLoading ? "Checking..." : "Enter Dashboard"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
