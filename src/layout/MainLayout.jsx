import React from "react";
import { Link } from "react-router-dom";
import "../styles/mainLayout.css";

// ✅ IMPORT LOGO
import logo from "../assets/logo.png";

export default function MainLayout({ children }) {
  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        {/* ✅ LOGO INSTEAD OF TEXT */}
        <div className="logo-box">
          <img src={logo} alt="logo" />
        </div>

    
        <Link to="/users">Users</Link>
        <Link to="/kyc">KYC</Link>
        <Link to="/analytics">Analytics</Link>
      </div>

      {/* MAIN AREA */}
      <div className="main">

        <div className="header">
          <h3>Admin Panel</h3>
          <div className="user">ADMIN</div>
        </div>

        <div className="content">
          {children}
        </div>

      </div>

    </div>
  );
}