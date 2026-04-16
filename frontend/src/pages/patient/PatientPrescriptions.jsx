import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./patientPrescriptions.css";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get("/patients/prescriptions");

        const mapped = Array.isArray(res.data)
          ? res.data.map((item, index) => ({
              id: item._id || index,
              medication: item.details || "Medication not specified",
              dosage: item.dosage || "1 tablet daily",
              doctor: item.doctor || "Unknown Doctor",
              date: item.date
                ? new Date(item.date).toLocaleDateString()
                : "N/A",
              status: index === 0 ? "Active" : "Completed"
            }))
          : [];

        setPrescriptions(mapped);
      } catch (error) {
        console.error("Prescriptions fetch error:", error);
        setMessage("Could not load prescriptions from backend.");
      } finally {
        setLoading(false);
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
        {loading ? (
          <p className="empty-text">Loading prescriptions...</p>
        ) : prescriptions.length > 0 ? (
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
              {prescriptions.map((item) => (
                <tr key={item.id}>
                  <td>{item.medication}</td>
                  <td>{item.dosage}</td>
                  <td>{item.doctor}</td>
                  <td>{item.date}</td>
                  <td>
                    <span
                      className={
                        item.status === "Active"
                          ? "status-badge active"
                          : "status-badge completed"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No prescriptions found</h3>
            <p>Your prescriptions will appear here when added by a doctor.</p>
          </div>
        )}
      </div>
    </div>
  );
}