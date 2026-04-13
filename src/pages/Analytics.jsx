import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wallet, Users, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const chartData = [
  { name: "Mon", volume: 4000, newMerchants: 24 },
  { name: "Tue", volume: 3000, newMerchants: 13 },
  { name: "Wed", volume: 5500, newMerchants: 38 },
  { name: "Thu", volume: 4500, newMerchants: 39 },
  { name: "Fri", volume: 7000, newMerchants: 48 },
  { name: "Sat", volume: 6000, newMerchants: 38 },
  { name: "Sun", volume: 9000, newMerchants: 43 },
];

const transactions = [
  { id: "TXN-9821", name: "Global Tech LLC", amount: "+$12,450", status: "Success", time: "10 mins ago", type: "deposit" },
  { id: "TXN-9822", name: "API Usage Fee", amount: "-$450", status: "Debited", time: "1 hour ago", type: "withdrawal" },
  { id: "TXN-9823", name: "Stripe Settlement", amount: "+$8,230", status: "Success", time: "3 hours ago", type: "deposit" },
  { id: "TXN-9824", name: "Server Hosting", amount: "-$120", status: "Debited", time: "5 hours ago", type: "withdrawal" },
];

export default function Analytics() {
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const isLegal = role === "LEGALTEAM";

  return (
    <div className="dash-content animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="dash-title">Platform Overview</h1>
          <p className="dash-subtitle">Real-time metrics and financial analytics overview.</p>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="metrics-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon icon-cyan">
              <Wallet size={20} />
            </div>
            <p className="kpi-label">Total Volume</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">$2,450,200</h3>
            <span className="trend positive">
              <ArrowUpRight size={14} /> 12.5%
            </span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon icon-purple">
              <Users size={20} />
            </div>
            <p className="kpi-label">Total Merchants</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">1,204</h3>
            <span className="trend positive">
              <ArrowUpRight size={14} /> +45
            </span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon icon-pink">
              <AlertTriangle size={20} />
            </div>
            <p className="kpi-label">Pending KYC</p>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">28</h3>
            <span className="trend negative">
              High Priority
            </span>
          </div>
        </div>
      </div>

      {/* MAIN WIDGETS */}
      <div className="widgets-grid" style={{ gridTemplateColumns: '1fr' }}>
        {/* CHART PORTION */}
        <div className="glass-card chart-widget">
          <div className="widget-header">
            <h3 className="widget-title">Transaction Volume (Last 7 Days)</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(9, 9, 11, 0.95)", 
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                    backdropFilter: "blur(10px)"
                  }} 
                  itemStyle={{ color: "#fff" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                  activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}