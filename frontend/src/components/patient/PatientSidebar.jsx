import { NavLink, useNavigate } from "react-router-dom";

export default function PatientSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="patient-sidebar">
      <div className="brand">MediCare+</div>

      <nav className="patient-nav">
        <NavLink to="/patient/dashboard">Dashboard</NavLink>
        <NavLink to="/patient/profile">My Profile</NavLink>
        <NavLink to="/patient/appointments">Appointments</NavLink>
        <NavLink to="/patient/reports">Medical Reports</NavLink>
        <NavLink to="/patient/prescriptions">Prescriptions</NavLink>
        <NavLink to="/patient/history">Health History</NavLink>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </aside>
  );
}