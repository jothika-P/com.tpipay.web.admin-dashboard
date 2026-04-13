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

    const res = await verifyOtp(finalOtp);

    if (!res?.success) {
      alert("Invalid OTP");
      return;
    }

    const role = (res.role || "").toUpperCase();

    // SAVE AUTH
    localStorage.setItem("token", res.token);
    localStorage.setItem("role", role);

    console.log("LOGIN ROLE:", role);

    // ✅ FIXED ROLE NAVIGATION
    if (role === "ADMIN") {
      navigate("/users", { replace: true });
    } 
    else if (role === "RM") {
      navigate("/kyc", { replace: true });   // 🔥 FIX: RM goes to KYC
    } 
    else if (role === "LEGALTEAM") {
      navigate("/analytics", { replace: true });
    } 
    else {
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