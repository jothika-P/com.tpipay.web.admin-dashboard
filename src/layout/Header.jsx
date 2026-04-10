import { useState, useRef, useEffect } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    alert("Logged out!");
    // later: clear token + redirect
  };

  return (
    <div className="header">

      <h2>ADMIN DASHBOARD</h2>

      {/* PROFILE */}
      <div className="profile-container" ref={dropdownRef}>
        <div className="profile" onClick={() => setOpen(!open)}>
          <i className="bi bi-person-circle"></i>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="dropdown">
            <div className="dropdown-item">
              <i className="bi bi-person"></i> View Profile
            </div>

            <div className="dropdown-item" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Header;