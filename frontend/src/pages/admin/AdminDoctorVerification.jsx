import { useEffect, useState } from "react";
import adminAPI from "../../api/adminApi";
import "./adminDoctorVerification.css";

export default function AdminDoctorVerification() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [message, setMessage] = useState("");

  const fetchPendingDoctors = async () => {
    try {
      const res = await adminAPI.get("/doctors/pending");
      setPendingDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Pending doctors error:", error);
      setMessage("Failed to load pending doctors.");
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleVerify = async (id) => {
    try {
      await adminAPI.put(`/verify-doctor/${id}`);
      setMessage("Doctor verified successfully.");
      fetchPendingDoctors();
    } catch (error) {
      console.error("Verify doctor error:", error);
      setMessage("Failed to verify doctor.");
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.put(`/reject-doctor/${id}`);
      setMessage("Doctor rejected successfully.");
      fetchPendingDoctors();
    } catch (error) {
      console.error("Reject doctor error:", error);
      setMessage("Failed to reject doctor.");
    }
  };

  return (
    <div className="doctor-verification-page">
      <h2>Doctor Verification</h2>
      <p>Review and verify doctor registrations</p>

      {message && <p className="doctor-message">{message}</p>}

      <div className="doctor-table-card">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialty</th>
              <th>Submitted Date</th>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingDoctors.length > 0 ? (
              pendingDoctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.name || doctor.fullName || "N/A"}</td>
                  <td>{doctor.specialty || "General"}</td>
                  <td>
                    {doctor.createdAt
                      ? new Date(doctor.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{doctor.documentsCount || "N/A"}</td>
                  <td className="doctor-actions">
                    <button
                      className="verify-btn"
                      type="button"
                      onClick={() => handleVerify(doctor._id)}
                    >
                      Verify
                    </button>

                    <button
                      className="reject-btn"
                      type="button"
                      onClick={() => handleReject(doctor._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No pending doctors
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}