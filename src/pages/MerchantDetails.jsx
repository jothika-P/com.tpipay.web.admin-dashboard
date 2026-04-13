import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, User, FileText, Calendar, ShieldCheck, Download, CheckCircle, Eye } from "lucide-react";

export default function MerchantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data fetching based on ID
  const merchant = {
    id: id || "M-1001",
    name: "Rahul Sharma",
    business: "Sharma Electronics",
    gst: "27AAAAA0000A1Z5",
    pan: "ABCDE1234F",
    doi: "2020-05-15",
    status: "Active",
    added: "2024-03-10",
    documents: [
      { id: 1, type: "GST Certificate", name: "gst_cert_sharma.pdf", size: "1.2 MB" },
      { id: 2, type: "PAN Card", name: "pan_card_sharma.jpg", size: "0.8 MB" },
      { id: 3, type: "Business License", name: "trade_license.pdf", size: "2.1 MB" },
      { id: 4, type: "Address Proof", name: "utility_bill.png", size: "1.5 MB" }
    ]
  };

  const handleDownloadAll = () => {
    alert("Downloading all merchant documents in ZIP format... 📦");
  };

  return (
    <div className="dash-content animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate("/merchants")} style={{ marginBottom: '12px' }}>
            <ArrowLeft size={16} /> Back to Merchants
          </button>
          <h1 className="dash-title">Merchant Details</h1>
          <p className="dash-subtitle">Viewing comprehensive information for {merchant.business}</p>
        </div>
        <div className="status-badge active">
          <ShieldCheck size={16} /> Verified
        </div>
      </div>

      <div className="details-grid">
        {/* BUSINESS IDENTITY */}
        <div className="glass-card main-info">
          <div className="section-header">
            <h3><Building2 size={18} /> Business Identity</h3>
          </div>
          
          <div className="info-rows" style={{ marginTop: '20px' }}>
            <div className="info-row">
              <div className="info-details">
                <label>Business Name</label>
                <p>{merchant.business}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-details">
                <label>Merchant Name</label>
                <p>{merchant.name}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-details">
                <label>Date of Incorporation</label>
                <p>{merchant.doi}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TAX & COMPLIANCE */}
        <div className="glass-card tax-info">
          <div className="section-header">
            <h3><FileText size={18} /> Tax & Compliance</h3>
          </div>
          
          <div className="info-rows" style={{ marginTop: '20px' }}>
            <div className="info-row">
              <div className="info-details">
                <label>GST Number</label>
                <p style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{merchant.gst}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-details">
                <label>PAN Number</label>
                <p style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{merchant.pan}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-details">
                <label>Onboarding Date</label>
                <p>{merchant.added}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPLOADED DOCUMENTS CARD */}
      <div className="glass-card" style={{ marginTop: '32px' }}>
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <h3><FileText size={18} /> Uploaded Merchant Documents</h3>
        </div>

        <div className="documents-list-grid" style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' 
        }}>
          {merchant.documents.map((doc) => (
            <div key={doc.id} className="document-card-mini" style={{
              background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>{doc.type}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.name} • {doc.size}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="icon-btn-secondary" title="View Document" style={{ padding: '6px' }}><Eye size={16} /></button>
                <button className="icon-btn-secondary" title="Download" style={{ padding: '6px' }}><Download size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOWNLOAD ALL FOOTER BUTTON */}
      <div style={{ 
        marginTop: '40px', display: 'flex', justifyContent: 'center' 
      }}>
        <button 
          className="gradient-btn" 
          onClick={handleDownloadAll}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 40px', fontSize: '16px' 
          }}
        >
          <Download size={20} /> Download All Documents (ZIP)
        </button>
      </div>
    </div>
  );
}
