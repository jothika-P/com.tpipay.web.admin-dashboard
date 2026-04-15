import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, Loader2, Save, Mail, Phone, Info } from "lucide-react";
import { upsertMerchant } from "../services/merchantService";

export default function CreateMerchant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    legal_name: "",
    business_name: "",
    email: "",
    contact_number: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await upsertMerchant({
        ...formData,
        operation: "create",
      });
      navigate("/merchants");
    } catch (err) {
      setError(err?.toString() || "Failed to create merchant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics-container">
      {/* HEADER SECTION */}
      <div className="header-section" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate("/merchants")} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to Merchants
        </button>
        <h1 className="title" style={{ fontSize: '2.5rem', textAlign: 'left', margin: 0 }}>Register Merchant</h1>
        <p className="subtitle" style={{ margin: '0' }}>Onboard a new business entity to the platform.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
        {error && (
          <div className="glass-card" style={{ borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger)', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '10px' }}>
            <Building2 size={20} />
            <h3 style={{ margin: 0 }}>Business Information</h3>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
               Legal Business Name
            </label>
            <div style={{ position: 'relative' }}>
              <Building2 size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                required
                placeholder="e.g. Acme Corporation Pvt Ltd"
                value={formData.legal_name}
                onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                style={{ width: '100%', paddingLeft: '45px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
               Brand / Trading Name
            </label>
            <div style={{ position: 'relative' }}>
              <Info size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                required
                placeholder="e.g. Acme Store"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                style={{ width: '100%', paddingLeft: '45px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
               Business Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                required
                type="email"
                placeholder="contact@business.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', paddingLeft: '45px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
              />
            </div>
          </div>

          <div style={{ gridColumn: '2 / 3' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
               Contact Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                required
                placeholder="+1 (555) 000-0000"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                style={{ width: '100%', paddingLeft: '45px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button 
              type="button" 
              onClick={() => navigate("/merchants")}
              style={{ background: 'var(--glass-hover)', border: '1px solid var(--glass-border)', color: 'white', padding: '0 32px', borderRadius: '12px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="add-btn" 
              style={{ height: '50px', padding: '0 40px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Onboard Merchant</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
