import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./patientProfile.css";

export default function PatientProfile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/patients/profile");
        const data = res.data || {};

        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob || "",
          address: data.address || ""
        });

        if (data.fullName) {
          localStorage.setItem("name", data.fullName);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setMessage("Could not load profile from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setMessage("");

      const res = await API.put("/patients/profile", profile);

      setMessage(res.data.message || "Profile updated successfully");
      localStorage.setItem("name", profile.fullName);
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePhoto = () => {
    alert("Profile photo upload can be added next.");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <h2>My Profile</h2>
        <p className="profile-subtitle">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <p className="profile-subtitle">Manage your personal information</p>

      {message && <p className="profile-message">{message}</p>}

      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-avatar">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "A"}
          </div>
          <button
            className="change-photo-btn"
            type="button"
            onClick={handleChangePhoto}
          >
            Change Photo
          </button>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="text"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            className="update-btn"
            type="button"
            onClick={handleUpdate}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}