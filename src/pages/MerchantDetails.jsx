import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, ArrowLeft, Loader2, Mail, Phone, Calendar, ShieldCheck, ExternalLink, Globe, FileText, Download, Eye, EyeOff, Trash2 } from "lucide-react";
import { searchMerchants } from "../services/merchantService";
import { getKycByMerchant, getDocuments, downloadZip } from "../services/kycService";
import {
  getMerchantProviderCredentials,
  createMerchantProviderCredential,
  updateMerchantProviderCredential,
  deleteMerchantProviderCredential
} from "../services/credentialService";

export default function MerchantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);

  const [credentials, setCredentials] = useState([]);
  const [credsLoading, setCredsLoading] = useState(false);
  const [isAddingCreds, setIsAddingCreds] = useState(false);
  const [newCreds, setNewCreds] = useState({ provider: "EASEBUZZ", key: "", salt: "" });

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

  const handleSave = async (id, provider, field) => {
    try {
      console.log("Saving the field {}", provider);
      const cred = credentials.find(c => c.id === id);
      const updatedData = {
        ...cred,
        [field === "liveKey" ? "key" : "salt"]: tempValue,
        merchantId: merchant.id
      };

      await updateMerchantProviderCredential(id, updatedData);

      setCredentials(prev => prev.map(c => c.id === id ? { ...c, [field === "liveKey" ? "key" : "salt"]: tempValue } : c));
      setEditField(null);
    } catch (err) {
      alert("Failed to update credential: " + err);
    }
  };

  const handleCreateCreds = async () => {
    if (!newCreds.key || !newCreds.salt) {
      alert("Please provide both Key and Salt");
      return;
    }
    try {
      const payload = {
        ...newCreds,
        merchantId: merchant.id
      };
      const created = await createMerchantProviderCredential(payload);
      setCredentials(prev => [...prev, created]);
      setIsAddingCreds(false);
      setNewCreds({ provider: "EASEBUZZ", key: "", salt: "" });
    } catch (err) {
      alert("Failed to create credential: " + err);
    }
  };

  const handleDeleteCreds = async (id) => {
    if (!window.confirm("Are you sure you want to delete these credentials?")) return;
    try {
      await deleteMerchantProviderCredential(id);
      setCredentials(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert("Failed to delete credential: " + err);
    }
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

          // Fetch Merchant Provider Credentials
          setCredsLoading(true);
          try {
            const creds = await getMerchantProviderCredentials(m.id);
            setCredentials(creds || []);
          } catch (e) {
            console.warn("Could not fetch provider credentials:", e);
          } finally {
            setCredsLoading(false);
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

      {/* ✅ API CREDENTIALS */}
      {(merchant.status === "APPROVED" || merchant.kyc_stage === "APPROVED" || true) && (
        <div className="glass-card" style={{ marginTop: "32px" }}>
          <div className="section-header" style={{ marginBottom: "20px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>🔑 API Credentials</h3>
            {!isAddingCreds && (
              <button
                className="add-btn"
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={() => setIsAddingCreds(true)}
              >
                + Add Provider
              </button>
            )}
          </div>

          {credsLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <Loader2 className="animate-spin" size={24} style={{ color: 'var(--primary)' }} />
            </div>
          ) : (
            <>
              {/* ADD NEW CREDENTIAL FORM */}
              {isAddingCreds && (
                <div className="glass-card" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--glass-border)' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Add Provider Credentials</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <label style={{ width: '100px', fontSize: '13px' }}>Provider</label>
                      <select
                        value={newCreds.provider}
                        onChange={(e) => setNewCreds({ ...newCreds, provider: e.target.value })}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'var(--text)', padding: '6px 12px', borderRadius: '8px', flex: 1 }}
                      >
                        <option value="EASEBUZZ">Easebuzz</option>
                        <option value="RAZORPAY">Razorpay</option>
                        <option value="CASHFREE">Cashfree</option>
                        <option value="PAYU">PayU</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <label style={{ width: '100px', fontSize: '13px' }}>Live Key</label>
                      <input
                        type="text"
                        value={newCreds.key}
                        onChange={(e) => setNewCreds({ ...newCreds, key: e.target.value })}
                        placeholder="Enter live key"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <label style={{ width: '100px', fontSize: '13px' }}>Live Salt</label>
                      <input
                        type="text"
                        value={newCreds.salt}
                        onChange={(e) => setNewCreds({ ...newCreds, salt: e.target.value })}
                        placeholder="Enter live salt"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                      <button className="add-btn" style={{ background: 'none', border: '1px solid var(--glass-border)' }} onClick={() => setIsAddingCreds(false)}>Cancel</button>
                      <button className="add-btn" onClick={handleCreateCreds}>Create Credentials</button>
                    </div>
                  </div>
                </div>
              )}

              {/* LIST OF CREDENTIALS */}
              {credentials.length === 0 && !isAddingCreds ? (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  <p>No provider credentials configured yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {credentials.map((cred) => (
                    <div key={cred.id} className="credential-box" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "16px" }}>
                        <div style={{
                          display: 'inline-block', padding: '6px 14px', borderRadius: '8px',
                          border: '1px solid rgba(139, 92, 246, 0.3)', background: 'rgba(15, 23, 42, 0.9)',
                          color: '#e2e8f0', fontSize: '13px', fontWeight: '600'
                        }}>
                          {cred.provider}
                        </div>
                        <button
                          onClick={() => handleDeleteCreds(cred.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.6 }}
                          title="Delete Credentials"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="api-grid">
                        {/* LIVE KEY */}
                        <div className="api-row">
                          <label>Live Key</label>
                          <input
                            type={showLiveKey === cred.id ? "text" : "password"}
                            value={editField === `key-${cred.id}` ? tempValue : cred.key || ""}
                            readOnly={editField !== `key-${cred.id}`}
                            onChange={(e) => setTempValue(e.target.value)}
                          />
                          <button onClick={() => setShowLiveKey(showLiveKey === cred.id ? null : cred.id)}>
                            {showLiveKey === cred.id ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button onClick={() => handleCopy(cred.key, `key-${cred.id}`)}>
                            {copiedField === `key-${cred.id}` ? "✅" : "📋"}
                          </button>
                          {editField === `key-${cred.id}` ? (
                            <button onClick={() => handleSave(cred.id, cred.provider, "liveKey")}>💾</button>
                          ) : (
                            <button onClick={() => { setEditField(`key-${cred.id}`); setTempValue(cred.key || ""); }}>✏</button>
                          )}
                        </div>

                        {/* LIVE SALT */}
                        <div className="api-row">
                          <label>Live Salt</label>
                          <input
                            type={showLiveSalt === cred.id ? "text" : "password"}
                            value={editField === `salt-${cred.id}` ? tempValue : cred.salt || ""}
                            readOnly={editField !== `salt-${cred.id}`}
                            onChange={(e) => setTempValue(e.target.value)}
                          />
                          <button onClick={() => setShowLiveSalt(showLiveSalt === cred.id ? null : cred.id)}>
                            {showLiveSalt === cred.id ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button onClick={() => handleCopy(cred.salt, `salt-${cred.id}`)}>
                            {copiedField === `salt-${cred.id}` ? "✅" : "📋"}
                          </button>
                          {editField === `salt-${cred.id}` ? (
                            <button onClick={() => handleSave(cred.id, cred.provider, "liveSalt")}>💾</button>
                          ) : (
                            <button onClick={() => { setEditField(`salt-${cred.id}`); setTempValue(cred.salt || ""); }}>✏</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
