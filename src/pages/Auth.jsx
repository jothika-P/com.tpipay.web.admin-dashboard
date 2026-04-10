import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import OtpForm from "../components/OtpForm";

import logo from "../assets/logo.png";
import "../styles/auth.css";

import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";
import img6 from "../assets/img6.png";

export default function Auth() {
  const [step, setStep] = useState("login");
  const [otpType, setOtpType] = useState(""); 
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  const images = [img1, img2, img3, img4, img5, img6];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStepChange = (next) => {
    setAnimate(true);
    setTimeout(() => {
      setStep(next);
      setAnimate(false);
    }, 300);
  };

  return (
    <div className="container">

      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="shape shape3"></div>
      <div className="shape shape4"></div>
      <div className="shape shape5"></div>

      <div className="card">

        {/* LEFT */}
        <div className="left">
          <div className="badge">🔐 Secure Onboarding Portal</div>

          <h1>
            Create your account with a <br />
            premium fintech onboarding experience
          </h1>

          <p className="desc">
            Secure, fast and modern onboarding for merchants.
          </p>

          <div className="features">
            <p>✔ Easy registration</p>
            <p>✔ Secure login</p>
            <p>✔ Fast approval</p>
            <p>✔ Digital payments</p>
          </div>

          <div className="image-wrapper">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`slider-image ${
                  i === index
                    ? "active"
                    : i === (index - 1 + images.length) % images.length
                    ? "prev"
                    : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">

          <div className="right-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className={`auth-box ${animate ? "fade-out" : "fade-in"}`}>

            {/* LOGIN */}
            {step === "login" && (
              <LoginForm
                onSuccess={() => {
                  setOtpType("LOGIN"); 
                  handleStepChange("otp");
                }}
                onSignup={() => handleStepChange("register")}
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