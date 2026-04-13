import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Trash2, Eye, CheckCircle } from "lucide-react";

export default function KycDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock state for already uploaded documents
  const [documents, setDocuments] = useState({
    aadhaar: { name: "aadhaar_card.pdf", date: "2024-03-05", size: "1.2 MB", preview: "https://via.placeholder.com/150?text=Aadhaar+Preview" },
    pan: { name: "pan_card.jpg", date: "2024-03-05", size: "0.8 MB", preview: "https://via.placeholder.com/150?text=PAN+Preview" },
    gst: null
  });

  const handleDelete = (type) => {
    if (window.confirm(`Are you sure you want to remove the ${type.toUpperCase()} document?`)) {
      setDocuments({ ...documents, [type]: null });
    }
  };

  const handleUpload = (type, file) => {
    if (file) {
      setDocuments({
        ...documents,
        [type]: {
          name: file.name,
          date: new Date().toISOString().split('T')[0],
          size: (file.size / 1024 / 1024).toFixed(1) + " MB",
          preview: URL.createObjectURL(file)
        }
      });
    }
  };

  return (
    <div className="dash-content animate-fade-in">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate("/kyc")}>
            <ArrowLeft size={16} /> Back to KYC Review
          </button>
          <h1 className="dash-title">Manage KYC Documents</h1>
          <p className="dash-subtitle">Upload and verify legal documentation for merchant ID {id}</p>
        </div>
      </div>

      <div className="documents-grid">
        {['aadhaar', 'pan', 'gst'].map((docType) => {
          const doc = documents[docType];
          return (
            <div key={docType} className="glass-card document-card">
              <div className="section-header">
                <h3>{docType.toUpperCase()} Certificate</h3>
                {doc && <span className="verified-badge"><CheckCircle size={14} /> Uploaded</span>}
              </div>

              {doc ? (
                <div className="doc-preview-container">
                  <div className="doc-preview">
                    {doc.name.endsWith('.pdf') ? (
                      <div className="pdf-placeholder">
                        <FileText size={48} />
                        <span>PDF Document</span>
                      </div>
                    ) : (
                      <img src={doc.preview} alt={docType} />
                    )}
                  </div>
                  
                  <div className="doc-info">
                    <div className="doc-meta">
                      <p className="doc-name">{doc.name}</p>
                      <p className="doc-sub">{doc.size} • Uploaded {doc.date}</p>
                    </div>
                    <div className="doc-actions">
                      <button className="icon-btn-secondary" title="View Full Screen">
                        <Eye size={18} />
                      </button>
                      <button 
                        className="icon-btn-danger" 
                        onClick={() => handleDelete(docType)}
                        title="Delete Document"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <input 
                    type="file" 
                    id={`upload-${docType}`}
                    onChange={(e) => handleUpload(docType, e.target.files[0])}
                    hidden 
                  />
                  <label htmlFor={`upload-${docType}`} className="upload-dropzone">
                    <Upload size={32} />
                    <p>Click to upload or drag & drop</p>
                    <span>SVG, PNG, JPG or PDF (max. 5MB)</span>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="gradient-btn" onClick={() => navigate("/kyc")}>
          Submit for Review
        </button>
      </div>
    </div>
  );
}
