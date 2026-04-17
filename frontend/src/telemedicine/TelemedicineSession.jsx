import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgoraRTC, {
  AgoraRTCProvider,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
} from "agora-rtc-react";

// Import sub-components
import WaitingRoom from "./WaitingRoom";
import LiveCall from "./LiveCall";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const TelemedicineSession = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [inCall, setInCall] = useState(false);
  const [token, setToken] = useState(null); // Added state for token

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // Initialize hardware tracks once at the session level
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();

  // Added: Fetch token from backend
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/agora/get-token?channelName=${appointmentId}`,
        );
        const data = await response.json();

        // Look at your console for this log specifically:
        console.log("FULL DATA OBJECT:", data);

        // Check for common keys used in Agora token servers
        const tokenValue = data.rtcToken || data.token || data.data?.token;

        if (tokenValue) {
          console.log("Token successfully found:", tokenValue);
          setToken(tokenValue);
        } else {
          console.error(
            "Token key not found in response. Check your backend structure.",
          );
        }
      } catch (err) {
        console.error("Failed to fetch secure token:", err);
      }
    };

    if (appointmentId) fetchToken();
  }, [appointmentId]);

  return (
    <AgoraRTCProvider client={client}>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Consultation Session: {appointmentId}</h1>

        {!inCall ? (
          <WaitingRoom
            localCameraTrack={localCameraTrack}
            micOn={micOn}
            setMicOn={setMicOn}
            videoOn={videoOn}
            setVideoOn={setVideoOn}
            onEnter={() => setInCall(true)}
          />
        ) : /* Added: Only render LiveCall if token is ready */
        token ? (
          <LiveCall
            channelName={appointmentId}
            onLeave={() => navigate("/telemedicine")}
            localCameraTrack={localCameraTrack}
            localMicrophoneTrack={localMicrophoneTrack}
            micOn={micOn}
            setMicOn={setMicOn}
            videoOn={videoOn}
            setVideoOn={setVideoOn}
            client={client}
            token={token}
          />
        ) : (
          <div>Connecting to secure server...</div>
        )}
      </div>
    </AgoraRTCProvider>
  );
};

export default TelemedicineSession;
