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
  return (
    <div className="waiting-room">
      <h3>Step B: Waiting Room</h3>
      <p>Check your camera and microphone below.</p>

      <div
        style={{
          width: "400px",
          height: "300px",
          background: "#000",
          margin: "20px auto",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Only show video if videoOn is true */}
        {localCameraTrack && videoOn ? (
          <LocalVideoTrack
            track={localCameraTrack}
            play
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ color: "white", paddingTop: "130px" }}>
            Camera is Off
          </div>
        )}
      </div>

      {/* --- ADD THESE BUTTONS --- */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button onClick={() => setMicOn(!micOn)} style={{ padding: "10px" }}>
          {micOn ? "🎤 Mic On" : "🔇 Mic Off"}
        </button>
        <button
          onClick={() => setVideoOn(!videoOn)}
          style={{ padding: "10px" }}
        >
          {videoOn ? "📷 Video On" : "🎥 Video Off"}
        </button>
      </div>

      <button
        onClick={onEnter}
        style={{
          padding: "15px 30px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Enter Consultation
      </button>
    </div>
  );
};

export default WaitingRoom;
