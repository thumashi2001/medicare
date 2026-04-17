import React, { useEffect } from "react";
import { useRemoteUsers, RemoteUser, LocalVideoTrack } from "agora-rtc-react";

const LiveCall = ({
  channelName,
  onLeave,
  localCameraTrack,
  localMicrophoneTrack,
  micOn,
  setMicOn,
  videoOn,
  setVideoOn,
  client,
  token,
}) => {
  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    const joinAndPublish = async () => {
      if (!localCameraTrack || !localMicrophoneTrack || !token) return;

      try {
        await client.join(
          import.meta.env.VITE_AGORA_APP_ID,
          channelName,
          token,
          null
        );
        localCameraTrack.setEnabled(videoOn);
        localMicrophoneTrack.setEnabled(micOn);

        await client.publish([localCameraTrack, localMicrophoneTrack]);
      } catch (err) {
        console.error("Failed to join/publish:", err);
      }
    };

    joinAndPublish();

    return () => {
      const leaveChannel = async () => {
        await client.unpublish([localCameraTrack, localMicrophoneTrack]);
        await client.leave();
        if (localCameraTrack) {
          localCameraTrack.stop();
          localCameraTrack.close();
        }
        if (localMicrophoneTrack) {
          localMicrophoneTrack.stop();
          localMicrophoneTrack.close();
        }
      };
      leaveChannel();
    };
  }, [localCameraTrack, localMicrophoneTrack, channelName, client, token]);

  const toggleMic = () => {
    if (localMicrophoneTrack) localMicrophoneTrack.setEnabled(!micOn);
    setMicOn(!micOn);
  };

  const toggleVideo = () => {
    if (localCameraTrack) localCameraTrack.setEnabled(!videoOn);
    setVideoOn(!videoOn);
  };

  // Shared styling for video boxes
  const videoBoxStyle = {
    height: "450px",
    borderRadius: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background: "#1A252F", // Darker slate to match theme
    position: "relative",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    border: "1px solid #E0E0E0",
  };

  const labelStyle = {
    margin: "15px",
    color: "#fff",
    zIndex: 10,
    position: "absolute",
    background: "rgba(0,0,0,0.5)",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  return (
    <div className="call-container" style={{ width: "100%", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          width: "100%",
        }}
      >
        {/* Local Video Box */}
        <div style={videoBoxStyle}>
          <p style={labelStyle}>You (Local)</p>
          {localCameraTrack && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
              <LocalVideoTrack
                track={localCameraTrack}
                play={true}
                videoPlayerConfig={{ fit: "cover" }} // "cover" looks more modern for medical calls
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
        </div>

        {/* Remote Video Box */}
        <div style={{ ...videoBoxStyle, border: "2px solid #2ECC71" }}>
          <p style={labelStyle}>Patient/Doctor (Live)</p>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            {remoteUsers.map((user) => (
              <RemoteUser
                key={user.uid}
                user={user}
                play={true}
                videoPlayerConfig={{ fit: "cover" }}
                style={{ width: "100%", height: "100%" }}
              />
            ))}
            {remoteUsers.length === 0 && (
              <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                <p style={{ color: "#bdc3c7", fontSize: "14px" }}>
                  <span style={{ display: "block", fontSize: "24px", marginBottom: "10px" }}>⌛</span>
                  Waiting for the other participant to join...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          padding: "20px",
          background: "#fff",
          borderRadius: "50px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          width: "fit-content",
          margin: "40px auto 0 auto",
        }}
      >
        <button 
          onClick={toggleMic} 
          style={{ 
            padding: "12px 25px", 
            borderRadius: "30px", 
            border: "none", 
            cursor: "pointer",
            fontWeight: "bold",
            background: micOn ? "#F5F7FA" : "#E74C3C",
            color: micOn ? "#2C3E50" : "#fff",
            transition: "all 0.3s ease"
          }}
        >
          {micOn ? "🎤 Mute" : "🔇 Unmute"}
        </button>

        <button 
          onClick={toggleVideo} 
          style={{ 
            padding: "12px 25px", 
            borderRadius: "30px", 
            border: "none", 
            cursor: "pointer",
            fontWeight: "bold",
            background: videoOn ? "#F5F7FA" : "#E74C3C",
            color: videoOn ? "#2C3E50" : "#fff",
            transition: "all 0.3s ease"
          }}
        >
          {videoOn ? "📷 Stop Video" : "🎥 Start Video"}
        </button>

        <button
          onClick={onLeave}
          style={{ 
            padding: "12px 35px", 
            background: "#E74C3C", 
            color: "#fff", 
            border: "none", 
            borderRadius: "30px", 
            fontWeight: "bold", 
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(231, 76, 60, 0.3)"
          }}
        >
          End Consultation
        </button>
      </div>
    </div>
  );
};

export default LiveCall;