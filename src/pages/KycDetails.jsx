import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building, Clipboard, Activity } from "lucide-react";

export default function KycDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, you'd fetch this based on the ID
  const merchant = {
    id,
    business: "ABC Traders",
    rm: "Rahul",
    stage: "RM Review",
    status: "PENDING",
    email: "contact@abctraders.com",
    phone: "+91 98765 43210",
    address: "123, Marketplace Street, Mumbai",
    type: "Sole Proprietorship",
    onboardingDate: "2024-03-01",
  };

  return (
    <div className="dash-content animate-fade-in">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate("/kyc")}>
            <ArrowLeft size={16} /> Back to KYC Review
          </button>
          <h1 className="dash-title">Merchant KYC Details</h1>
          <p className="dash-subtitle">Comprehensive profile for {merchant.business}</p>
        </div>
      </div>

      <div className="details-grid">
        <div className="glass-card">
          <div className="section-header">
            <h3><Building size={18} /> Business Information</h3>
          </div>
          <div className="info-rows">
            <div className="info-row">
              <div className="info-details">
                <label>Legal Name</label>
                <p>{merchant.business}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-details">
                <label>Business Type</label>
                <p>{merchant.type}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-details">
                <label>Address</label>
                <p>{merchant.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="section-header">
            <h3><User size={18} /> Contact & Relationship</h3>
          </div>
          <div className="info-rows">
            <div className="info-row">
              <div className="info-details">
                <label>Email Address</label>
                <p>{merchant.email}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-details">
                <label>Phone Number</label>
                <p>{merchant.phone}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-details">
                <label>Relationship Manager</label>
                <p>{merchant.rm}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="section-header">
            <h3><Activity size={18} /> Status & Timeline</h3>
          </div>
          <div className="info-rows">
            <div className="info-row">
              <div className="info-details">
                <label>Current Status</label>
                <p><span className={`status ${merchant.status.toLowerCase()}`}>{merchant.status}</span></p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-details">
                <label>Current Stage</label>
                <p>{merchant.stage}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-details">
                <label>Onboarding Started</label>
                <p>{merchant.onboardingDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
