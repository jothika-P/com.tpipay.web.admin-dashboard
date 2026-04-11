import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { label: "Users", path: "/users", icon: "👥" },
    { label: "KYC", path: "/kyc", icon: "🛡️" },
    { label: "Analytics", path: "/analytics", icon: "📊" },
  ];

  // LOGOUT FUNCTION
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      sessionStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>

      {/* HEADER */}
      <div className="sidebar-header">
        <img src={logo} alt="logo" />

        <button
          className="close-btn"
          onClick={() => setSidebarOpen(false)}
        >
          ✖
        </button>
      </div>

      {/* MENU */}
      <div className="sidebar-menu">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}   // ✅ FIX ADDED
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;