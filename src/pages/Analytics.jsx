import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Wallet, Users, AlertTriangle, ArrowUpRight, ArrowDownRight
} from "lucide-react";

import {
  getOverallAnalytics,
  getMerchantSummary,
  getMerchantPayments,
  getRMSummary,
  searchUsers
} from "../services/analyticsService";

export default function Analytics() {

  const role = (localStorage.getItem("role") || "").toUpperCase();

  /* ================= STATES ================= */
  const [overall, setOverall] = useState({});
  const [chartData, setChartData] = useState([]);
  const [users, setUsers] = useState([]);

  // filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, []);

  /* ================= FETCH ANALYTICS ================= */
  const fetchAnalytics = async () => {
    try {
      const res = await getOverallAnalytics();

      setOverall(res.data);

      // convert backend → chart format
      const mockChart = [
        { name: "Mon", volume: res.data.totalAmount / 7 },
        { name: "Tue", volume: res.data.totalAmount / 6 },
        { name: "Wed", volume: res.data.totalAmount / 5 },
        { name: "Thu", volume: res.data.totalAmount / 4 },
        { name: "Fri", volume: res.data.totalAmount / 3 },
        { name: "Sat", volume: res.data.totalAmount / 2 },
        { name: "Sun", volume: res.data.totalAmount },
      ];

      setChartData(mockChart);

    } catch (err) {
      console.error("Analytics error", err);
    }
  };

  /* ================= FETCH USERS (FILTER API) ================= */
  const fetchUsers = async () => {
    try {
      const payload = {
        query: search,
        filters: roleFilter !== "all"
          ? [{ key: "role", value: roleFilter, operator: "=" }]
          : [],
        limit: 50,
        offset: 0,
      };

      const res = await searchUsers(payload);

      setUsers(res.data || []);

    } catch (err) {
      console.error("User search error", err);
    }
  };

  /* ================= FILTER TRIGGER ================= */
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, roleFilter]);

  return (
    <div className="dash-content animate-fade-in">

      <div className="page-header">
        <div>
          <h1 className="dash-title">Platform Overview</h1>
          <p className="dash-subtitle">
            Real-time metrics and financial analytics overview.
          </p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="users-filters">
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="RELATIONSHIP_MANAGER">RM</option>
          <option value="BACKEND_AGENT">BACKEND</option>
          <option value="LEGAL_TEAM">LEGAL</option>
        </select>
      </div>

      {/* ================= KPI ================= */}
      <div className="metrics-grid">

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon icon-cyan">
              <Wallet size={20} />
            </div>
            <p className="kpi-label">Total Volume</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">
              ₹{overall?.totalAmount || 0}
            </h3>
            <span className="trend positive">
              <ArrowUpRight size={14} /> Live
            </span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon icon-purple">
              <Users size={20} />
            </div>
            <p className="kpi-label">Total Users</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">
              {users.length}
            </h3>
            <span className="trend positive">
              <ArrowUpRight size={14} /> Active
            </span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon icon-pink">
              <AlertTriangle size={20} />
            </div>
            <p className="kpi-label">Pending</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">
              {overall?.statusCounts?.PENDING || 0}
            </h3>
            <span className="trend negative">
              Needs Attention
            </span>
          </div>
        </div>

      </div>

      {/* ================= CHART ================= */}
      <div className="widgets-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="glass-card chart-widget">
          <div className="widget-header">
            <h3 className="widget-title">
              Transaction Volume (Last 7 Days)
            </h3>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>

                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#8b5cf6"
                  fill="url(#colorVolume)"
                />

              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
