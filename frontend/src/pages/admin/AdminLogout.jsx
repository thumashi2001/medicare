import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./adminLogout.css";

export default function AdminLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="admin-logout-page">
      <div className="admin-logout-card">
        <div className="admin-logout-icon">↪</div>
        <h2>You have been logged out successfully!</h2>
        <p>Redirecting to login...</p>
        <button onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    </div>
  );
}
