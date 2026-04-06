import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'

// Public website pages
import HomePage from './pages/public/HomePage'
import EducationalSystemPage from './pages/public/EducationalSystemPage'
import EducationSubPage from './pages/public/EducationSubPage'
import DepartmentsPage from './pages/public/DepartmentsPage'
import DepartmentSubPage from './pages/public/DepartmentSubPage'
import SpeechesPage from './pages/public/SpeechesPage'
import ProjectsPage from './pages/public/ProjectsPage'
import ContactPage from './pages/public/ContactPage'

// Portal / internal pages
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentsPage from './pages/admin/StudentsPage'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import ParentDashboard from './pages/parent/ParentDashboard'
import ClassesPage from './pages/admin/ClassesPage'
import PendingApproval from './pages/PendingApproval'
import UserManagementPage from './pages/admin/UserManagementPage'
import AdminAttendancePage from './pages/admin/AttendancePage'
import TeacherAttendancePage from './pages/teacher/AttendancePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'
import ApprovalQueuePage from './pages/admin/ApprovalQueuePage'
import StudentDetailPage from './pages/admin/StudentDetailPage'
import TeachersPage from './pages/admin/TeachersPage'
import ParentsPage from './pages/admin/ParentsPage'
import FeesPage from './pages/admin/FeesPage'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <Routes>
              {/* ── Public website ─────────────────────────────── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/education" element={<EducationalSystemPage />} />
              <Route path="/education/:slug" element={<EducationSubPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/departments/:slug" element={<DepartmentSubPage />} />
              <Route path="/speeches" element={<SpeechesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* ── Auth ───────────────────────────────────────── */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/pending" element={<ProtectedRoute><PendingApproval /></ProtectedRoute>} />

              {/* ── Portal dispatcher ──────────────────────────── */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              {/* ── General ────────────────────────────────────── */}
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* ── Admin ──────────────────────────────────────── */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><StudentsPage /></ProtectedRoute>} />
              <Route path="/admin/students/:id" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><StudentDetailPage /></ProtectedRoute>} />
              <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><TeachersPage /></ProtectedRoute>} />
              <Route path="/admin/parents" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ParentsPage /></ProtectedRoute>} />
              <Route path="/admin/classes" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ClassesPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><UserManagementPage /></ProtectedRoute>} />
              <Route path="/admin/attendance" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminAttendancePage /></ProtectedRoute>} />
              <Route path="/admin/fees" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><FeesPage /></ProtectedRoute>} />
              <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ApprovalQueuePage /></ProtectedRoute>} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* ── Teacher ────────────────────────────────────── */}
              <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/teacher/attendance" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAttendancePage /></ProtectedRoute>} />
              <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />

              {/* ── Parent ─────────────────────────────────────── */}
              <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
              <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />

              {/* ── Fallback ───────────────────────────────────── */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
