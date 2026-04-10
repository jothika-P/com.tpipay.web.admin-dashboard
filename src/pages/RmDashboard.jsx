import "../styles/Dashboard.css";

const RmDashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>RM</h2>
        <ul>
          <li>My Merchants</li>
          <li>KYC Status</li>
        </ul>
      </div>

      <div className="main-content">
        <h1>RM Dashboard</h1>
      </div>
    </div>
  );
};

export default RmDashboard;