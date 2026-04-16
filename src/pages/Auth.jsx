import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import OtpForm from "../components/OtpForm";
import RegisterForm from "../components/RegisterForm";

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

  const headerTitle = () => {
    if (step === "login") return "Sign In";
    if (step === "register") return "Create Account";
    if (step === "otp") return "Verification";
    return "";
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
          <div className="badge">🔐 Trusted &amp; Secure Fintech Platform</div>

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
            
            {/* COMMON HEADER */}
            <div className="auth-header">
               <img src={logo} alt="logo" className="auth-logo" />
               <h2>{headerTitle()}</h2>
            </div>

            {/* LOGIN */}
            {step === "login" && (
              <LoginForm
                onSuccess={() => {
                  setOtpType("LOGIN"); 
                  handleStepChange("otp");
                }}
                onSignup={() => handleStepChange("register")}
                hideTitle={true}
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
                hideTitle={true}
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