import { useEffect, useState } from "react";
import axios from "axios";

const DOCTOR_API = "http://localhost:5002";

export default function DoctorProfilePage() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    specialization: "",
    hospital: "",
    experience: "",
    qualifications: "",
    consultationFee: "",
    bio: "",
    profileImage: ""
  });

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await axios.get(`${DOCTOR_API}/api/doctors/profile/me`, { headers: authHeaders });
      const profile = response.data.data;
      setFormData({
        specialization: profile.specialization || "",
        hospital: profile.hospital || "",
        experience: profile.experience ?? "",
        qualifications: profile.qualifications || "",
        consultationFee: profile.consultationFee ?? "",
        bio: profile.bio || "",
        profileImage: profile.profileImage || ""
      });
      setProfileExists(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setProfileExists(false);
      } else {
        setError(err.response?.data?.message || "Failed to load doctor profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const payload = { ...formData, experience: Number(formData.experience) || 0, consultationFee: Number(formData.consultationFee) || 0 };
    try {
      if (profileExists) {
        await axios.put(`${DOCTOR_API}/api/doctors/profile/me`, payload, {
          headers: { ...authHeaders, "Content-Type": "application/json" }
        });
        setMessage("Profile updated successfully.");
      } else {
        await axios.post(`${DOCTOR_API}/api/doctors/profile`, payload, {
          headers: { ...authHeaders, "Content-Type": "application/json" }
        });
        setProfileExists(true);
        setMessage("Profile created successfully.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.card}><h2 style={styles.title}>Doctor Profile</h2><p style={styles.text}>Loading profile...</p></div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <p style={styles.tag}>Profile Management</p>
        <h2 style={styles.headerTitle}>Doctor Profile</h2>
        <p style={styles.headerText}>Keep your specialization, hospital details, fees, and bio up to date.</p>
      </div>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Specialization</label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Cardiologist" style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Hospital / Clinic</label>
            <input type="text" name="hospital" value={formData.hospital} onChange={handleChange} placeholder="Nawaloka Hospital" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Experience (Years)</label>
            <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="5" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Consultation Fee</label>
            <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} placeholder="5000" style={styles.input} />
          </div>
          <div style={styles.fieldFull}>
            <label style={styles.label}>Qualifications</label>
            <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} placeholder="MBBS, MD" style={styles.input} />
          </div>
          <div style={styles.fieldFull}>
            <label style={styles.label}>Profile Image URL</label>
            <input type="text" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder="https://..." style={styles.input} />
          </div>
          <div style={styles.fieldFull}>
            <label style={styles.label}>Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Write a short introduction about yourself" style={styles.textarea} rows={5} />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}
          <div style={styles.actions}>
            <button type="submit" style={styles.button} disabled={saving}>
              {saving ? (profileExists ? "Updating..." : "Creating...") : (profileExists ? "Update Profile" : "Create Profile")}
            </button>
          </div>
        </form>
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
  title: { marginTop: 0, color: "#243445" },
  text: { color: "#6b7b8c" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldFull: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#334155" },
  input: { width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid #dbe3ec", background: "#fbfdff", fontSize: "15px", outline: "none" },
  textarea: { width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid #dbe3ec", background: "#fbfdff", fontSize: "15px", outline: "none", resize: "vertical", fontFamily: "inherit" },
  actions: { gridColumn: "1 / -1", display: "flex" },
  button: { border: "none", background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)", color: "#fff", padding: "14px 22px", borderRadius: "14px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
  error: { gridColumn: "1 / -1", padding: "12px 14px", borderRadius: "12px", background: "#fff3f2", color: "#d64541", border: "1px solid #ffd9d5" },
  success: { gridColumn: "1 / -1", padding: "12px 14px", borderRadius: "12px", background: "#edfdf3", color: "#1f8f55", border: "1px solid #ccefd9" }
};
