import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./patientPrescriptions.css";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get("/patients/prescriptions");

        const mapped = res.data.map((item, index) => ({
          id: item._id || index,
          medication: item.details || "Medication",
          dosage: "1 tablet daily",
          doctor: item.doctor || "Unknown Doctor",
          date: item.date ? new Date(item.date).toLocaleDateString() : "N/A",
          status: "Active"
        }));

        setPrescriptions(mapped);
      } catch (error) {
        console.error("Prescriptions fetch error:", error);
        setMessage("Could not load prescriptions from backend.");
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="prescriptions-page">
      <h2>Prescriptions</h2>
      <p className="page-subtitle">Your prescribed medications</p>

      {message && <p className="prescriptions-message">{message}</p>}

      <div className="prescriptions-card">
        <table className="prescriptions-table">
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((item) => (
                <tr key={item.id}>
                  <td>{item.medication}</td>
                  <td>{item.dosage}</td>
                  <td>{item.doctor}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className="status-badge active">{item.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No prescriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}