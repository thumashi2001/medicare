import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentPage from "./pages/PaymentPage";

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
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

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