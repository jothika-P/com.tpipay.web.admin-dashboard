import React, { useEffect, useState, useCallback } from "react";
import { Wallet, Users, AlertTriangle, ArrowUpRight, TrendingUp, RefreshCw, Filter } from "lucide-react";

import {
  getOverallAnalytics,
  getRMSummary,
  searchUsers,
  getMerchantCounts
} from "../services/analyticsService";

export default function Analytics() {
  const [overall, setOverall] = useState({});
  const [chartData, setChartData] = useState([]);
  const [rmList, setRmList] = useState([]);
  const [merchantStats, setMerchantStats] = useState({});
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

      // 3. Fetch Merchant Counts
      const merchantRes = await getMerchantCounts();
      setMerchantStats(merchantRes?.data || merchantRes || {});

      // 4. Fetch RMs for dropdown
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
      // 1. Fetch RM Specific Summary
      const res = await getRMSummary(rmId);
      const data = res?.data || res || {};
      setOverall(data);
      
      // 2. Fetch RM Specific Merchant Counts
      const merchantRes = await getMerchantCounts(rmId);
      setMerchantStats(merchantRes?.data || merchantRes || {});

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
      </div>

      {/* FILTER BAR */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '20px 24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <Filter size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Filter by RM:</span>
          <select 
            value={selectedRM} 
            onChange={(e) => handleRMChange(e.target.value)}
            style={{ flex: 1, maxWidth: '300px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '8px 12px', borderRadius: '10px', height: '42px', outline: 'none' }}
          >
            <option value="" style={{ background: '#111', color: 'white' }}>All Platform Data</option>
            {rmList.map(rm => (
              <option key={rm.id} value={rm.id} style={{ background: '#111', color: 'white' }}>{rm.name || rm.email}</option>
            ))}
          </select>
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
            <div className="kpi-icon icon-pink"><TrendingUp size={20} /></div>
            <p className="kpi-label">Total Transaction</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{overall?.totalCount || "0"}</h3>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Processed successfully</p>
          </div>
        </div>
      </div>

      {/* ACTIVE MERCHANTS CARD */}
      <div className="widgets-grid" style={{ gridTemplateColumns: '1fr', marginTop: '2rem' }}>
        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Active Merchants</h3>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--glass-hover)', padding: '4px 12px', borderRadius: '12px' }}>
              Platform Overview
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ textAlign: 'center', padding: '24px', border: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.05)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Merchants</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#22c55e', margin: '0' }}>
                {merchantStats?.total || merchantStats?.totalMerchants || '0'}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--success)', marginTop: '8px', display: 'block' }}>✔ Registered</span>
            </div>

            <div className="glass-card" style={{ textAlign: 'center', padding: '24px', border: '1px solid rgba(14,165,233,0.2)', background: 'rgba(14,165,233,0.05)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>KYC Approved</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0ea5e9', margin: '0' }}>
                {merchantStats?.APPROVED || merchantStats?.approved || '0'}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--secondary)', marginTop: '8px', display: 'block' }}>✔ Verified</span>
            </div>

            <div className="glass-card" style={{ textAlign: 'center', padding: '24px', border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.05)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending KYC</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f59e0b', margin: '0' }}>
                {merchantStats?.PENDING || merchantStats?.pending || '0'}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--warning)', marginTop: '8px', display: 'block' }}>⚠ Awaiting Review</span>
            </div>

            <div className="glass-card" style={{ textAlign: 'center', padding: '24px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rejected</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ef4444', margin: '0' }}>
                {merchantStats?.REJECTED || merchantStats?.rejected || '0'}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '8px', display: 'block' }}>✖ Not Approved</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
