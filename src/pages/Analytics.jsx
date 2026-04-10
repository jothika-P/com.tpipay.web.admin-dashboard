import React, { useState } from "react";
import "../styles/analytics.css";

/* ================= MOCK DATA ================= */
const data = [
  {
    rm: "Rahul",
    payments: 120000,
    merchants: 120,
    kycPending: 8,
  },
  {
    rm: "Priya",
    payments: 85000,
    merchants: 90,
    kycPending: 5,
  },
  {
    rm: "Amit",
    payments: 150000,
    merchants: 160,
    kycPending: 12,
  },
];

/* ================= COMPONENT ================= */
const Analytics = () => {
  const [selectedRM, setSelectedRM] = useState("All");

  /* ================= FILTER LOGIC ================= */
  const filteredData =
    selectedRM === "All"
      ? data
      : data.filter((item) => item.rm === selectedRM);

  const totalPayments = filteredData.reduce(
    (sum, item) => sum + item.payments,
    0
  );

  const totalMerchants = filteredData.reduce(
    (sum, item) => sum + item.merchants,
    0
  );

  const totalKycPending = filteredData.reduce(
    (sum, item) => sum + item.kycPending,
    0
  );

  const rmList = ["All", ...new Set(data.map((d) => d.rm))];

  return (
    <div className="analytics-container">
      <h2 className="title">Analytics Dashboard</h2>

      {/* ================= RM FILTER ================= */}
      <div className="filter-box">
        <label>Filter by Relationship Manager:</label>

        <select
          value={selectedRM}
          onChange={(e) => setSelectedRM(e.target.value)}
        >
          {rmList.map((rm, i) => (
            <option key={i} value={rm}>
              {rm}
            </option>
          ))}
        </select>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="kpi-grid">

        <div className="kpi-card">
          <h3>Total Payments Processed</h3>
          <p className="value">₹ {totalPayments.toLocaleString()}</p>
          <span className="up">▲ Live</span>
        </div>

        <div className="kpi-card">
          <h3>Total Merchants Onboarded</h3>
          <p className="value">{totalMerchants.toLocaleString()}</p>
          <span className="up">▲ Live</span>
        </div>

        <div className="kpi-card">
          <h3>KYCs Pending Approval</h3>
          <p className="value">{totalKycPending.toLocaleString()}</p>
          <span className="down">▼ Needs Action</span>
        </div>

      </div>
    </div>
  );
};

export default Analytics;