import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService";

const OtpForm = ({ otpType, goToLogin }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      alert("Enter valid 6 digit OTP");
      return;
    }

    if (otpType === "REGISTER") {
      alert("Registration Successful");
      goToLogin();
      return;
    }

    // ✅ GET sessionId
    const sessionId = localStorage.getItem("sessionId");

    const res = await verifyOtp(sessionId, finalOtp);

    if (!res?.success) {
      alert(res.error || "Invalid OTP");
      return;
    }

    console.log("LOGIN SUCCESS!");

    // ✅ STORE TOKEN + USER
    sessionStorage.setItem("token", res.token);
    sessionStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("role", res.user.role);

    const role = res.user.role;
    console.log("LOGIN SUCCESS! Navigating based on role:", role);

    if (role === "ADMIN") {
      navigate("/analytics", { replace: true });
    } else if (role === "RELATIONSHIP_MANAGER") {
      navigate("/kyc", { replace: true });
    } else if (role === "LEGAL_TEAM") {
      navigate("/kyc", { replace: true }); // or analytics if preferred
    } else if (role === "BACKEND_AGENT") {
      navigate("/kyc", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="otp-wrapper">
      <h2>{otpType === "REGISTER" ? "Register OTP" : "Login OTP"}</h2>

      <div className="otp-container">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="otp-box"
          />
        ))}
      </div>

      <button className="otp-btn" onClick={handleSubmit}>
        Verify OTP
      </button>
    </div>
  );
};

export default OtpForm;
