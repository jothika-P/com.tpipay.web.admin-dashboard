import React from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">

      <h2 className="title">Analytics Dashboard</h2>

      {/* KPI CARDS */}
      <div className="kpi-grid">

        <div className="kpi-card blue">
          <p className="label">Total Merchants</p>
          <h1 className="value">1,245</h1>
          <span className="trend">▲ +8.2% this month</span>
        </div>

        <div className="kpi-card green">
          <p className="label">Active Users</p>
          <h1 className="value">8,760</h1>
          <span className="trend">▲ +5.1% growth</span>
        </div>

        <div className="kpi-card purple">
          <p className="label">Total Payments</p>
          <h1 className="value">₹58.2L</h1>
          <span className="trend">▲ +12.7% volume</span>
        </div>

      </div>

     


    </div>
  );
};

export default Dashboard;