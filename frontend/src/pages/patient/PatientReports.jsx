import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./patientReports.css";

export default function PatientReports() {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await API.get("/patients/reports");

      const mapped = res.data.map((item, index) => ({
        id: item._id || index,
        name:
          item.filePath?.split("\\").pop()?.split("/").pop() ||
          `Report ${index + 1}`,
        uploadDate: item.uploadedAt
          ? new Date(item.uploadedAt).toLocaleDateString()
          : "N/A",
        doctor: "Doctor",
        filePath: item.filePath
      }));

      setReports(mapped);
    } catch (error) {
      console.error("Reports fetch error:", error);
      setMessage("Could not load reports from backend.");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("report", file);

      const res = await API.post("/patients/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage(res.data.message || "Report uploaded successfully");
      fetchReports();
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h2>Medical Reports</h2>
          <p>Upload and view your reports</p>
        </div>

        <label className="upload-btn">
          {uploading ? "Uploading..." : "Upload New Report"}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            hidden
          />
        </label>
      </div>

      {message && <p className="reports-message">{message}</p>}

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
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td>{report.uploadDate}</td>
                  <td>{report.doctor}</td>
                  <td className="actions-cell">
                    <button className="icon-btn" type="button">
                      ⬇
                    </button>
                    <button className="icon-btn delete" type="button">
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}