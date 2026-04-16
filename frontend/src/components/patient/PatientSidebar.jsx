import { NavLink } from "react-router-dom";
import "./patientSidebar.css";
import logo from "../../assets/logo/500x90-logo-tp.png";

export default function PatientSidebar() {
  return (
    <aside className="patient-sidebar">
      <div className="logo-container">
        <img src={logo} alt="MediCare Logo" className="logo-img" />
      </div>

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