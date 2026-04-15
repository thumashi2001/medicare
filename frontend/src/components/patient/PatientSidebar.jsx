import { NavLink } from "react-router-dom";
import "./patientSidebar.css";

export default function PatientSidebar() {
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
        <NavLink to="/patient/logout">Logout</NavLink>
      </nav>
    </aside>
  );
}