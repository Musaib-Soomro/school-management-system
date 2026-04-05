# Islamic School Management System (ISMS)

A full-featured school management web application built for Islamic educational institutions. It provides role-based dashboards for administrators, teachers, and parents — covering student records, attendance, class scheduling, fee management, and user approval workflows.

**Live Demo:** *(add your Vercel URL after deployment)*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS 3.4.17 |
| Routing | React Router DOM v7 |
| Backend / Auth / DB | Supabase (Auth, Postgres, Row-Level Security) |
| Icons | lucide-react |
| Fonts | Cormorant Garamond + DM Sans (Google Fonts) |
| Deployment | Vercel |

---

## Features

### Admin
- Student directory with enrollment details and individual detail pages
- Class management — create classes, assign teachers, enroll students
- Teacher and parent directory
- Attendance overview across all classes
- Fee records and payment tracking with auto-status calculation (paid / partial / unpaid)
- User account management and approval queue for new registrations
- Profile update request system

### Teacher
- Personal dashboard showing assigned classes
- Attendance marking per class session with present / absent / late status

### Parent
- Dashboard showing all linked children
- 30-day visual attendance calendar per child
- Fee status visibility per child

### Shared
- Secure email/password authentication via Supabase Auth
- Forgot password and reset password flows
- Role-based protected routes (admin, teacher, parent)
- Pending approval state for newly registered accounts
- Profile page for all roles

---

## Project Structure

```
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/          # FeeLedger, PaymentForm, StudentForm, StudentTable, etc.
│   │   ├── auth/           # ProtectedRoute
│   │   ├── layouts/        # AdminLayout
│   │   └── shared/         # AttendanceRoster
│   ├── contexts/
│   │   └── AuthContext.jsx       # Global auth state + profile via Supabase
│   ├── lib/
│   │   └── supabase.js           # Supabase client (import from here only)
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── StudentDetailPage.jsx
│   │   │   ├── ClassesPage.jsx
│   │   │   ├── TeachersPage.jsx
│   │   │   ├── ParentsPage.jsx
│   │   │   ├── AttendancePage.jsx
│   │   │   ├── FeesPage.jsx
│   │   │   ├── UserManagementPage.jsx
│   │   │   └── ApprovalQueuePage.jsx
│   │   ├── teacher/
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── AttendancePage.jsx
│   │   ├── parent/
│   │   │   └── ParentDashboard.jsx
│   │   ├── Dashboard.jsx         # Role dispatcher
│   │   ├── LoginPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── PendingApproval.jsx
│   │   └── ProfilePage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example            # Copy to .env and fill in your Supabase credentials
├── vercel.json             # SPA rewrite rule so React Router works on Vercel
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A [Supabase](https://supabase.com) project with authentication enabled
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Musaib-Soomro/school-management-system.git
   cd school-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`.

---

## Environment Variables

| Variable | Required | Where to find it |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase Dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase Dashboard → Project Settings → API |

> Variables must be prefixed with `VITE_` for Vite to expose them to the browser. Never use the Supabase **service role** key on the frontend — always use the **anon/public** key.

---

## Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import this repository.
2. Vercel auto-detects Vite. Leave all build settings as default:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Under **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Click **Deploy**.

The `vercel.json` in this repo ensures all routes rewrite to `index.html` so React Router deep links and page refreshes work correctly.

### After deployment — configure Supabase Auth

Go to Supabase Dashboard → **Authentication → URL Configuration**:
- **Site URL:** `https://your-vercel-url.vercel.app`
- **Redirect URLs:** `https://your-vercel-url.vercel.app/**`

This is required for the forgot-password → `/reset-password` flow to work in production.

---

## Supabase Notes

- **Row-Level Security (RLS)** is enabled on all tables.
- **Roles** (`admin`, `teacher`, `parent`) are stored in the `profiles` table linked to `auth.users` via UUID.
- **New registrations** enter a pending approval state. An admin must approve them from the Approval Queue before they can access the system.
- All role-check RLS policies use a `SECURITY DEFINER` helper function `get_my_role()` to avoid infinite recursion.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server at localhost:5173 |
| `npm run build` | Production build output to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## License

MIT
