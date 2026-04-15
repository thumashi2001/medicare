import { useEffect, useState } from "react";
import axios from "axios";
import "./patientPrescriptions.css";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([
    {
      medication: "Amlodipine 5mg",
      dosage: "1 tablet daily",
      doctor: "Dr. Kavinda Silva",
      date: "15 Jan 2024",
      status: "Active"
    },
    {
      medication: "Cetirizine 10mg",
      dosage: "1 tablet at night",
      doctor: "Dr. Nirmali Perera",
      date: "10 Jan 2024",
      status: "Completed"
    }
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5002/api/patients/prescriptions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            medication: item.details || "Medication",
            dosage: "1 tablet daily",
            doctor: item.doctor || "Unknown Doctor",
            date: item.date ? new Date(item.date).toLocaleDateString() : "N/A",
            status: "Active"
          }));
          setPrescriptions(mapped);
        }
      })
      .catch(() => {
        console.log("Using mock prescriptions");
      });
  }, []);

  return (
    <div className="prescriptions-page">
      <h2>Prescriptions</h2>
      <p className="page-subtitle">Your prescribed medications</p>

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
            {prescriptions.map((item, index) => (
              <tr key={index}>
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
      </div>
    </div>
  );
}