import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Menu, Bell, X, Shield, Activity, Users, LogOut, Building2, Handshake, Ticket } from "lucide-react";
import logo from "../assets/logo.png";

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const dropdownRef = useRef();

  const role = (localStorage.getItem("role") || "").toUpperCase();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userData.name || "System User";

  const isAdmin = role === "ADMIN";
  const isRM = role === "RELATIONSHIP_MANAGER";
  const isPartner = role === "PARTNER";
  const isLegal = role === "LEGAL_TEAM";
  const isBackendAgent = role === "BACKEND_AGENT";

  /* ================= MENU ================= */
  const menu =
    isAdmin
      ? [
        { label: "Dashboard", path: "/analytics", icon: <Activity size={20} /> },
        { label: "Merchants", path: "/merchants", icon: <Building2 size={20} /> },
        { label: "Partners", path: "/partners", icon: <Handshake size={20} /> },
        { label: "Users", path: "/users", icon: <Users size={20} /> },
        { label: "KYC Portal", path: "/kyc", icon: <Shield size={20} /> },
      ]
      : (isRM || isPartner)
        ? [
          { label: "Dashboard", path: "/analytics", icon: <Activity size={20} /> },
          { label: "Merchants", path: "/merchants", icon: <Building2 size={20} /> },
          { label: "KYC Portal", path: "/kyc", icon: <Shield size={20} /> }
        ]
        : isLegal
          ? [
            { label: "Dashboard", path: "/analytics", icon: <Activity size={20} /> },
            { label: "KYC Portal", path: "/kyc", icon: <Shield size={20} /> },
          ]
          : isBackendAgent
            ? [
              { label: "Merchants", path: "/merchants", icon: <Building2 size={20} /> },
              { label: "KYC Portal", path: "/kyc", icon: <Shield size={20} /> },
            ]
            : [];

  const getTitle = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isRM) return "RM Dashboard";
    if (isPartner) return "Partner Dashboard";
    if (isLegal) return "Legal Dashboard";
    if (isBackendAgent) return "Agent Dashboard";
    return "Dashboard";
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
    <div className="dash-layout">
      {/* SIDEBAR */}
      <aside className={`dash-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="dash-sidebar-header">
          <img src={logo} alt="logo" className="main-logo" />
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="dash-menu">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`dash-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-text">{item.label}</span>
            </Link>
          ))}

          <div style={{ marginTop: "auto", paddingBottom: "20px" }}>
            {isPartner && (
              <div style={{ padding: '0 12px 16px' }}>
                <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Referral Code</label>
                <div style={{ position: 'relative' }}>
                  <Ticket size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input 
                    type="text" 
                    readOnly
                    placeholder="Partner Code"
                    value={referralCode || userData?.referralCode || "PART-7721"}
                    style={{ 
                      width: '100%', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--glass-border)', 
                      borderRadius: '8px', 
                      padding: '8px 8px 8px 32px', 
                      fontSize: '12px',
                      color: 'var(--primary)',
                      fontWeight: 'bold',
                      cursor: 'default'
                    }}
                  />
                </div>
              </div>
            )}
            
            <button className="dash-link logout-btn" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none' }}>
              <LogOut size={20} />
              <span className="link-text">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        {/* HEADER */}
        <header className="dash-header">
          <div className="header-left">
            {!sidebarOpen && (
              <button className="icon-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
              </button>
            )}
            <h3 className="dashboard-title">{getTitle()}</h3>
          </div>

          <div className="header-right">
            <button className="icon-btn notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <div className="user-profile-trigger" onClick={() => setOpen(!open)}>
                <div className="user-info-text">
                  <p className="user-name">{userName}</p>
                  <p className="user-role">{role}</p>
                </div>
                <div className="user-avatar-small">
                  <User size={18} />
                </div>
              </div>

              {open && (
                <div className="premium-dropdown">
                  <div className="dropdown-item">Profile Settings</div>
                  <div className="dropdown-item">Security</div>
                  <div className="dropdown-item danger" onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="layout-wrapper">
          <div className="layout-content">
            {children}
          </div>

          <footer className="footer">
            <div className="footer-container">
              <div className="footer-left">
                <h4 className="footer-logo">tpipay</h4>
                <p>Trusted fintech infrastructure.</p>
              </div>
              <div className="footer-center">
                <p>&copy; {new Date().getFullYear()} tpipay Inc.</p>
              </div>
              <div className="footer-right">
                <span className="iso-badge">ISO 27001 Certified</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}