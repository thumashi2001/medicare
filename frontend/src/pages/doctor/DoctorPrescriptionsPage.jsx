import { useEffect, useState } from "react";
import axios from "axios";

const DOCTOR_API = "http://localhost:5003";

export default function DoctorPrescriptionsPage() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    notes: "",
    medicines: [{ name: "", dosage: "", duration: "" }]
  });

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchPrescriptions(); }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${DOCTOR_API}/api/doctors/prescriptions`, { headers: authHeaders });
      setPrescriptions(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedMedicines = [...prev.medicines];
      updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
      return { ...prev, medicines: updatedMedicines };
    });
  };

  const addMedicineRow = () => {
    setFormData((prev) => ({ ...prev, medicines: [...prev.medicines, { name: "", dosage: "", duration: "" }] }));
  };

  const removeMedicineRow = (index) => {
    if (formData.medicines.length === 1) return;
    setFormData((prev) => ({ ...prev, medicines: prev.medicines.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const cleanedMedicines = formData.medicines.filter(
      (med) => med.name.trim() && med.dosage.trim() && med.duration.trim()
    );
    const payload = { patientId: formData.patientId, diagnosis: formData.diagnosis, notes: formData.notes, medicines: cleanedMedicines };
    try {
      await axios.post(`${DOCTOR_API}/api/doctors/prescriptions`, payload, {
        headers: { ...authHeaders, "Content-Type": "application/json" }
      });
      setMessage("Prescription created successfully.");
      setFormData({ patientId: "", diagnosis: "", notes: "", medicines: [{ name: "", dosage: "", duration: "" }] });
      fetchPrescriptions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create prescription.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <p style={styles.tag}>Prescription Management</p>
        <h2 style={styles.headerTitle}>Digital Prescriptions</h2>
        <p style={styles.headerText}>Create prescriptions for patients and review your recently issued records.</p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Create Prescription</h3>
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Patient ID</label>
            <input type="text" name="patientId" value={formData.patientId} onChange={handleChange} placeholder="patient123" style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Diagnosis</label>
            <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="Common Cold" style={styles.input} required />
          </div>
          <div style={styles.fieldFull}>
            <label style={styles.label}>Medicines</label>
            <div style={styles.medicineList}>
              {formData.medicines.map((medicine, index) => (
                <div key={index} style={styles.medicineRow}>
                  <input type="text" placeholder="Medicine name" value={medicine.name} onChange={(e) => handleMedicineChange(index, "name", e.target.value)} style={styles.input} />
                  <input type="text" placeholder="Dosage" value={medicine.dosage} onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)} style={styles.input} />
                  <input type="text" placeholder="Duration" value={medicine.duration} onChange={(e) => handleMedicineChange(index, "duration", e.target.value)} style={styles.input} />
                  <button type="button" onClick={() => removeMedicineRow(index)} style={styles.removeButton}>Remove</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addMedicineRow} style={styles.secondaryButton}>Add Medicine</button>
          </div>
          <div style={styles.fieldFull}>
            <label style={styles.label}>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Drink plenty of water" style={styles.textarea} rows={4} />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}
          <div style={styles.actions}>
            <button type="submit" style={styles.button} disabled={saving}>{saving ? "Creating..." : "Create Prescription"}</button>
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Recent Prescriptions</h3>
        {loading ? (
          <p style={styles.text}>Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p style={styles.text}>No prescriptions created yet.</p>
        ) : (
          <div style={styles.prescriptionList}>
            {prescriptions.map((prescription) => (
              <div key={prescription._id} style={styles.prescriptionCard}>
                <div style={styles.prescriptionTop}>
                  <div>
                    <div style={styles.prescriptionTitle}>Patient: {prescription.patientId}</div>
                    <div style={styles.prescriptionMeta}>Diagnosis: {prescription.diagnosis}</div>
                  </div>
                  <div style={styles.dateText}>{new Date(prescription.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={styles.medicineBlock}>
                  {prescription.medicines.map((medicine) => (
                    <div key={medicine._id} style={styles.medicineItem}>• {medicine.name} | {medicine.dosage} | {medicine.duration}</div>
                  ))}
                </div>
                {prescription.notes && <div style={styles.notes}><strong>Notes:</strong> {prescription.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", gap: "20px" },
  headerCard: { background: "linear-gradient(135deg, #2ecc71 0%, #3498db 100%)", color: "#fff", padding: "28px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(52, 152, 219, 0.18)" },
  tag: { margin: 0, fontWeight: "700", opacity: 0.95 },
  headerTitle: { margin: "8px 0 10px", fontSize: "32px" },
  headerText: { margin: 0, maxWidth: "760px", lineHeight: "1.7", opacity: 0.95 },
  card: { background: "#ffffff", padding: "28px", borderRadius: "22px", boxShadow: "0 12px 28px rgba(0,0,0,0.06)" },
  sectionTitle: { marginTop: 0, marginBottom: "18px", color: "#243445" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldFull: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#334155" },
  input: { width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid #dbe3ec", background: "#fbfdff", fontSize: "15px", outline: "none" },
  textarea: { width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid #dbe3ec", background: "#fbfdff", fontSize: "15px", outline: "none", resize: "vertical", fontFamily: "inherit" },
  medicineList: { display: "flex", flexDirection: "column", gap: "12px" },
  medicineRow: { display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", gap: "10px", alignItems: "center" },
  removeButton: { border: "none", background: "#e74c3c", color: "#fff", padding: "12px 14px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" },
  secondaryButton: { alignSelf: "flex-start", border: "none", background: "#3498db", color: "#fff", padding: "12px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" },
  actions: { gridColumn: "1 / -1", display: "flex" },
  button: { border: "none", background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)", color: "#fff", padding: "14px 22px", borderRadius: "14px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
  prescriptionList: { display: "flex", flexDirection: "column", gap: "14px" },
  prescriptionCard: { padding: "18px", borderRadius: "16px", background: "#f8fbff", border: "1px solid #e7eef7" },
  prescriptionTop: { display: "flex", justifyContent: "space-between", gap: "14px", marginBottom: "12px" },
  prescriptionTitle: { fontWeight: "700", color: "#243445", marginBottom: "6px" },
  prescriptionMeta: { color: "#6b7b8c", fontSize: "14px" },
  dateText: { color: "#6b7b8c", fontSize: "13px", whiteSpace: "nowrap" },
  medicineBlock: { display: "flex", flexDirection: "column", gap: "6px" },
  medicineItem: { color: "#2c3e50", fontSize: "14px" },
  notes: { marginTop: "12px", color: "#445566", fontSize: "14px", lineHeight: "1.6" },
  text: { color: "#6b7b8c" },
  error: { gridColumn: "1 / -1", padding: "12px 14px", borderRadius: "12px", background: "#fff3f2", color: "#d64541", border: "1px solid #ffd9d5" },
  success: { gridColumn: "1 / -1", padding: "12px 14px", borderRadius: "12px", background: "#edfdf3", color: "#1f8f55", border: "1px solid #ccefd9" }
};
