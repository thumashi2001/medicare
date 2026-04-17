import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/500x125-text-tp.png";

const SIMULATION_DURATION = 3500; // ms

export default function PaymentPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / SIMULATION_DURATION) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setDone(true);
        setTimeout(() => navigate("/patient/appointments"), 600);
      }
    };

    requestAnimationFrame(tick);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <img src={logo} alt="Medicare" className="h-14 mb-12 opacity-90" />

      {/* Message */}
      <p className="text-gray-400 text-sm text-center mb-8 max-w-xs leading-relaxed">
        Frontend component is missing, so simulating a payment
      </p>

      {/* Loading bar */}
      <div className="w-72 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-none"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #4ade80, #16a34a)",
          }}
        />
      </div>

      {/* Done label */}
      {done && (
        <p className="mt-4 text-xs text-green-600 font-medium">Redirecting...</p>
      )}
    </div>
  );
}
