import React from "react";
import {
  useJoin,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from "agora-rtc-react";

const LiveCall = ({ channelName, onLeave, localCameraTrack }) => {
  const remoteUsers = useRemoteUsers();

  // JOIN THE CHANNEL
  useJoin({
    appid: "7fdb2f9971a44340b66e10f9712e9493",
    channel: channelName,
    token: null,
  });

  return (
    <div className="call-container">
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Local Video Box */}
        <div
          style={{
            height: "400px",
            border: "2px solid #007bff",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <p style={{ margin: "5px" }}>You</p>
          <LocalVideoTrack
            track={localCameraTrack}
            play
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Remote Video Box */}
        <div
          style={{
            height: "400px",
            border: "2px solid #28a745",
            background: "#333",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <p style={{ margin: "5px", color: "white" }}>Other Participant</p>
          {remoteUsers.map((user) => (
            <RemoteUser
              key={user.uid}
              user={user}
              play
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ))}
          {remoteUsers.length === 0 && (
            <p style={{ color: "white", marginTop: "150px" }}>
              Waiting for other party to join...
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onLeave}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Leave Consultation
      </button>
    </div>
  );
};

export default LiveCall;
