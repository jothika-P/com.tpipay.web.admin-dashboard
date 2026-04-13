import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

export default function CreateMerchant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    gstNumber: "",
    panNumber: "",
    incorporationDate: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Navigate back after delay
      setTimeout(() => {
        navigate("/merchants");
      }, 2000);
    }, 1200);
  };

  if (success) {
    return (
      <div className="dash-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="glass-card animate-fade-in" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ color: '#22c55e', marginBottom: '16px' }}>
            <CheckCircle size={64} style={{ margin: '0 auto' }} />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Created Successfully</h2>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>👉 Merchant created successfully.</p>
          <button className="gradient-btn" onClick={() => navigate("/merchants")}>
            Return to Merchants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-content animate-fade-in">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate("/merchants")} style={{ marginBottom: '12px' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="dash-title">Onboard New Merchant</h1>
          <p className="dash-subtitle">Enter merchant information to create an account.</p>
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} className="premium-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="e.g. Rahul Sharma" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Business Name</label>
              <input 
                type="text" 
                name="businessName" 
                placeholder="e.g. Sharma Electronics" 
                required 
                value={formData.businessName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>GST Number</label>
              <input 
                type="text" 
                name="gstNumber" 
                placeholder="15-digit GSTIN" 
                required 
                value={formData.gstNumber}
                onChange={handleChange}
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            <div className="form-group">
              <label>PAN Number</label>
              <input 
                type="text" 
                name="panNumber" 
                placeholder="10-digit PAN" 
                required 
                value={formData.panNumber}
                onChange={handleChange}
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            <div className="form-group">
              <label>Date of Incorporation</label>
              <input 
                type="date" 
                name="incorporationDate" 
                required 
                value={formData.incorporationDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
            <button 
              type="submit" 
              className="gradient-btn" 
              disabled={loading}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading ? "Processing..." : <><Save size={18} /> Create Merchant</>}
            </button>
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => navigate("/merchants")}
              style={{ flex: 0.3 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
