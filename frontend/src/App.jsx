import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PaymentPage from "./pages/PaymentPage";

// Patient
import PatientLayout from "./components/patient/PatientLayout";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientReports from "./pages/patient/PatientReports";
import PatientPrescriptions from "./pages/patient/PatientPrescriptions";
import PatientHistory from "./pages/patient/PatientHistory";
import PatientLogout from "./pages/patient/PatientLogout";
import FindDoctorsPage from "./components/appointments/FindDoctorsPage";
import NotificationsPanel from "./components/notifications/NotificationsPanel";

// Doctor
import DoctorLayout from "./components/DoctorLayout";
import DoctorHome from "./pages/doctor/DoctorHome";
import DoctorProfilePage from "./pages/doctor/DoctorProfilePage";
import DoctorAvailabilityPage from "./pages/doctor/DoctorAvailabilityPage";
import DoctorPrescriptionsPage from "./pages/doctor/DoctorPrescriptionsPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
import DoctorReportsPage from "./pages/doctor/DoctorReportsPage";
import DoctorNotificationsPage from "./pages/doctor/DoctorNotificationsPage";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDoctorVerification from "./pages/admin/AdminDoctorVerification";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminSystemOverview from "./pages/admin/AdminSystemOverview";
import AdminLogout from "./pages/admin/AdminLogout";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={getDashboardRoute(role)} replace />;
  }

  return children;
}

function getDashboardRoute(role) {
  if (role === "doctor") return "/doctor";
  if (role === "patient") return "/patient/dashboard";
  if (role === "admin") return "/admin";
  return "/login";
}

export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <Navigate to={getDashboardRoute(role)} replace /> : <Navigate to="/login" replace />
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Payment page — accessible outside the patient layout */}
      <Route
        path="/payment"
        element={
          <ProtectedRoute allowedRole="patient">
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorHome />} />
        <Route path="profile" element={<DoctorProfilePage />} />
        <Route path="availability" element={<DoctorAvailabilityPage />} />
        <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
        <Route path="appointments" element={<DoctorAppointmentsPage />} />
        <Route path="notifications" element={<DoctorNotificationsPage />} />
        <Route path="reports" element={<DoctorReportsPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="doctor-verification" element={<AdminDoctorVerification />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="system-overview" element={<AdminSystemOverview />} />
        <Route path="logout" element={<AdminLogout />} />
      </Route>

      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="find-doctors" element={<FindDoctorsPage />} />
        <Route path="notifications" element={<NotificationsPanel />} />
        <Route path="reports" element={<PatientReports />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="history" element={<PatientHistory />} />
        <Route path="logout" element={<PatientLogout />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}