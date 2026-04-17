import { useEffect, useState } from "react";
import API from "../../api/axios";

const getNameFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.name || "Patient";
  } catch {
    return localStorage.getItem("name") || "Patient";
  }
};

export default function PatientHeader() {
  const [name, setName] = useState(getNameFromToken);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const res = await API.get("/patients/profile");
        const data = res.data || {};

        if (data.fullName) {
          setName(data.fullName);
          localStorage.setItem("name", data.fullName);
        }

        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
      } catch {
        // silently fall back to JWT name
      }
    };

    fetchHeaderData();
  }, []);

  const getProfileImageUrl = () => {
    if (!profileImage) return "";
    const normalizedPath = profileImage.replaceAll("\\", "/");
    const cleanPath = normalizedPath.replace(/^uploads\//, "");
    return `http://localhost:5002/uploads/${cleanPath}`;
  };

  return (
    <header className="patient-header">
      <div>
        <h3>{name}</h3>
        <span>Patient</span>
      </div>

      <div className="patient-avatar">
        {profileImage ? (
          <img
            src={getProfileImageUrl()}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
    </header>
  );
}
