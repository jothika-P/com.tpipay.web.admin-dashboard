import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Upload, Download, PlusCircle, FileText, Check, X, Loader2, MessageSquare, Search, Filter } from "lucide-react";

import {
  approveKyc,
  rejectKyc,
  addNote,
  getNotes,
  downloadZip,
} from "../services/kycService";
import { searchMerchants } from "../services/merchantService";

export default function Kyc() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- FILTERS ---
  const [searchBusiness, setSearchBusiness] = useState("");
  const [searchRM, setSearchRM] = useState("");
  const [rmFilter, setRmFilter] = useState("All"); // mapped to status in payload as per request

  // --- UI STATE ---
  const [drawer, setDrawer] = useState(null); // 'add-note' | 'view-notes'
  const [businessSuggestions, setBusinessSuggestions] = useState([]);
  const [rmSuggestions, setRmSuggestions] = useState([]);
  const [showBusinessSuggestions, setShowBusinessSuggestions] = useState(false);
  const [showRmSuggestions, setShowRmSuggestions] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  // ✅ BUSINESS SUGGESTIONS
  useEffect(() => {
    if (!searchBusiness.trim()) {
      setBusinessSuggestions([]);
      return;
    }
    const filtered = data.filter((item) =>
      (item.business_name || item.legal_name || "").toLowerCase().includes(searchBusiness.toLowerCase())
    );
    // remove duplicates
    const unique = Array.from(new Set(filtered.map(a => a.business_name || a.legal_name)))
     .map(name => filtered.find(a => (a.business_name || a.legal_name) === name));
    setBusinessSuggestions(unique);
  }, [searchBusiness, data]);

  // ✅ RM SUGGESTIONS
  useEffect(() => {
    if (!searchRM.trim()) {
      setRmSuggestions([]);
      return;
    }
    const filtered = data.filter((item) =>
      (item.rm_name || item.rm || "").toLowerCase().includes(searchRM.toLowerCase())
    );
    // remove duplicates
    const unique = Array.from(new Set(filtered.map(a => a.rm_name || a.rm)))
     .map(name => filtered.find(a => (a.rm_name || a.rm) === name));
    setRmSuggestions(unique);
  }, [searchRM, data]);

  /* ================= FETCH DATA (BACKEND SEARCH) ================= */
const fetchKycData = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const role = localStorage.getItem("role"); // 👈 IMPORTANT
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    let payload = {
      query: searchBusiness,
      status: rmFilter !== "All" ? rmFilter : null
    };

    // ✅ ROLE BASED FILTERING
    if (role === "RELATIONSHIP_MANAGER") {
      payload.rm = user?.name || user?.username; // 👈 only own merchants
    }

    if (role === "LEGAL_TEAM") {
      payload.status = "LEGAL_TEAM_PENDING"; // 👈 only legal stage
    }

    const res = await searchMerchants(payload);

    const merchants = res?.content || res || [];

    setData(merchants);
  } catch (err) {
    console.error("KYC FETCH ERROR:", err);
    setError(err?.toString() || "Failed to fetch KYC records");
  } finally {
    setLoading(false);
  }
}, [searchBusiness, searchRM, rmFilter]);


  /* ================= ACTIONS ================= */
  const updateStatus = async (kycId, status) => {
    if (!window.confirm(`Are you sure you want to change status to ${status}?`)) return;
    try {
      if (status === "APPROVED") {
        await approveKyc(kycId);
      } else {
        await rejectKyc(kycId);
      }
      alert(`KYC ${status} ✅`);
      fetchKycData();
    } catch (err) {
      alert(err || "Failed to update status");
    }
  };

  const formatDate = (dateString, showTime = false) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      if (showTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }
      return date.toLocaleDateString('en-IN', options);
    } catch (e) {
      return dateString;
    }
  };

  const handleOpenNotes = async (row) => {
    setSelectedRow(row);
    setDrawer("view-notes");
    setNotesLoading(true);
    try {
      const res = await getNotes(row.kyc_id || row.id);
      setNotesList(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await addNote(selectedRow.kyc_id || selectedRow.id, noteText);
      alert("Note Added ✅");
      setNoteText("");
      setDrawer(null);
    } catch (err) {
      alert(err || "Failed to add note");
    }
  };

  const handleDownloadZip = async (row) => {
    try {
      const targetId = row.kyc_id || row.id;
      const res = await downloadZip(targetId);
      
      // Basic check if we got a valid blob
      if (res.data.size < 100) {
        throw new Error("Download failed: File might be empty or unavailable.");
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `kyc-docs-${targetId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Download Error:", err);
      const msg = typeof err === 'string' ? err : (err.message || "Failed to download ZIP archive");
      alert(msg);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="kyc-container">
      <div className="kyc-card" style={{ padding: '24px' }}>
        <div className="kyc-header" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>KYC Compliance</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Search and manage merchant verification workflows.</p>
        </div>

        {/* FILTERS SECTION */}
        <div className="users-filters" style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px' }}>
          <div className="search-box" style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} />
            <input
              placeholder="Search business..."
              value={searchBusiness}
              onChange={(e) => {
                setSearchBusiness(e.target.value);
                setShowBusinessSuggestions(true);
              }}
              onFocus={() => setShowBusinessSuggestions(true)}
              onBlur={() => setTimeout(() => setShowBusinessSuggestions(false), 200)}
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '12px' }}
            />
            {showBusinessSuggestions && businessSuggestions.length > 0 && (
              <div className="suggestions-box">
                {businessSuggestions.map((item, idx) => {
                  const bName = item.business_name || item.legal_name || "N/A";
                  return (
                    <div
                      key={`biz-${idx}`}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchBusiness(bName);
                        setShowBusinessSuggestions(false);
                      }}
                    >
                      {bName}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="search-box" style={{ position: 'relative', width: '100%' }}>
            <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} />
            <input
              placeholder="Search RM..."
              value={searchRM}
              onChange={(e) => {
                setSearchRM(e.target.value);
                setShowRmSuggestions(true);
              }}
              onFocus={() => setShowRmSuggestions(true)}
              onBlur={() => setTimeout(() => setShowRmSuggestions(false), 200)}
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '12px' }}
            />
            {showRmSuggestions && rmSuggestions.length > 0 && (
              <div className="suggestions-box">
                {rmSuggestions.map((item, idx) => {
                  const rName = item.rm_name || item.rm || "N/A";
                  return (
                    <div
                      key={`rm-${idx}`}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchRM(rName);
                        setShowRmSuggestions(false);
                      }}
                    >
                      {rName}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <select 
            value={rmFilter} 
            onChange={(e) => setRmFilter(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
          >
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button className="action-btn" onClick={fetchKycData} title="Refresh">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {error && (
          <div className="glass-card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* TABLE SECTION */}
        <div style={{ overflowX: 'auto' }}>
          <table className="kyc-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Business Entity</th>
                <th>RM Name</th>
                <th>KYC Stage</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px' }}>
                    <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    No matching compliance records found.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <p style={{ fontWeight: '600', margin: 0 }}>{row.business_name || row.legal_name || "N/A"}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>MID: #{row.id}</p>
                    </td>
                    <td>{row.relationship_manager_name || row.rm || "Not Assigned"}</td>
                    <td>
                      <span className="badge" style={{ background: 'var(--glass-hover)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
                        {row.kyc_stage || "SUBMITTED"}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        {/* <button className="action-btn" onClick={() => navigate(`/kyc/details/${row.kyc_id || row.id}`)} title="View Detail">
                          <Eye size={16} />
                        </button> */}
                        <button className="action-btn" onClick={() => navigate(`/kyc/documents/${row.kyc_id || row.id}`)} title="Documents">
                          <FileText size={16} />
                        </button>
                        <button className="action-btn" onClick={() => handleOpenNotes(row)} title="View Logs">
                          <MessageSquare size={16} />
                        </button>
                        <button className="action-btn" onClick={() => { setSelectedRow(row); setDrawer('add-note'); }} title="Add Note">
                          <PlusCircle size={16} />
                        </button>
                        <button className="action-btn" onClick={() => handleDownloadZip(row)} title="Download ZIP">
                          <Download size={16} />
                        </button>
                        <button className="action-btn" style={{ color: 'var(--success)' }} onClick={() => updateStatus(row.kyc_id || row.id, "APPROVED")} title="Approve">
                          <Check size={16} />
                        </button>
                        <button className="action-btn" style={{ color: 'var(--danger)' }} onClick={() => updateStatus(row.kyc_id || row.id, "REJECTED")} title="Reject">
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTES DRAWER */}
      {drawer && (
        <div className="modal-overlay" onClick={() => setDrawer(null)}>
          <div className="small-dialog" onClick={e => e.stopPropagation()} style={{ width: '450px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>{drawer === 'add-note' ? 'Add KYC Note' : 'Compliance Audit Logs'}</h2>
            
            {drawer === 'add-note' ? (
              <>
                <textarea 
                  placeholder="Enter observations or requirements..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  style={{ 
                    width: '100%', 
                    height: '120px', 
                    padding: '12px', 
                    margin: '16px 0', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid var(--glass-border)',
                    color: '#ffffff' // 👈 added this
                  }}
                />

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={handleAddNote} className="add-btn" style={{ flex: 1, justifyContent: 'center' }}>Save Note</button>
                  <button onClick={() => setDrawer(null)} style={{ flex: 1, background: 'var(--glass-hover)', borderRadius: '12px', color: 'white' }}>Cancel</button>
                </div>
              </>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px' }}>
                {notesLoading ? <Loader2 className="animate-spin" style={{ margin: '20px auto', display: 'block' }} /> : 
                 notesList.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>No audit logs found for this merchant.</p> :
                 notesList.map((n, i) => (
                   <div key={i} style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '8px' }}>
                     <p style={{ margin: 0, fontSize: '14px' }}>{n.note}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{n.createdBy || "Compliance Officer"}</span>
                        <span>{formatDate(n.createdAt || n.created_at, true)}</span>
                      </p>
                   </div>
                 ))
                }
                <button onClick={() => setDrawer(null)} style={{ width: '100%', marginTop: '20px', background: 'var(--glass-hover)', borderRadius: '12px', height: '45px', border: '1px solid var(--glass-border)', color: 'white' }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for spinning Refresh icon
const RefreshCw = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
);
