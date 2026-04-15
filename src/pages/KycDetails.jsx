import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Building2, MapPin, Calendar, ShieldCheck, Mail, Phone, Info } from "lucide-react";
import { getKycById } from "../services/kycService";

export default function KycDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getKycById(id);
      setKyc(res?.data || res || null);
    } catch (err) {
      setError(err?.toString() || "Failed to load KYC details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (error || !kyc) {
    return (
      <div className="analytics-container">
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px', borderColor: 'var(--danger)' }}>
          <h2 style={{ color: 'var(--danger)' }}>⚠️ Error</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error || "KYC record not found"}</p>
          <button onClick={() => navigate("/kyc")} className="add-btn" style={{ marginTop: '20px' }}>Back to KYC List</button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* HEADER SECTION */}
      <div className="header-section" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate("/kyc")} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to KYC Management
        </button>
        <h1 className="title" style={{ fontSize: '2.5rem', textAlign: 'left', margin: 0 }}>KYC Dossier</h1>
        <p className="subtitle" style={{ margin: '0' }}>Compliance review for {kyc.business || "Merchant entity"}.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* LEFT COLUMN: STATUS OVERVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--glass-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', margin: '0 auto 16px' }}>
              <Building2 size={40} />
            </div>
            <h2 style={{ margin: '0 0 8px 0' }}>{kyc.business}</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>KYC ID: #{kyc.id}</p>
            
            <div style={{ 
              marginTop: '20px', padding: '10px 20px', 
              background: kyc.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(139, 92, 246, 0.1)',
              border: kyc.status === 'APPROVED' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(139, 92, 246, 0.2)',
              color: kyc.status === 'APPROVED' ? 'var(--success)' : 'var(--secondary)',
              borderRadius: '24px', display: 'inline-block', fontSize: '14px', fontWeight: 'bold' 
            }}>
              {kyc.status || 'PENDING'}
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '16px', fontSize: '15px', color: 'var(--text-secondary)' }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={16} style={{ color: 'var(--primary)', marginTop: '4px' }} />
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Registration Email</p>
                  <p style={{ margin: 0, fontSize: '14px' }}>{kyc.email || "N/A"}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Phone size={16} style={{ color: 'var(--primary)', marginTop: '4px' }} />
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Contact Number</p>
                  <p style={{ margin: 0, fontSize: '14px' }}>{kyc.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED PROPERTIES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>KYC Profile Details</h3>
              <div style={{ background: 'var(--glass-hover)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', border: '1px solid var(--glass-border)' }}>
                Stage: {kyc.stage || 'STAGE 1'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Business Type</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={16} style={{ color: 'var(--primary)' }} />
                  <span>{kyc.type || "Proprietorship"}</span>
                </div>
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Assigned RM</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
                  <span>{kyc.rm || "Relationship Manager"}</span>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Registered Address</label>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <MapPin size={16} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                  <span style={{ lineHeight: '1.4' }}>{kyc.address || "123 Fintech Lane, Business District, Mumbai, 400001"}</span>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Onboarding Date</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} style={{ color: 'var(--primary)' }} />
                  <span>{kyc.onboardingDate || "January 14, 2024"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Recent Comments</h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '16px', border: '1px solid var(--glass-border)' }}>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                "Identity documents verified. Awaiting proof of business address for Stage 2 completion."
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                - System Audit Log » 2 hours ago
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
