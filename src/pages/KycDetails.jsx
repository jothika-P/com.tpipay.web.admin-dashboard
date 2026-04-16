import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Building2, MapPin, Calendar, ShieldCheck, Mail, Phone, Info, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { getKycById } from "../services/kycService";
import { searchMerchants } from "../services/merchantService";

export default function KycDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kyc, setKyc] = useState(null);
  const [merchant, setMerchant] = useState(null);
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
      const kycData = res?.data || res || null;
      setKyc(kycData);

      // Use merchantId from res?.data to hit searchMerchant api
      const mId = kycData?.merchant_id || kycData?.merchantId || kycData?.id;
      if (mId) {
        try {
          const mRes = await searchMerchants({ id: mId });
          const mData = mRes?.content?.[0] || mRes?.[0] || mRes;
          setMerchant(mData);
        } catch (mErr) {
          console.error("Failed to fetch additional merchant details:", mErr);
        }
      }
    } catch (err) {
      setError(err?.toString() || "Failed to load KYC details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="analytics-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Retrieving compliance data...</p>
        </div>
      </div>
    );
  }

  if (error || !kyc) {
    return (
      <div className="analytics-container">
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px', borderColor: 'var(--danger)' }}>
          <AlertCircle size={48} style={{ color: 'var(--danger)', margin: '0 auto 20px' }} />
          <h2 style={{ color: 'var(--danger)' }}>⚠️ Data Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || "KYC record not found"}</p>
          <button onClick={() => navigate("/kyc")} className="add-btn">Back to KYC List</button>
        </div>
      </div>
    );
  }

  const isApproved = kyc.status === 'APPROVED';

  return (
    <div className="analytics-container animate-fade-in">
      {/* HEADER SECTION */}
      <div className="header-section" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
        <button 
          onClick={() => navigate("/kyc")} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontSize: '14px', transition: 'color 0.2s' }}
          onMouseOver={e => e.target.style.color = 'white'}
          onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Back to Compliance Management
        </button>
        <div style={{ position: 'relative' }}>
          <h1 className="title" style={{ fontSize: '2.8rem', textAlign: 'left', margin: 0, fontWeight: '800', letterSpacing: '-1px' }}>KYC Dossier</h1>
          <div style={{ position: 'absolute', bottom: '-4px', left: 0, width: '60px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }}></div>
        </div>
        <p className="subtitle" style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Full verification profile for <strong>{kyc.business || kyc.business_name || kyc.legal_name || "Merchant"}</strong>.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
        
        {/* LEFT COLUMN: STATUS & QUICK INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: isApproved ? 'rgba(34,197,94,0.05)' : 'rgba(139,92,246,0.05)', borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
            
            <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isApproved ? 'var(--success)' : 'var(--secondary)', margin: '0 auto 24px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <Building2 size={50} />
            </div>
            
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: '700' }}>{kyc.business || kyc.business_name}</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Dossier Reference: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>#{kyc.kyc_id || kyc.id}</span></p>
            
            <div style={{ 
              marginTop: '28px', padding: '12px 28px', 
              background: isApproved ? 'rgba(34, 197, 94, 0.1)' : 'rgba(139, 92, 246, 0.1)',
              border: isApproved ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(139, 92, 246, 0.2)',
              color: isApproved ? '#4ade80' : '#a78bfa',
              borderRadius: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '700' 
            }}>
              {isApproved ? <CheckCircle2 size={18} /> : <Clock size={18} />}
              {kyc.status || 'PENDING VERIFICATION'}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} style={{ color: 'var(--primary)' }} /> Connectivity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                   <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Authorized Email</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', wordBreak: 'break-all' }}>{kyc.email || "—"}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                   <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Registry</p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>{kyc.contact_number || kyc.phone || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-card" style={{ padding: '35px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Address Details</h3>
              <div style={{ background: 'var(--glass-hover)', padding: '6px 16px', borderRadius: '15px', fontSize: '12px', border: '1px solid var(--glass-border)', color: 'var(--secondary)', fontWeight: '600' }}>
                Stage: {kyc.stage || kyc.kyc_stage || 'INITIATED'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
              <div className="attribute-group">
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>City</label>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
                  {kyc.city || "—"}
                </div>
              </div>
              <div className="attribute-group">
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>State</label>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
                  {kyc.state || "—"}
                </div>
              </div>
              <div className="attribute-group">
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Pincode</label>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
                  {kyc.pin_code || "—"}
                </div>
              </div>
              <div className="attribute-group">
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>RM Name</label>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '14px', color: 'var(--secondary)', fontWeight: '600' }}>
                  {kyc.rm_name || kyc.rm || "—"}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Full Registered Address</label>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <MapPin size={18} style={{ color: 'var(--primary)', marginTop: '4px' }} />
                  <span style={{ lineHeight: '1.6', fontSize: '15px' }}>{kyc.address || "Address details not available"}</span>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Onboarding Date</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Calendar size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: '600' }}>{formatDate(kyc.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>Latest Compliance Observations</h3>
            <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)', borderRadius: '16px', padding: '24px', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#d1d5db', fontStyle: 'italic', margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
                {kyc.latest_note || kyc.notes?.[0]?.note || "Awaiting further internal observations for this compliance file."}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>SA</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>System Auditor • {formatDate(kyc.updated_at || kyc.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
