import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import OtpForm from "../components/OtpForm";
import logo from "../assets/logo.png";
import "../styles/auth.css";

// slider images
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";
import img6 from "../assets/img6.png";

export default function Auth() {
  const [step, setStep] = useState("login");
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  const images = [img1, img2, img3, img4, img5, img6];

  // 🔥 IMAGE SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 STEP ANIMATION TRIGGER
  const handleStepChange = (next) => {
    setAnimate(true);
    setTimeout(() => {
      setStep(next);
      setAnimate(false);
    }, 300); // match CSS duration
  };

  return (
    <div className="container">

      {/* FLOATING SHAPES */}
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="shape shape3"></div>
      <div className="shape shape4"></div>
      <div className="shape shape5"></div>

      <div className="card">

        {/* LEFT SIDE */}
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

          {/* IMAGE SLIDER */}
          <div className="image-wrapper">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`slider ${i}`}
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

        {/* RIGHT SIDE */}
        <div className="right">

          {/* LOGO TOP RIGHT */}
          <div className="right-logo">
            <img src={logo} alt="TPiPay Logo" />
          </div>

          {/* 🔥 FORM WITH ANIMATION */}
          <div className={`auth-box form-animate ${animate ? "fade-out" : "fade-in"}`}>
            {step === "login" && (
              <LoginForm onSuccess={() => handleStepChange("otp")} />
            )}

            {step === "otp" && (
              <OtpForm />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}