import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import OtpForm from "../components/OtpForm";

import logo from "../assets/logo.png";
import "../styles/auth.css";

export default function Auth() {
  const [step, setStep] = useState("login");
  const [otpType, setOtpType] = useState(""); 
  const [animate, setAnimate] = useState(false);

  const handleStepChange = (next) => {
    setAnimate(true);
    setTimeout(() => {
      setStep(next);
      setAnimate(false);
    }, 300);
  };

  return (
    <div className="auth-bg-container">

      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="shape shape3"></div>
      <div className="shape shape4"></div>
      <div className="shape shape5"></div>

      <div className="card">

        {/* LEFT PANEL */}
        <div className="left">
          <div className="badge">🔐 Trusted & Secure Fintech Platform</div>

          <h1>
            Power your business with smarter payments
          </h1>

          <p className="desc">
            Fast, secure, and reliable solutions to manage transactions, onboard merchants, and scale effortlessly
          </p>

          <div className="features">
            <p>✔ Instant onboarding</p>
            <p>✔ Bank-grade security</p>
            <p>✔ Real-time transactions</p>
            <p>✔ Seamless payment experience</p>
          </div>
        </div>

        {/* RIGHT PANEL - CONTENT ONLY */}
        <div className="right">
          
          <div className={`auth-box ${animate ? "fade-out" : "fade-in"}`}>
            
            {/* COMMON HEADER FOR BOTH LOGIN & REGISTER */}
            <div className="auth-header">
               <img src={logo} alt="logo" className="auth-logo" />
               <h2>
                 {step === "login" && "Sign In"}
                 {step === "register" && "Create Account"}
                 {step === "otp" && "Verification"}
               </h2>
            </div>

            {/* LOGIN */}
            {step === "login" && (
              <LoginForm
                onSuccess={() => {
                  setOtpType("LOGIN"); 
                  handleStepChange("otp");
                }}
                onSignup={() => handleStepChange("register")}
                hideTitle={true} /* PASS PROP TO HIDE INTERNAL H2 */
              />
            )}

            {/* REGISTER */}
            {step === "register" && (
              <RegisterForm
                onSuccess={() => {
                  setOtpType("REGISTER"); 
                  handleStepChange("otp");
                }}
                onBack={() => handleStepChange("login")}
                hideTitle={true} /* PASS PROP TO HIDE INTERNAL H2 */
              />
            )}

            {/* OTP */}
            {step === "otp" && (
              <OtpForm
                otpType={otpType} 
                goToLogin={() => handleStepChange("login")} 
              />
            )}

          </div>
        </div>

      </div>
    </div>
  );
}