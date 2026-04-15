import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, FileText, Trash2, Upload, Eye, RefreshCw, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { getDocuments, uploadDocument, deleteDocument, updateDocument } from "../services/kycService";

export default function KycDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, [id]);

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDocuments(id);
      setDocuments(res?.data || res || []);
    } catch (err) {
      setError(err?.toString() || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e, type = "GENERAL") => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // If document already exists for this type, you might call Update, 
      // but usually upload is used for new ones.
      await uploadDocument(id, type, file);
      alert(`${type} uploaded successfully ✅`);
      fetchDocs();
    } catch (err) {
      alert(err || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(id, docId);
      alert("Document deleted ✅");
      fetchDocs();
    } catch (err) {
      alert(err || "Failed to delete document");
    }
  };

  const handleUpdate = async (docId, type, file) => {
    setUploading(true);
    try {
      await updateDocument(id, type, file);
      alert("Document updated ✅");
      fetchDocs();
    } catch (err) {
      alert(err || "Update failed");
    } finally {
      setUploading(false);
    }
  };

  const getDocIcon = (name) => {
    const ext = name?.split('.').pop().toLowerCase();
    return <FileText size={24} style={{ color: ext === 'pdf' ? '#ef4444' : '#3b82f6' }} />;
  };

  return (
    <div className="analytics-container">
      {/* HEADER SECTION */}
      <div className="header-section" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate("/kyc")} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to KYC
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="title" style={{ fontSize: '2.5rem', textAlign: 'left', margin: 0 }}>Documents</h1>
            <p className="subtitle" style={{ margin: '0' }}>Manage verification files for Merchant #{id}.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="action-btn" onClick={fetchDocs} disabled={loading} style={{ height: '48px', width: '48px' }}>
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <label className="add-btn" style={{ height: '48px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px', cursor: 'pointer' }}>
              <Plus size={18} /> Upload New
              <input type="file" hidden onChange={(e) => handleUpload(e)} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="glass-card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderColor: 'var(--secondary)', background: 'rgba(139, 92, 246, 0.05)' }}>
          <Loader2 className="animate-spin" size={20} />
          <p style={{ margin: 0 }}>Processing document upload...</p>
        </div>
      )}

      {error && (
        <div className="glass-card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginBottom: '24px' }}>
          <AlertCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> {error}
        </div>
      )}

      <div className="widgets-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {loading && documents.length === 0 ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass-card" style={{ height: '180px', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 className="animate-spin" />
            </div>
          ))
        ) : documents.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
             <FileText size={64} style={{ margin: '0 auto 20px', display: 'block' }} />
             <p>No documents uploaded yet.</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="glass-card document-card" style={{ padding: '20px', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--glass-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getDocIcon(doc.name || doc.documentType)}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.name || doc.documentType || 'Unnamed Document'}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '12px' }}>
                    <CheckCircle2 size={12} />
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ID: {doc.id.toString().slice(-8)}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="action-btn" onClick={() => window.open(doc.url || `/api/kyc/${id}/documents/${doc.id}`, '_blank')} title="View">
                    <Eye size={16} />
                  </button>
                  <label className="action-btn" style={{ cursor: 'pointer' }} title="Update">
                    <Upload size={16} />
                    <input type="file" hidden onChange={(e) => handleUpdate(doc.id, doc.documentType, e.target.files[0])} />
                  </label>
                  <button className="action-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(doc.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* QUICK UPLOAD SLOTS (ADHAAR, PAN, etc) */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Required Uploads</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['AADHAAR', 'PAN_CARD', 'BUSINESS_PROOF'].map(type => (
            <label key={type} className="glass-card" style={{ flex: 1, minWidth: '200px', cursor: 'pointer', textAlign: 'center', padding: '24px', borderStyle: 'dashed', borderDashArray: '8' }}>
              <div style={{ color: 'var(--secondary)', marginBottom: '12px' }}><Upload size={24} style={{ margin: '0 auto' }} /></div>
              <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '14px' }}>{type.replace('_', ' ')}</p>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Click to upload file</p>
              <input type="file" hidden onChange={e => handleUpload(e, type)} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
