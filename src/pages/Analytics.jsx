import React, { useEffect, useState, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wallet, Users, AlertTriangle, ArrowUpRight, TrendingUp, RefreshCw, BarChart3, Filter } from "lucide-react";

import {
  getOverallAnalytics,
  getRMSummary,
  searchUsers
} from "../services/analyticsService";

export default function Analytics() {
  const [overall, setOverall] = useState({});
  const [chartData, setChartData] = useState([]);
  const [rmList, setRmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedRM, setSelectedRM] = useState(""); // rmId
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  /* ================= LOAD INITIAL DATA ================= */
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Overall KPI
      const analyticsRes = await getOverallAnalytics();
      setOverall(analyticsRes?.data || analyticsRes || {});
      
      // 2. Map data to chart (Weekly Volume)
      const dataVolume = analyticsRes?.totalAmount || analyticsRes?.data?.totalAmount || 0;
      const mockChart = [
        { name: "Mon", volume: dataVolume * 0.1 },
        { name: "Tue", volume: dataVolume * 0.15 },
        { name: "Wed", volume: dataVolume * 0.2 },
        { name: "Thu", volume: dataVolume * 0.12 },
        { name: "Fri", volume: dataVolume * 0.25 },
        { name: "Sat", volume: dataVolume * 0.1 },
        { name: "Sun", volume: dataVolume * 0.08 }
      ];
      setChartData(mockChart);

      // 3. Fetch RMs for dropdown
      const usersRes = await searchUsers({
        query: "",
        filters: [{ key: "role", value: "RELATIONSHIP_MANAGER", operator: "=" }],
        limit: 100,
        offset: 0
      });
      setRmList(usersRes?.content || usersRes?.data || usersRes || []);
    } catch (err) {
      setError(err?.toString() || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE RM FILTER CHANGE ================= */
  const handleRMChange = async (rmId) => {
    setSelectedRM(rmId);
    if (!rmId) {
      fetchInitialData();
      return;
    }
    
    setLoading(true);
    try {
      const res = await getRMSummary(rmId);
      const data = res?.data || res || {};
      setOverall(data);
      
      // Update chart based on RM specific volume if returned, else mock
      const rmVolume = data.totalAmount || 0;
      setChartData(prev => prev.map(d => ({ ...d, volume: rmVolume / 7 * (Math.random() + 0.5) })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="analytics-container animate-fade-in">
      
      {/* HEADER */}
      <div className="header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 className="title" style={{ fontSize: '2.5rem', margin: 0 }}>Analytics Dashboard</h1>
          <p className="subtitle" style={{ margin: 0 }}>Real-time platform insights and performance metrics.</p>
        </div>
        <button className="action-btn" onClick={fetchInitialData} style={{ height: '48px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '20px 24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <Filter size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Filter by RM:</span>
          <select 
            value={selectedRM} 
            onChange={(e) => handleRMChange(e.target.value)}
            style={{ flex: 1, maxWidth: '300px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
          >
            <option value="">All Platform Data</option>
            {rmList.map(rm => (
              <option key={rm.id} value={rm.id}>{rm.name} ({rm.email})</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Date Range:</span>
          <input type="date" className="date-input" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', padding: '6px 12px', borderRadius: '8px' }} />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input type="date" className="date-input" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', padding: '6px 12px', borderRadius: '8px' }} />
        </div>
      </div>

      {error && (
        <div className="glass-card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI GRID */}
      <div className="metrics-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon icon-cyan"><Wallet size={20} /></div>
            <p className="kpi-label">Total Volume</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{overall?.totalAmount?.toLocaleString() || "0"}</h3>
            <span className="trend positive"><ArrowUpRight size={14} /> +12%</span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon icon-purple"><Users size={20} /></div>
            <p className="kpi-label">Active Merchants</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{overall?.totalMerchants || overall?.merchantCount || "0"}</h3>
            <span className="trend positive"><TrendingUp size={14} /> Growing</span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon icon-pink"><AlertTriangle size={20} /></div>
            <p className="kpi-label">Pending KYC</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{overall?.pendingKyc || overall?.statusCounts?.PENDING || "0"}</h3>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Requires Attention</p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="widgets-grid" style={{ gridTemplateColumns: '1fr', marginTop: '2rem' }}>
        <div className="glass-card chart-widget" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <BarChart3 size={20} style={{ color: 'var(--secondary)' }} />
               <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Transaction Flow Velocity</h3>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--glass-hover)', padding: '4px 12px', borderRadius: '12px' }}>
              Last 7 Trading Days
            </div>
          </div>

          <div className="chart-container" style={{ height: '400px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ background: 'var(--dark-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--secondary)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="var(--secondary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
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
