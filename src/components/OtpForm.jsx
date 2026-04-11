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

    // store login info
    localStorage.setItem("token", res.token);
    localStorage.setItem("role", role);

    // ✅ ROLE BASED NAVIGATION (FIXED)
    switch (role) {
      case "ADMIN":
        navigate("/dashboard", { replace: true });
        break;

      case "RM":
        navigate("/rm", { replace: true });
        break;

      case "LEGALTEAM":
        navigate("/analytics", { replace: true });
        break;

      default:
        navigate("/");
    }
  };

  return (
    <>
      <h2>{otpType === "REGISTER" ? "Register OTP" : "Login OTP"}</h2>

      <div className="otp-container">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
          />
        ))}
      </div>

      <button onClick={handleSubmit}>Verify</button>
    </>
  );
};

export default OtpForm;