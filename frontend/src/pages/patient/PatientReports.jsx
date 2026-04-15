import { useEffect, useState } from "react";
import axios from "axios";
import "./patientReports.css";

export default function PatientReports() {
  const [reports, setReports] = useState([
    {
      name: "Blood Test Report",
      uploadDate: "15 Jan 2024",
      doctor: "Dr. Kavinda Silva"
    },
    {
      name: "X-Ray Chest",
      uploadDate: "10 Jan 2024",
      doctor: "Dr. Nirmali Perera"
    }
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5002/api/patients/reports", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((item, index) => ({
            name: item.filePath?.split("/").pop() || `Report ${index + 1}`,
            uploadDate: item.uploadedAt
              ? new Date(item.uploadedAt).toLocaleDateString()
              : "N/A",
            doctor: "Dr. Kavinda Silva"
          }));
          setReports(mapped);
        }
      })
      .catch(() => {
        console.log("Using mock reports");
      });
  }, []);

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h2>Medical Reports</h2>
          <p>Upload and view your reports</p>
        </div>
        <button className="upload-btn">Upload New Report</button>
      </div>

      <div className="reports-table-card">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Upload Date</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td>{report.name}</td>
                <td>{report.uploadDate}</td>
                <td>{report.doctor}</td>
                <td className="actions-cell">
                  <button className="icon-btn">⬇</button>
                  <button className="icon-btn delete">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}