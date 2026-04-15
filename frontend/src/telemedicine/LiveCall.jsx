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
  token, // Added token prop
}) => {
  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    const joinAndPublish = async () => {
      // Ensure we have tracks and a token before joining
      if (!localCameraTrack || !localMicrophoneTrack || !token) return;

      try {
        // Change inside client.join:
        await client.join(
          import.meta.env.VITE_AGORA_APP_ID,
          channelName,
          token,
          null,
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
    // Added token to dependency array
  }, [localCameraTrack, localMicrophoneTrack, channelName, client, token]);

  const toggleMic = () => {
    if (localMicrophoneTrack) localMicrophoneTrack.setEnabled(!micOn);
    setMicOn(!micOn);
  };

  const toggleVideo = () => {
    if (localCameraTrack) localCameraTrack.setEnabled(!videoOn);
    setVideoOn(!videoOn);
  };

  return (
    <div className="call-container" style={{ width: "100%", padding: "20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* Local Video Box */}
        <div
          style={{
            height: "400px",
            border: "2px solid #007bff",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "#000",
            position: "relative",
          }}
        >
          <p
            style={{
              margin: "5px",
              color: "#fff",
              zIndex: 10,
              position: "absolute",
            }}
          >
            You
          </p>
          {localCameraTrack && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <LocalVideoTrack
                track={localCameraTrack}
                play={true}
                videoPlayerConfig={{ fit: "contain" }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
        </div>

        {/* Remote Video Box */}
        <div
          style={{
            height: "400px",
            border: "2px solid #28a745",
            background: "#333",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <p
            style={{
              margin: "5px",
              color: "white",
              zIndex: 10,
              position: "absolute",
            }}
          >
            Other Participant
          </p>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {remoteUsers.map((user) => (
              <RemoteUser
                key={user.uid}
                user={user}
                play={true}
                videoPlayerConfig={{ fit: "contain" }}
                style={{ width: "100%", height: "100%" }}
              />
            ))}
            {remoteUsers.length === 0 && (
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ color: "white" }}>
                  Waiting for other party to join...
                </p>
              </div>
            )}
          </div>
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
