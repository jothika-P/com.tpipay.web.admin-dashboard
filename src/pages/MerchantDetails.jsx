import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, ArrowLeft, Loader2, Mail, Phone, Calendar, ShieldCheck, ExternalLink, Globe, FileText, Download, Eye, EyeOff } from "lucide-react";
import { searchMerchants } from "../services/merchantService";
import { getKycByMerchant, getDocuments, downloadZip } from "../services/kycService";

export default function MerchantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);

  const [showLiveKey, setShowLiveKey] = useState(false);
  const [showLiveSalt, setShowLiveSalt] = useState(false);
  const [showTestKey, setShowTestKey] = useState(false);
  const [showTestSalt, setShowTestSalt] = useState(false);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (value, field) => {
    if (!value) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value)
        .then(() => { setCopiedField(field); setTimeout(() => setCopiedField(null), 1500); })
        .catch(() => fallbackCopy(value, field));
    } else {
      fallbackCopy(value, field);
    }
  };

  const fallbackCopy = (text, field) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleSave = (field) => {
    console.log("Saved:", field, tempValue);
    setEditField(null);
  };

  const handleRedirectToKyc = async () => {
    if (!merchant?.id) return;
    try {
      const kycRes = await getKycByMerchant(merchant.id);
      // Support nested data or direct response
      const kycData = kycRes?.data || kycRes;
      const kycId = kycData?.kyc_id || kycData?.id || (Array.isArray(kycData) ? kycData[0]?.kyc_id || kycData[0]?.id : null);
      
      if (kycId) {
        navigate(`/kyc/documents/${kycId}`);
      } else {
        alert("Compliance record not found for this merchant.");
      }
    } catch (err) {
      console.error("Redirect Error:", err);
      alert("Failed to resolve compliance documents.");
    }
  };
  const handleDownloadAll = async () => {
    if (!merchant?.id) return;
    setZipLoading(true);
    try {
      // First get kyc to get kycId
      const kycRes = await getKycByMerchant(merchant.id);
      const kycId = kycRes?.id || kycRes?.kycId || kycRes?.[0]?.id;
      if (!kycId) { alert("KYC record not found"); return; }
      const res = await downloadZip(kycId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `kyc_documents_${kycId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err || "Failed to download ZIP");
    } finally {
      setZipLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await searchMerchants({ id: id, filters: [] });
        const data = res?.content || res || [];
        if (data && data.length > 0) {
          const m = data[0];
          setMerchant(m);

          // Fetch KYC documents via kycService using merchant id
          setDocsLoading(true);
          try {
            const kycRes = await getKycByMerchant(m.id);
            const kycId = kycRes?.id || kycRes?.kycId || kycRes?.[0]?.id;
            if (kycId) {
              const docsRes = await getDocuments(kycId);
              setDocuments(docsRes?.content || docsRes || []);
            }
          } catch (e) {
            console.warn("Could not fetch KYC documents:", e);
          } finally {
            setDocsLoading(false);
          }
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

  // Dynamic KYC status badge
  const kycStatus = merchant?.kyc_stage || merchant?.status || "PENDING";
  const isVerified = kycStatus === "APPROVED" || kycStatus === "VERIFIED";

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

            {/* DYNAMIC KYC STATUS BADGE */}
            <div style={{
              marginTop: '20px', padding: '8px 16px',
              background: isVerified ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: isVerified ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
              color: isVerified ? 'var(--success)' : 'var(--warning)',
              borderRadius: '20px', display: 'inline-block', fontSize: '13px', fontWeight: 'bold'
            }}>
              {isVerified ? '✔ KYC VERIFIED' : `⏳ KYC ${kycStatus}`}
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
                  <p style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>
                    {merchant.created_at ? new Date(merchant.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>KYC Stage</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--secondary)' }}>{merchant.kyc_stage || "N/A"}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Account Status</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isVerified ? 'var(--success)' : 'var(--warning)' }}>
                  <ShieldCheck size={16} />
                  <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{kycStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* UPLOADED DOCUMENTS CARD */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <button
          className="gradient-btn"
          onClick={handleRedirectToKyc}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 40px', fontSize: '16px' }}
        >
          Upload KYC Documents
        </button>
      </div>

      {/* DOWNLOAD ALL FOOTER BUTTON */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <button
          className="gradient-btn"
          onClick={handleDownloadAll}
          disabled={zipLoading}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 40px', fontSize: '16px' }}
        >
          {zipLoading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
          {zipLoading ? "Downloading..." : "Download All Documents (ZIP)"}
        </button>
      </div>

      {/* ✅ API CREDENTIALS — Easebuzz only, data from backend */}
      {(merchant.status === "APPROVED" || merchant.kyc_stage === "APPROVED" || true) && (
        <div className="glass-card" style={{ marginTop: "32px" }}>
          <div className="section-header" style={{ marginBottom: "20px" }}>
            <h3>🔑 API Credentials</h3>
          </div>

          {/* EASEBUZZ LABEL */}
          <div style={{ marginBottom: "20px" }}>
            <label>Payment Gateway</label>
            <div style={{
              display: 'inline-block', padding: '8px 18px', borderRadius: '10px',
              border: '1px solid rgba(139, 92, 246, 0.3)', background: 'rgba(15, 23, 42, 0.9)',
              color: '#e2e8f0', fontSize: '14px', fontWeight: '600'
            }}>
              Easebuzz
            </div>
          </div>

          <div className="api-grid">
            {/* LIVE KEY */}
            <div className="api-row">
              <label>Live Key</label>
              <input
                type={showLiveKey ? "text" : "password"}
                value={editField === "liveKey" ? tempValue : merchant?.live_key || ""}
                readOnly={editField !== "liveKey"}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <button onClick={() => setShowLiveKey(!showLiveKey)}>{showLiveKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              <button onClick={() => handleCopy(merchant?.live_key, "liveKey")}>
                {copiedField === "liveKey" ? "✅" : "📋"}
              </button>
              {editField === "liveKey" ? (
                <button onClick={() => handleSave("liveKey")}>💾</button>
              ) : (
                <button onClick={() => { setEditField("liveKey"); setTempValue(merchant?.live_key || ""); }}>✏</button>
              )}
            </div>

            {/* LIVE SALT */}
            <div className="api-row">
              <label>Live Salt</label>
              <input
                type={showLiveSalt ? "text" : "password"}
                value={editField === "liveSalt" ? tempValue : merchant?.live_salt || ""}
                readOnly={editField !== "liveSalt"}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <button onClick={() => setShowLiveSalt(!showLiveSalt)}>{showLiveSalt ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              <button onClick={() => handleCopy(merchant?.live_salt, "liveSalt")}>
                {copiedField === "liveSalt" ? "✅" : "📋"}
              </button>
              {editField === "liveSalt" ? (
                <button onClick={() => handleSave("liveSalt")}>💾</button>
              ) : (
                <button onClick={() => { setEditField("liveSalt"); setTempValue(merchant?.live_salt || ""); }}>✏</button>
              )}
            </div>

            {/* TEST KEY */}
            <div className="api-row">
              <label>Test Key</label>
              <input
                type={showTestKey ? "text" : "password"}
                value={editField === "testKey" ? tempValue : merchant?.test_key || ""}
                readOnly={editField !== "testKey"}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <button onClick={() => setShowTestKey(!showTestKey)}>{showTestKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              <button onClick={() => handleCopy(merchant?.test_key, "testKey")}>
                {copiedField === "testKey" ? "✅" : "📋"}
              </button>
              {editField === "testKey" ? (
                <button onClick={() => handleSave("testKey")}>💾</button>
              ) : (
                <button onClick={() => { setEditField("testKey"); setTempValue(merchant?.test_key || ""); }}>✏</button>
              )}
            </div>

            {/* TEST SALT */}
            <div className="api-row">
              <label>Test Salt</label>
              <input
                type={showTestSalt ? "text" : "password"}
                value={editField === "testSalt" ? tempValue : merchant?.test_salt || ""}
                readOnly={editField !== "testSalt"}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <button onClick={() => setShowTestSalt(!showTestSalt)}>{showTestSalt ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              <button onClick={() => handleCopy(merchant?.test_salt, "testSalt")}>
                {copiedField === "testSalt" ? "✅" : "📋"}
              </button>
              {editField === "testSalt" ? (
                <button onClick={() => handleSave("testSalt")}>💾</button>
              ) : (
                <button onClick={() => { setEditField("testSalt"); setTempValue(merchant?.test_salt || ""); }}>✏</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
