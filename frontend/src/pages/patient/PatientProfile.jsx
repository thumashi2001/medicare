import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./patientProfile.css";

const getTokenData = () => {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { name: payload.name || "", email: payload.email || "" };
  } catch {
    return { name: "", email: "" };
  }
};

export default function PatientProfile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    profileImage: "",
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/patients/profile");
        const data = res.data || {};

        const formattedProfile = {
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob || "",
          address: data.address || "",
          profileImage: data.profileImage || "",
        };

        setProfile(formattedProfile);
        setOriginalProfile(formattedProfile);
        setProfileExists(true);

        if (data.fullName) {
          localStorage.setItem("name", data.fullName);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // No profile yet — pre-fill from JWT and let user create one
          const tokenData = getTokenData();
          const empty = {
            fullName: tokenData.name,
            email: tokenData.email,
            phone: "",
            dob: "",
            address: "",
            profileImage: "",
          };
          setProfile(empty);
          setOriginalProfile(empty);
          setProfileExists(false);
          setIsEditing(true);
          setMessage("Complete your profile below to get started.");
        } else {
          console.error("Profile fetch error:", error);
          setMessage("Could not connect to the server. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalProfile) setProfile(originalProfile);
    setMessage("");
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setMessage("");

      const body = {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        dob: profile.dob,
        address: profile.address,
      };

      let res;
      if (profileExists) {
        res = await API.put("/patients/profile", body);
      } else {
        res = await API.post("/patients/profile", body);
        setProfileExists(true);
      }

      setOriginalProfile({ ...profile });
      setMessage(res.data.message || "Profile saved successfully.");
      localStorage.setItem("name", profile.fullName);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile save error:", error);
      setMessage(error.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      setMessage("");

      const formData = new FormData();
      formData.append("photo", file);

      const res = await API.put("/patients/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedProfile = { ...profile, profileImage: res.data.profileImage };
      setProfile(updatedProfile);
      setOriginalProfile((prev) => ({ ...prev, profileImage: res.data.profileImage }));
      setMessage(res.data.message || "Profile photo updated successfully.");
    } catch (error) {
      console.error("Photo upload error:", error);
      setMessage("Failed to upload profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getProfileImageUrl = () => {
    if (!profile.profileImage) return "";
    const normalizedPath = profile.profileImage.replaceAll("\\", "/");
    const cleanPath = normalizedPath.replace(/^uploads\//, "");
    return `http://localhost:5002/uploads/${cleanPath}`;
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
            {profile.profileImage ? (
              <img
                src={getProfileImageUrl()}
                alt="Profile"
                className="profile-avatar-image"
              />
            ) : (
              profile.fullName?.charAt(0)?.toUpperCase() || "P"
            )}
          </div>

          <label className="change-photo-btn">
            {uploadingPhoto ? "Uploading..." : "Change Photo"}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
          </label>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
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
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="update-btn" type="button" onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="update-btn"
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                {profileExists && (
                  <button
                    className="cancel-btn"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
