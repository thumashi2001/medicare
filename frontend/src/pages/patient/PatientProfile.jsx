import { useEffect, useState } from "react";
import axios from "axios";
import "./patientProfile.css";

export default function PatientProfile() {
  const [profile, setProfile] = useState({
    fullName: "Anushka Fernando",
    email: "anushka@example.com",
    phone: "071 234 5678",
    dob: "1996-09-15",
    address: "123, Galle Road, Colombo 04"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5002/api/patients/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const data = res.data || {};
        setProfile((prev) => ({
          ...prev,
          fullName: data.name || prev.fullName,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          dob: data.dob || prev.dob,
          address: data.address || prev.address
        }));
      })
      .catch(() => {
        console.log("Using mock profile data");
      });
  }, []);

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <p className="profile-subtitle">Manage your personal information</p>

      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-avatar">A</div>
          <button className="change-photo-btn">Change Photo</button>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={profile.fullName} readOnly />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" value={profile.email} readOnly />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" value={profile.phone} readOnly />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="text" value={profile.dob} readOnly />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input type="text" value={profile.address} readOnly />
            </div>
          </div>

          <button className="update-btn">Update Profile</button>
        </div>
      </div>
    </div>
  );
}