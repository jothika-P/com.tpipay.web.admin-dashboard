import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, ArrowLeft, Loader2, Mail, Phone, Calendar, ShieldCheck, ExternalLink, Globe, FileText, Download, Eye, EyeOff, Plus, Trash2, Settings, AlertCircle } from "lucide-react";
import { searchMerchants } from "../services/merchantService";
import { getKycByMerchant, getDocuments, downloadZip } from "../services/kycService";
import { getProviderCredentials, createProviderCredential, updateProviderCredential, deleteProviderCredential } from "../services/providerService";

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

  // --- Provider Credentials State ---
  const [providerCreds, setProviderCreds] = useState([]);
  const [credsLoading, setCredsLoading] = useState(false);
  const [isAddingCred, setIsAddingCred] = useState(false);
  const [newCred, setNewCred] = useState({
    provider: "EASEBUZZ",
    key: "",
    salt: "",
    environment: "TESTING",
    status: "ACTIVE"
  });
  const [editingCredId, setEditingCredId] = useState(null);
  const [submittingCred, setSubmittingCred] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({}); // { [id_field]: boolean }

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

    const fetchCredentials = async () => {
      setCredsLoading(true);
      try {
        const res = await getProviderCredentials(id);
        setProviderCreds(res || []);
      } catch (err) {
        console.error("Failed to fetch credentials:", err);
      } finally {
        setCredsLoading(false);
      }
    };

    fetchData();
    fetchCredentials();
  }, [id]);

  const handleToggleVisible = (id, field) => {
    const key = `${id}_${field}`;
    setVisibleKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddCred = async () => {
    if (!newCred.key || !newCred.salt) {
      alert("Please enter both key and salt");
      return;
    }
    setSubmittingCred(true);
    try {
      const payload = {
        merchantId: parseInt(id),
        provider: newCred.provider,
        key: newCred.key,
        salt: newCred.salt,
        environment: newCred.environment,
        status: newCred.status
      };

      if (editingCredId) {
        await updateProviderCredential(editingCredId, payload);
      } else {
        await createProviderCredential(payload);
      }

      setIsAddingCred(false);
      setEditingCredId(null);
      setNewCred({ provider: "EASEBUZZ", key: "", salt: "", environment: "TESTING", status: "ACTIVE" });
      // Refresh list
      const res = await getProviderCredentials(id);
      setProviderCreds(res || []);
    } catch (err) {
      alert(err || "Failed to save credential");
    } finally {
      setSubmittingCred(false);
    }
  };

  const handleEditCred = (cred) => {
    setNewCred({
      provider: cred.provider,
      key: cred.key,
      salt: cred.salt,
      environment: cred.environment,
      status: cred.status
    });
    setEditingCredId(cred.id);
    setIsAddingCred(true);
  };

  const handleDeleteCred = async (credId) => {
    if (!window.confirm("Are you sure you want to delete this credential?")) return;
    try {
      await deleteProviderCredential(credId);
      setProviderCreds(prev => prev.filter(c => c.id !== credId));
    } catch (err) {
      alert(err || "Failed to delete credential");
    }
  };

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
      {/* ✅ MERCHANT PROVIDER CREDENTIALS */}
      <div className="glass-card" style={{ marginTop: "40px", border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <Settings size={22} style={{ color: 'var(--primary)' }} /> Provider Credentials
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>Manage API keys for different payment providers and environments.</p>
          </div>
          {!isAddingCred && (
            <button
              onClick={() => setIsAddingCred(true)}
              className="add-btn"
              style={{ padding: '8px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} /> Add Credential
            </button>
          )}
        </div>

        {/* --- ADD NEW CREDENTIAL FORM --- */}
        {isAddingCred && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', padding: '24px', marginBottom: '24px',
            border: '1px solid rgba(139, 92, 246, 0.2)', animation: 'slideDown 0.3s ease-out'
          }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>{editingCredId ? "Update Provider Details" : "Configure New Provider"}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Payment Provider</label>
                <select
                  value={newCred.provider}
                  onChange={(e) => setNewCred({ ...newCred, provider: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}
                >
                  <option value="EASEBUZZ">Easebuzz</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Environment</label>
                <select
                  value={newCred.environment}
                  onChange={(e) => setNewCred({ ...newCred, environment: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}
                >
                  <option value="TESTING">TESTING</option>
                  <option value="PRODUCTION">PRODUCTION</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Merchant Key</label>
                <input
                  type="text"
                  placeholder="Enter Provider Key"
                  value={newCred.key}
                  onChange={(e) => setNewCred({ ...newCred, key: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Merchant Salt / Secret</label>
                <input
                  type="text"
                  placeholder="Enter Provider Salt"
                  value={newCred.salt}
                  onChange={(e) => setNewCred({ ...newCred, salt: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Status</label>
                <select
                  value={newCred.status}
                  onChange={(e) => setNewCred({ ...newCred, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={handleAddCred}
                disabled={submittingCred}
                className="gradient-btn"
                style={{ padding: '10px 24px', borderRadius: '10px', fontSize: '14px' }}
              >
                {submittingCred ? "Saving..." : editingCredId ? "Update Credential" : "Save Credentials"}
              </button>
              <button
                onClick={() => { setIsAddingCred(false); setEditingCredId(null); }}
                style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* --- CREDENTIALS LIST --- */}
        {credsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary)', margin: '0 auto' }} />
          </div>
        ) : providerCreds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <AlertCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>No provider credentials found for this merchant.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {providerCreds.map((cred) => (
              <div key={cred.id} className="glass-card" style={{
                background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)', position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px 16px', background: 'var(--primary)', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                      {cred.provider}
                    </div>
                    {/* ENVIRONMENT BADGE */}
                    <div style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                      background: cred.environment === "PRODUCTION" ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: cred.environment === "PRODUCTION" ? '#4ade80' : '#60a5fa',
                      border: `1px solid ${cred.environment === "PRODUCTION" ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
                    }}>
                      {cred.environment}
                    </div>
                    {/* STATUS BADGE */}
                    <div style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                      background: cred.status === "ACTIVE" ? 'rgba(34, 197, 94, 0.1)' : 'rgba(247, 37, 133, 0.1)',
                      color: cred.status === "ACTIVE" ? 'var(--success)' : 'var(--danger)',
                      border: `1px solid ${cred.status === "ACTIVE" ? 'rgba(34, 197, 94, 0.2)' : 'rgba(247, 37, 133, 0.2)'}`
                    }}>
                      {cred.status}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEditCred(cred)}
                      style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Plus size={16} /> {/* Reusing Plus for Edit or just use text/other icon */}
                    </button>
                    <button
                      onClick={() => handleDeleteCred(cred.id)}
                      style={{ background: 'rgba(247, 37, 133, 0.1)', border: 'none', color: 'var(--danger)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="api-grid" style={{ gap: '12px' }}>
                  <div className="api-row" style={{ gridTemplateColumns: '120px 1fr 40px 40px' }}>
                    <label style={{ fontSize: '13px' }}>Merchant Key</label>
                    <input
                      type={visibleKeys[`${cred.id}_key`] ? "text" : "password"}
                      value={cred.key}
                      readOnly
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', color: 'white' }}
                    />
                    <button onClick={() => handleToggleVisible(cred.id, 'key')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                      {visibleKeys[`${cred.id}_key`] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => handleCopy(cred.key, `${cred.id}_key`)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                      {copiedField === `${cred.id}_key` ? "✅" : "📋"}
                    </button>
                  </div>
                  <div className="api-row" style={{ gridTemplateColumns: '120px 1fr 40px 40px' }}>
                    <label style={{ fontSize: '13px' }}>Merchant Salt</label>
                    <input
                      type={visibleKeys[`${cred.id}_salt`] ? "text" : "password"}
                      value={cred.salt}
                      readOnly
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', color: 'white' }}
                    />
                    <button onClick={() => handleToggleVisible(cred.id, 'salt')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                      {visibleKeys[`${cred.id}_salt`] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => handleCopy(cred.salt, `${cred.id}_salt`)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                      {copiedField === `${cred.id}_salt` ? "✅" : "📋"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
