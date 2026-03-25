import React from "react";
import { LocalVideoTrack } from "agora-rtc-react";

const WaitingRoom = ({ localCameraTrack, onEnter }) => {
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
        {localCameraTrack && (
          <LocalVideoTrack
            track={localCameraTrack}
            play
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      <button
        onClick={onEnter}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
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
