# AlfaMoney LMS

AlfaMoney is a React + Firebase loan management system for a small internal finance office.
It tracks loan registration, daily payments, balances, monthly summaries, and analytics.

## 1. Project Scope

This project is optimized for:
- Single admin usage
- Small to medium dataset (around 40-60 active loans, can handle more)
- Fast internal operations with clear validation and transaction safety

Core goals:
- Prevent invalid payment entries
- Keep balance updates atomic
- Provide easy daily and portfolio-level analytics

## 2. Tech Stack

Frontend:
- React 19
- Vite 7
- Tailwind CSS 4
- React Router DOM 7
- TanStack React Query 5

Backend:
- Firebase Authentication (Email/Password)
- Cloud Firestore

## 3. Application Flow

1. User signs in with Firebase Auth.
2. App checks auth state (`onAuthStateChanged`).
3. App enforces admin allowlist using environment variable email(s).
4. Protected routes are rendered only for allowed admin user.
5. Data is fetched from Firestore and displayed in pages:
- Home (loan list)
- Register Loan
- Loan Details (daily payment updates)
- Monthly Amount view
- Business Overview (analytics)

## 4. Routes

Configured in `src/App.jsx`:
- `/` -> HomePage
- `/register` -> RegisterLoan
- `/viewDetails/:id` -> LoanDetails
- `/monthlyAmount/:id` -> MonthlyAmount
- `/allAmount` -> LoanStats

Unknown routes redirect to `/`.

## 5. Firebase Backend Design

## 5.1 Firestore Collections

Primary collection:
- `loans`

Meta collection used for server time lookup:
- `_meta/server_time`

## 5.2 Loan Document Shape

Each document in `loans` includes fields like:
- `borrowerName: string`
- `amount: number`
- `balance: number`
- `interest: number`
- `loanDate: string (YYYY-MM-DD)`
- `dueDate: string (YYYY-MM-DD)`
- `place: string`
- `status: "Active" | "Pending" | "Closed"`
- `payments: Payment[]`

Payment object inside `payments` array:
- `amount: number`
- `date: string (YYYY-MM-DD)`
- `type: "credit" | "skip"`
- `timestamp: Firestore Timestamp` (server-derived)

## 5.3 API Layer (`src/api/loans.js`)

Implemented functions:
- `registerLoan(loanData)` -> creates new loan document
- `fetchLoans()` -> returns all loans with id
- `fetchLoanById(id)` -> returns one loan or throws
- `addPayment({ loanId, payment })` -> transaction-safe payment update

## 5.4 Transaction Safety in `addPayment`

`addPayment` uses `runTransaction` to ensure atomic updates:
- Fetches current loan snapshot
- Validates loan exists
- Validates current balance is finite and non-negative
- Validates payment amount/type rules
- Computes new balance
- Rejects overpayment (`newBalance < 0`)
- Appends payment via `arrayUnion`
- Updates `balance`
- Sets `status` to `Closed` when balance reaches zero

Timestamp reliability approach:
- Uses Firestore server timestamp resolution via `_meta/server_time` helper
- Stores concrete server-derived timestamp in each payment
- Avoids direct dependency on client device clock for payment timestamp

## 6. Frontend Validation and Reliability

`LoanDetails.jsx` validation before mutation includes:
- Loan must not be closed
- Date required
- Date not in future
- Date not before loan start date
- Allowed types only (`credit`, `skip`)
- `credit` amount must be `> 0`
- `skip` amount must be `0`
- Amount cannot exceed current balance
- One payment entry per date in UI flow

`useLoanLogic.js` reliability:
- Online/offline status tracking
- Query invalidation after successful payment
- Defensive error messaging for network failures

## 7. Analytics: Business Overview

`LoanStats.jsx` provides:
- Total Disbursed (active loans)
- Total Outstanding
- Today's Collection
- Interest Profit (active loans)
- Disbursed - Outstanding

Today's Collection logic:
- Filters credit payments only
- Safely parses Firestore Timestamp / string / Date
- Uses fixed timezone key (`VITE_BUSINESS_TIMEZONE`, default `Asia/Kolkata`)
- Defensive null checks
- Guarded state updates to avoid unnecessary re-renders

## 8. Admin Access Control

`App.jsx` requires:
- Logged-in Firebase user
- Admin email allowlist from env:
  - `VITE_ADMIN_EMAIL`
  - or `VITE_ADMIN_EMAILS` (comma-separated)

If not configured, app shows an explicit admin configuration screen.
If signed in with non-allowed account, app shows Access Denied.

## 9. Environment Variables

Create `.env` in project root:

```env
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_EMAILS=admin@example.com,owner@example.com
VITE_BUSINESS_TIMEZONE=Asia/Kolkata
```

Notes:
- Use either `VITE_ADMIN_EMAIL` or `VITE_ADMIN_EMAILS`.
- `VITE_BUSINESS_TIMEZONE` controls analytics day boundary.

## 10. Firebase Setup

1. Create Firebase project.
2. Enable Authentication -> Email/Password.
3. Create Firestore database.
4. Add web app credentials into `src/config/firebase.js`.
5. Create admin auth user in Firebase Auth.
6. Set admin email env variable(s).
7. Ensure Firestore security rules allow:
- Authenticated admin access to `loans`
- Access to `_meta/server_time` for server-time helper flow

## 11. Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## 12. Suggested Firestore Rules (Starter)

Adjust for your org policy. Basic authenticated-only starter:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /loans/{loanId} {
      allow read, write: if request.auth != null;
    }

    match /_meta/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For stronger control, move to stricter admin-based rules matching your account model.

## 13. Operational Notes

- This system is designed for internal single-admin workflow.
- Transaction logic protects balance consistency.
- Keep one canonical timezone for reporting consistency.
- Periodically back up Firestore data.

## 14. Known Tradeoffs

- Payments are stored as an array in each loan document (simple for this scale).
- Extremely high payment volume per loan can eventually require structural redesign.
- Current architecture is appropriate for small business internal use.

## 15. Project Structure (Key Files)

- `src/App.jsx` - auth gate + route protection
- `src/config/firebase.js` - Firebase initialization
- `src/api/loans.js` - Firestore data and transaction logic
- `src/pages/login/Login.jsx` - admin login
- `src/pages/registerPage/RegisterPage.jsx` - loan creation form
- `src/pages/viewDetailsPage/LoanDetails.jsx` - payment operations UI
- `src/pages/viewDetailsPage/useLoanLogic.js` - query/mutation hook
- `src/pages/allAmount/LoanStats.jsx` - analytics dashboard
- `src/components/MainHeader.jsx` - header navigation + logout

## 16. Security Checklist

Before production usage, confirm:
- Admin email env variables are configured.
- Firebase Auth users are controlled.
- Firestore rules are not public.
- `_meta/server_time` access is allowed only to trusted users.
- API keys/config are correct for intended Firebase project.

---

If you want, next step can be adding a `FIREBASE_RULES.md` with stricter admin-only rules tailored exactly to your current app flow.
