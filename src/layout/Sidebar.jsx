import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">

      <div className="logo">LOGO</div>

      <Link to="/">Dashboard</Link>
      <Link to="/users">Users</Link>
      <Link to="/kyc">KYC</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/Logout">Logout</Link>

    </div>
  );
};

export default Sidebar;