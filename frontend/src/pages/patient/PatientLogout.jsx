import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./patientLogout.css";

export default function PatientLogout() {
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
    <div className="logout-page">
      <div className="logout-card">
        <div className="logout-icon">↪</div>
        <h2>You have been logged out successfully!</h2>
        <p>Redirecting to login...</p>
        <button onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    </div>
  );
}