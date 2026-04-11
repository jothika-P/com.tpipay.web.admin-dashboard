import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/mainLayout.css";
import logo from "../assets/logo.png";

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const role = (localStorage.getItem("role") || "").toUpperCase();

  // ✅ MENU BASED ON ROLE
  const menu =
    role === "ADMIN" || role === "LEGALTEAM"
      ? [
          { label: "Users", path: "/users", icon: "👥" },
          { label: "KYC", path: "/kyc", icon: "🛡️" },
          { label: "Analytics", path: "/analytics", icon: "📊" },
        ]
      : role === "RM"
      ? [
          { label: "KYC", path: "/kyc", icon: "🛡️" },
          { label: "Analytics", path: "/analytics", icon: "📊" },
        ]
      : [];

  // ✅ DYNAMIC TITLE
  const getTitle = () => {
    switch (role) {
      case "ADMIN":
        return "Admin Panel";
      case "RM":
        return "RM Dashboard";
      case "LEGALTEAM":
        return "Legal Team Dashboard";
      default:
        return "Dashboard";
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>

        {/* TOP SECTION */}
        <div className="sidebar-top">

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

        {/* BOTTOM SECTION (FIXED LOGOUT 🔥) */}
        <div className="sidebar-bottom">
          <div className="sidebar-link logout" onClick={handleLogout}>
            🚪 Logout
          </div>
        </div>

      </div>

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <h3 className="title">{getTitle()}</h3>

          <div className="profile-container" ref={dropdownRef}>
            <div className="profile" onClick={() => setOpen(!open)}>
              <i className="bi bi-person-circle"></i>
            </div>

            {open && (
              <div className="dropdown">
                <div className="dropdown-item" onClick={() => navigate("/profile")}>
                  View Profile
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">{children}</div>

        {/* FOOTER */}
        <div className="footer">
          © {new Date().getFullYear()} Admin Panel • All Rights Reserved
        </div>

      </div>
    </div>
  );
}