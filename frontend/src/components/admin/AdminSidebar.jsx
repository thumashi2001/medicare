import { NavLink } from "react-router-dom";
import logo from "../../assets/logo/500x90-logo-tp.png";
import "./adminSidebar.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo-container">
        <img src={logo} alt="MediCare Logo" className="admin-logo-img" />
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/users">User Management</NavLink>
        <NavLink to="/admin/doctor-verification">Doctor Verification</NavLink>
        <NavLink to="/admin/transactions">Transactions</NavLink>
        <NavLink to="/admin/system-overview">System Overview</NavLink>
        <NavLink to="/admin/logout">Logout</NavLink>
      </nav>
    </aside>
  );
}