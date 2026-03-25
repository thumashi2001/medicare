import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgoraRTC, { 
  AgoraRTCProvider, 
  useLocalCameraTrack, 
  useLocalMicrophoneTrack 
} from "agora-rtc-react";

// Import your sub-components
import WaitingRoom from "./WaitingRoom";
import LiveCall from "./LiveCall";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const TelemedicineSession = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [inCall, setInCall] = useState(false);

  // Initialize hardware tracks once at the session level
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Consultation Session: {appointmentId}</h1>

      {!inCall ? (
        /* The "Hallway" where we prepare */
        <WaitingRoom 
          localCameraTrack={localCameraTrack} 
          onEnter={() => setInCall(true)} 
        />
      ) : (
        /* The "Office" where we are live */
        <AgoraRTCProvider client={client}>
          <LiveCall
            channelName={appointmentId}
            onLeave={() => navigate("/appointments")}
            localCameraTrack={localCameraTrack}
          />
        </AgoraRTCProvider>
      )}
    </div>
  );
};

export default TelemedicineSession;