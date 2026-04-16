import { useEffect, useState } from "react";
import adminAPI from "../../api/adminApi";
import "./adminDoctorVerification.css";

export default function AdminDoctorVerification() {
  const [pendingDoctors, setPendingDoctors] = useState([]);

  const fetchPendingDoctors = async () => {
    try {
      const res = await adminAPI.get("/doctors/pending");
      setPendingDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Pending doctors error:", error);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleVerify = async (id) => {
    try {
      await adminAPI.put(`/verify-doctor/${id}`);
      fetchPendingDoctors();
    } catch (error) {
      console.error("Verify doctor error:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.put(`/reject-doctor/${id}`);
      fetchPendingDoctors();
    } catch (error) {
      console.error("Reject doctor error:", error);
    }
  };

  return (
    <div className="doctor-verification-page">
      <h2>Doctor Verification</h2>
      <p>Review and verify doctor registrations</p>

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
                  <td>{doctor.name}</td>
                  <td>{doctor.specialty || "General"}</td>
                  <td>
                    {doctor.createdAt
                      ? new Date(doctor.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{doctor.documentsCount || "N/A"}</td>
                  <td className="doctor-actions">
                    <button className="verify-btn" onClick={() => handleVerify(doctor._id)}>
                      Verify
                    </button>
                    <button className="reject-btn" onClick={() => handleReject(doctor._id)}>
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