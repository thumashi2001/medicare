import { useNavigate } from "react-router-dom";
import "./patientLogout.css";

export default function PatientLogout() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="logout-page">
      <div className="logout-card">
        <div className="logout-icon">↪</div>
        <h2>You have been logged out successfully!</h2>
        <p>Thank you for using MediCare+. Stay healthy!</p>
        <button onClick={handleBackToLogin}>Back to Login</button>
      </div>
    </div>
  );
}