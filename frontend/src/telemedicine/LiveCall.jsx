import React, { useEffect } from "react";
import {
  useJoin,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from "agora-rtc-react";

const LiveCall = ({
  channelName,
  onLeave,
  localCameraTrack,
  localMicrophoneTrack,
  micOn,
  setMicOn,
  videoOn,
  setVideoOn,
  client, // client passed from parent
}) => {
  const remoteUsers = useRemoteUsers();

  // JOIN THE CHANNEL
  useJoin({
    appid: "7fdb2f9971a44340b66e10f9712e9493",
    channel: channelName,
    token: null,
  });

  // Enable local tracks and publish them AFTER client joins
  useEffect(() => {
    const setupTracks = async () => {
      if (!localCameraTrack || !localMicrophoneTrack) return;

      const onJoined = async () => {
        try {
          localCameraTrack.setEnabled(videoOn);
          localMicrophoneTrack.setEnabled(micOn);
          await client.publish([localCameraTrack, localMicrophoneTrack]);
          console.log("Tracks published successfully");
        } catch (err) {
          console.error("Failed to publish tracks:", err);
        }
      };

      // Listen for client connection state change
      client.on("connection-state-change", (curState) => {
        if (curState === "CONNECTED") {
          onJoined();
        }
      });
    };

    setupTracks();
  }, [localCameraTrack, localMicrophoneTrack, client, micOn, videoOn]);

  const toggleMic = () => {
    if (localMicrophoneTrack) localMicrophoneTrack.setEnabled(!micOn);
    setMicOn(!micOn);
  };

  const toggleVideo = () => {
    if (localCameraTrack) localCameraTrack.setEnabled(!videoOn);
    setVideoOn(!videoOn);
  };

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
            play={true}
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
              play={true}
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

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button onClick={toggleMic} style={{ padding: "10px 20px" }}>
          {micOn ? "🎤 Mute" : "🔇 Unmute"}
        </button>
        <button onClick={toggleVideo} style={{ padding: "10px 20px" }}>
          {videoOn ? "📷 Stop Video" : "🎥 Start Video"}
        </button>
        <button
          onClick={onLeave}
          style={{ padding: "10px 20px", background: "#dc3545", color: "#fff" }}
        >
          Leave Call
        </button>
      </div>
    </div>
  );
};

export default LiveCall;
