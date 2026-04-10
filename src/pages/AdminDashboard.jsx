import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard">

      <div className="sidebar">
        <h2>Admin</h2>

        <ul>
          
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/merchants">Merchants</Link></li>
          <li><Link to="/admin/kyc">KYC</Link></li>
          <li><Link to="/admin/analytics">Analytics</Link></li>
        </ul>
      </div>

      <div className="main-content">
        <h1>Admin Dashboard</h1>
      </div>

    </div>
  );
};

export default AdminDashboard;