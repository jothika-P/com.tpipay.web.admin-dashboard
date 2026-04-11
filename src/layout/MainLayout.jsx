import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/mainLayout.css";
import logo from "../assets/logo.png";

export default function MainLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const menu = [
    { label: "Users", path: "/users", icon: "👥" },
    { label: "KYC", path: "/kyc", icon: "🛡️" },
    { label: "Analytics", path: "/analytics", icon: "📊" },
  ];

  // close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        
        {/* CLOSE BUTTON */}
        <div className="sidebar-header">
          <img src={logo} alt="logo" />
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            ✖
          </button>
        </div>

        <div className="sidebar-menu">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* HEADER */}
        <div className="header">
          {/* MENU BUTTON */}
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <h3 className="title">Admin Panel</h3>

          {/* PROFILE */}
          <div className="profile-container" ref={dropdownRef}>
            <div className="profile" onClick={() => setOpen(!open)}>
              <i className="bi bi-person-circle"></i>
            </div>

            {open && (
              <div className="dropdown">
                <div className="dropdown-item">View Profile</div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout">Logout</div>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">{children}</div>
      </div>
    </div>
  );
}