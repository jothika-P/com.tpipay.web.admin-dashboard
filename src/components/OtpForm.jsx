import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService";

const OtpForm = () => {
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

    if (newOtp.every((d) => d !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleSubmit = async (otpValue) => {
    const finalOtp = otpValue || otp.join("");

    if (finalOtp.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    const res = await verifyOtp(finalOtp);

    if (res.success) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);

     if (res.role === "ADMIN") {
  navigate("/dashboard", { replace: true });
} else if (res.role === "RM") {
  navigate("/kyc", { replace: true });
} else if (res.role === "LEGALTEAM") {
  navigate("/analytics", { replace: true });
}
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <>
      <h2>Enter OTP</h2>

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

      <button onClick={() => handleSubmit()}>Verify</button>
    </>
  );
};

export default OtpForm;