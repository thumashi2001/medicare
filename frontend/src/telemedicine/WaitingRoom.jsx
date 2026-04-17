import React from "react";
import { LocalVideoTrack } from "agora-rtc-react";

const WaitingRoom = ({
  localCameraTrack,
  onEnter,
  micOn,
  setMicOn,
  videoOn,
  setVideoOn,
}) => {
  // Theme Colors
  const colors = {
    primary: "#2C3E50", // Dark Slate
    accent: "#2ECC71",  // Smart Green
    warning: "#E74C3C", // Red
    background: "#F5F7FA", // Light Grey
  };

  return (
    <div 
      className="waiting-room" 
      style={{ 
        padding: "40px", 
        background: "#fff", 
        borderRadius: "30px", 
        boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
        maxWidth: "600px",
        margin: "20px auto",
        textAlign: "center",
        border: "1px solid #E0E0E0"
      }}
    >
      <h2 style={{ color: colors.primary, marginBottom: "10px" }}>Pre-Call Check</h2>
      <p style={{ color: "#7F8C8D", marginBottom: "30px" }}>
        Ensure your hardware is working correctly before entering the consultation.
      </p>

      {/* Video Preview Box */}
      <div
        style={{
          width: "100%",
          height: "350px",
          background: "#1A252F",
          margin: "0 auto 30px auto",
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset 0 0 50px rgba(0,0,0,0.5)",
          border: "4px solid #F5F7FA"
        }}
      >
        {localCameraTrack && videoOn ? (
          <LocalVideoTrack
            track={localCameraTrack}
            play
            style={{ width: "100%", height: "100%" }}
            videoPlayerConfig={{ fit: "cover" }}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "50px", display: "block", marginBottom: "10px" }}>📷</span>
            <p style={{ color: "#BDC3C7", fontWeight: "bold", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>
              Camera is currently disabled
            </p>
          </div>
        )}
      </div>

      {/* Device Toggles */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <button 
          onClick={() => setMicOn(!micOn)} 
          style={{ 
            padding: "12px 25px", 
            borderRadius: "30px", 
            border: "none", 
            cursor: "pointer",
            fontWeight: "bold",
            background: micOn ? colors.background : colors.warning,
            color: micOn ? colors.primary : "#fff",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {micOn ? "🎤 Mic is On" : "🔇 Mic is Off"}
        </button>

        <button
          onClick={() => setVideoOn(!videoOn)}
          style={{ 
            padding: "12px 25px", 
            borderRadius: "30px", 
            border: "none", 
            cursor: "pointer",
            fontWeight: "bold",
            background: videoOn ? colors.background : colors.warning,
            color: videoOn ? colors.primary : "#fff",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {videoOn ? "📷 Video is On" : "🎥 Video is Off"}
        </button>
      </div>

      {/* Action Button */}
      <button
        onClick={onEnter}
        style={{
          width: "100%",
          padding: "18px",
          background: colors.accent,
          color: "#fff",
          border: "none",
          borderRadius: "15px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          transition: "transform 0.2s ease, background 0.2s ease",
          boxShadow: "0 6px 20px rgba(46, 204, 113, 0.3)"
        }}
        onMouseOver={(e) => e.target.style.background = "#27AE60"}
        onMouseOut={(e) => e.target.style.background = "#2ECC71"}
      >
        Enter Consultation Session
      </button>

      <p style={{ marginTop: "20px", fontSize: "12px", color: "#BDC3C7", fontWeight: "bold", textTransform: "uppercase" }}>
        🔒 Secure & Encrypted Connection
      </p>
    </div>
  );
};

export default WaitingRoom;