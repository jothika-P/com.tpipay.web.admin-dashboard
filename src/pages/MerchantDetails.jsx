import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, ArrowLeft, Loader2, Mail, Phone, Calendar, ShieldCheck, ExternalLink, User, Globe } from "lucide-react";
import { searchMerchants } from "../services/merchantService";

export default function MerchantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch specific merchant using the search API with ID as query or filter
        const res = await searchMerchants({
          query: id,
          filters: [],
        });

        // Backend usually returns { content: [] }
        const data = res?.content || res || [];
        if (data && data.length > 0) {
          setMerchant(data[0]);
        } else {
          setError("Merchant not found");
        }
      } catch (err) {
        setError(err?.toString() || "Failed to load merchant details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="analytics-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading merchant profile...</p>
        </div>
      </div>
    );
  }

  if (error || !merchant) {
    return (
      <div className="analytics-container">
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px', borderColor: 'var(--danger)' }}>
          <h2 style={{ color: 'var(--danger)' }}>⚠️ Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || "Merchant not found"}</p>
          <button onClick={() => navigate("/merchants")} className="add-btn">Back to Merchants</button>
        </div>
      </div>
    );
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="title" style={{ fontSize: '2.5rem', textAlign: 'left', margin: 0 }}>Merchant Profile</h1>
            <p className="subtitle" style={{ margin: '0' }}>Detailed view and KYC status of {merchant.business_name}.</p>
          </div>
          <button className="add-btn" style={{ background: 'var(--glass-hover)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExternalLink size={18} /> Visit Store
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* LEFT COLUMN: BASIC INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'var(--glass-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', margin: '0 auto 20px' }}>
              <Building2 size={48} />
            </div>
            <h2 style={{ margin: '0 0 8px 0' }}>{merchant.business_name}</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Business ID: #{merchant.id}</p>
            <div style={{ marginTop: '20px', padding: '8px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: 'var(--success)', borderRadius: '20px', display: 'inline-block', fontSize: '13px', fontWeight: 'bold' }}>
              KYC VERIFIED
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '20px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} style={{ color: 'var(--primary)' }} /> Contact Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Primary Email</p>
                  <p style={{ margin: 0 }}>{merchant.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Phone size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Contact Number</p>
                  <p style={{ margin: 0 }}>{merchant.contact_number || "Not Provided"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Business Registration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Legal Entity Name</p>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{merchant.legal_name}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Application Date</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} />
                  <p style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>Jan 12, 2024</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>KYC Stage</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--secondary)' }}>{merchant.kyc_stage || "Final Review"}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Account Status</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                  <ShieldCheck size={16} />
                  <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Owner Details</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--glass-hover)', borderRadius: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} />
              </div>
              <div>
                <p style={{ fontWeight: '600', margin: 0 }}>Authorized Signatory</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{merchant.legal_name.split(' ')[0]} User</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
