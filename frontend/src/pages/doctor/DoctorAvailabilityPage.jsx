import { useEffect, useState } from "react";
import axios from "axios";

const DOCTOR_API = "http://localhost:5003";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const modes = ["online", "physical", "both"];

export default function DoctorAvailabilityPage() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    dayOfWeek: "Monday",
    startTime: "",
    endTime: "",
    mode: "online",
    isAvailable: true
  });

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAvailability(); }, []);

  const fetchAvailability = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${DOCTOR_API}/api/doctors/availability/me`, { headers: authHeaders });
      setSlots(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load availability slots.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    // Frontend validation
    const toMins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

    if (!formData.startTime || !formData.endTime) {
      setError("Please select both start time and end time.");
      setSaving(false);
      return;
    }

    if (toMins(formData.endTime) <= toMins(formData.startTime)) {
      setError("End time must be after start time.");
      setSaving(false);
      return;
    }

    const newStart = toMins(formData.startTime);
    const newEnd   = toMins(formData.endTime);
    const overlap  = slots.find((s) =>
      s.dayOfWeek === formData.dayOfWeek &&
      newStart < toMins(s.endTime) &&
      newEnd   > toMins(s.startTime)
    );
    if (overlap) {
      setError(`This slot overlaps with an existing slot on ${formData.dayOfWeek} (${overlap.startTime} – ${overlap.endTime}).`);
      setSaving(false);
      return;
    }

    try {
      await axios.post(`${DOCTOR_API}/api/doctors/availability`, formData, {
        headers: { ...authHeaders, "Content-Type": "application/json" }
      });
      setMessage("Availability slot added successfully.");
      setFormData({ dayOfWeek: "Monday", startTime: "", endTime: "", mode: "online", isAvailable: true });
      fetchAvailability();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create availability slot.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slotId) => {
    const confirmed = window.confirm("Are you sure you want to delete this slot?");
    if (!confirmed) return;
    setError("");
    setMessage("");
    try {
      await axios.delete(`${DOCTOR_API}/api/doctors/availability/${slotId}`, { headers: authHeaders });
      setMessage("Availability slot deleted successfully.");
      fetchAvailability();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete availability slot.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <p style={styles.tag}>Availability Management</p>
        <h2 style={styles.headerTitle}>Manage Your Availability</h2>
        <p style={styles.headerText}>Add and manage the time slots patients can use to book appointments with you.</p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Add New Slot</h3>
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Day</label>
            <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} style={styles.input}>
              {days.map((day) => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mode</label>
            <select name="mode" value={formData.mode} onChange={handleChange} style={styles.input}>
              {modes.map((mode) => <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Start Time</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>End Time</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.checkboxRow}>
            <input id="isAvailable" type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
            <label htmlFor="isAvailable" style={styles.checkboxLabel}>Slot is available</label>
          </div>
          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}
          <div style={styles.actions}>
            <button type="submit" style={styles.button} disabled={saving}>{saving ? "Adding..." : "Add Availability Slot"}</button>
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Your Availability Slots</h3>
        {loading ? (
          <p style={styles.text}>Loading availability...</p>
        ) : slots.length === 0 ? (
          <p style={styles.text}>No availability slots added yet.</p>
        ) : (
          <div style={styles.slotList}>
            {slots.map((slot) => (
              <div key={slot._id} style={styles.slotCard}>
                <div>
                  <div style={styles.slotTitle}>{slot.dayOfWeek} • {slot.startTime} - {slot.endTime}</div>
                  <div style={styles.slotMeta}>Mode: {slot.mode} | Status: {slot.isAvailable ? "Available" : "Unavailable"}</div>
                </div>
                <button onClick={() => handleDelete(slot._id)} style={styles.deleteButton}>Delete</button>
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
  label: { fontSize: "14px", fontWeight: "600", color: "#334155" },
  input: { width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid #dbe3ec", background: "#fbfdff", fontSize: "15px", outline: "none" },
  checkboxRow: { display: "flex", alignItems: "center", gap: "10px", gridColumn: "1 / -1" },
  checkboxLabel: { fontSize: "14px", color: "#334155" },
  actions: { gridColumn: "1 / -1", display: "flex" },
  button: { border: "none", background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)", color: "#fff", padding: "14px 22px", borderRadius: "14px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
  slotList: { display: "flex", flexDirection: "column", gap: "12px" },
  slotCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderRadius: "14px", background: "#f8fbff", border: "1px solid #e7eef7" },
  slotTitle: { fontWeight: "700", color: "#243445", marginBottom: "4px" },
  slotMeta: { color: "#6b7b8c", fontSize: "14px" },
  deleteButton: { border: "none", background: "#e74c3c", color: "#fff", padding: "10px 14px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" },
  text: { color: "#6b7b8c" },
  error: { gridColumn: "1 / -1", padding: "12px 14px", borderRadius: "12px", background: "#fff3f2", color: "#d64541", border: "1px solid #ffd9d5" },
  success: { gridColumn: "1 / -1", padding: "12px 14px", borderRadius: "12px", background: "#edfdf3", color: "#1f8f55", border: "1px solid #ccefd9" }
};
