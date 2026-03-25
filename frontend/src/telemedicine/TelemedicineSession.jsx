import React, { useState } from "react";
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

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // Initialize hardware tracks once at the session level
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();

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
        ) : (
          <LiveCall
            channelName={appointmentId}
            onLeave={() => navigate("/appointments")}
            localCameraTrack={localCameraTrack}
            localMicrophoneTrack={localMicrophoneTrack}
            micOn={micOn}
            setMicOn={setMicOn}
            videoOn={videoOn}
            setVideoOn={setVideoOn}
            client={client}
          />
        )}
      </div>
    </AgoraRTCProvider>
  );
};

export default TelemedicineSession;
