import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Eye, Upload, Download, PlusCircle, FileText, Check, X } from "lucide-react";

/**
 * KYC PAGE - ACTION DROPDOWN VISIBILITY FIX
 * All 7 actions are hardcoded and have explicit visibility settings.
 */

const initialData = [
  {
    id: 1,
    business: "ABC Traders",
    rm: "Rahul",
    stage: "RM Review",
    status: "PENDING",
    notes: [],
  },
  {
    id: 2,
    business: "XYZ Pvt Ltd",
    rm: "Priya",
    stage: "Backend",
    status: "PENDING",
    notes: [],
  },
];

export default function Kyc() {
  const [data, setData] = useState(initialData);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const [searchBusiness, setSearchBusiness] = useState("");
  const [searchRM, setSearchRM] = useState("");
  const [rmFilter, setRmFilter] = useState("All");

  const [drawer, setDrawer] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [noteText, setNoteText] = useState("");

  const role = (localStorage.getItem("role") || "ADMIN").toUpperCase();

  useEffect(() => {
    const close = () => setOpenMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenu(openMenu === id ? null : id);
  };

  const updateStatus = (id, status) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setOpenMenu(null);
  };

  const openDrawer = (type, row) => {
    setSelectedRow(row);
    setDrawer(type);
    setOpenMenu(null);
  };

  const closeDrawer = () => {
    setDrawer(null);
    setSelectedRow(null);
    setNoteText("");
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const newNote = {
      role: role,
      name: "System User",
      date: new Date().toLocaleString(),
      note: noteText,
    };
    setData((prev) =>
      prev.map((item) =>
        item.id === selectedRow.id ? { ...item, notes: [...item.notes, newNote] } : item
      )
    );
    setNoteText("");
    alert("Note Added ✅");
    closeDrawer();
  };

  const downloadZip = (row) => alert(`Downloading ZIP for ${row.business} 📦`);

  const rmList = ["All", ...new Set(data.map((d) => d.rm))];

  const filteredData = data.filter((item) => {
    const matchRM = rmFilter === "All" || item.rm === rmFilter;
    const matchBusiness = item.business.toLowerCase().includes(searchBusiness.toLowerCase());
    const matchRMSearch = item.rm.toLowerCase().includes(searchRM.toLowerCase());
    return matchRM && matchBusiness && matchRMSearch;
  });

  return (
    <div className="kyc-container" style={{ paddingBottom: '250px' }}> {/* ENHANCED: Page level padding */}
      <div className="kyc-card" style={{ overflow: 'visible', marginBottom: '100px' }}> {/* ENHANCED: Card level visibility */}
        
        {/* HEADER */}
        <div className="kyc-header">
          <h2>KYC Management</h2>
          <div className="header-right">
            <span className="kyc-count">{filteredData.length} records</span>
          </div>
        </div>

        {/* FILTERS */}
        <div className="users-filters">
          <input
            placeholder="Search business..."
            value={searchBusiness}
            onChange={(e) => setSearchBusiness(e.target.value)}
          />
          <input
            placeholder="Search RM..."
            value={searchRM}
            onChange={(e) => setSearchRM(e.target.value)}
          />
          <select value={rmFilter} onChange={(e) => setRmFilter(e.target.value)}>
            {rmList.map((rm) => <option key={rm} value={rm}>{rm}</option>)}
          </select>
        </div>

        {/* TABLE WRAPPER - CRITICAL FIX FOR DROPDOWN CLIPPING */}
        <div style={{ position: 'relative', overflow: 'visible', minHeight: '300px' }}>
          <table className="kyc-table" style={{ overflow: 'visible' }}>
            <thead>
              <tr>
                <th>Business</th>
                <th>RM</th>
                <th>Stage</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '40px' }}>Action</th>
              </tr>
            </thead>

            <tbody style={{ overflow: 'visible' }}>
              {filteredData.map((row) => (
                <tr key={row.id} style={{ position: 'relative', zIndex: openMenu === row.id ? 100 : 1 }}>
                  <td>{row.business}</td>
                  <td>{row.rm}</td>
                  <td>{row.stage}</td>
                  <td>
                    <span className={`status ${row.status.toLowerCase()}`}>{row.status}</span>
                  </td>

                  <td className="action-cell" style={{ textAlign: 'right', paddingRight: '30px' }}>
                    <button className="action-btn" onClick={(e) => toggleMenu(e, row.id)}>⋮</button>

                    {openMenu === row.id && (
                      <div className="action-dropdown" style={{ 
                        position: 'absolute',
                        top: '100%',
                        right: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '220px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        zIndex: 99999,
                        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                        padding: '8px 0',
                        margin: '5px 0'
                      }}>
                        <button onClick={() => navigate(`/kyc/details/${row.id}`)} style={dropdownBtnStyle}>
                          <Eye size={16} color="#94a3b8" /> Details
                        </button>

                        <button onClick={() => navigate(`/kyc/documents/${row.id}`)} style={dropdownBtnStyle}>
                          <Upload size={16} color="#94a3b8" /> KYC Upload
                        </button>

                        <button onClick={() => downloadZip(row)} style={dropdownBtnStyle}>
                          <Download size={16} color="#94a3b8" /> Download ZIP
                        </button>

                        <div style={dividerStyle}></div>

                        <button onClick={() => openDrawer("addNote", row)} style={dropdownBtnStyle}>
                          <PlusCircle size={16} color="#94a3b8" /> Add Note
                        </button>

                        <button onClick={() => openDrawer("viewNotes", row)} style={dropdownBtnStyle}>
                          <FileText size={16} color="#94a3b8" /> View Notes
                        </button>

                        <div style={dividerStyle}></div>

                        <button onClick={() => updateStatus(row.id, "APPROVED")} style={{ ...dropdownBtnStyle, color: '#4ade80' }}>
                          <Check size={16} /> Approve
                        </button>

                        <button onClick={() => updateStatus(row.id, "REJECTED")} style={{ ...dropdownBtnStyle, color: '#f87171' }}>
                          <X size={16} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER & BACKDROP */}
      {drawer && <div className="backdrop" onClick={closeDrawer} style={{ zIndex: 100000 }}></div>}
      <div className={`drawer ${drawer ? "open" : ""}`} style={{ 
        position: 'fixed', right: drawer ? 0 : '-420px', top: 0, height: '100vh', width: '420px',
        background: '#0f172a', borderLeft: '1px solid #334155', zIndex: 100001, padding: '30px',
        transition: 'right 0.3s ease'
      }}>
        {drawer === "addNote" && selectedRow && (
          <div>
            <h3>Add Review Note</h3>
            <textarea
              placeholder="Enter internal review notes..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              style={{ 
                width: '100%', height: '150px', background: '#1e293b', border: '1px solid #334155',
                color: 'white', padding: '15px', borderRadius: '10px', marginTop: '20px', outline: 'none'
              }}
            />
            <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <button className="primary" onClick={addNote} style={{ flex: 1, padding: '12px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Save Note</button>
              <button onClick={closeDrawer} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px' }}>Cancel</button>
            </div>
          </div>
        )}
        {drawer === "viewNotes" && selectedRow && (
          <div>
            <h3>Review History</h3>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {selectedRow.notes.length === 0 ? <p style={{ color: '#64748b' }}>No notes available.</p> : 
                selectedRow.notes.map((n, i) => (
                  <div key={i} style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8b5cf6', marginBottom: '5px' }}>
                      <strong>{n.role}</strong>
                      <span>{n.date}</span>
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: '1.4' }}>{n.note}</p>
                  </div>
                ))}
            </div>
            <button onClick={closeDrawer} style={{ width: '100%', marginTop: '30px', padding: '12px', background: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '8px' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

const dropdownBtnStyle = {
  width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
  background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', textAlign: 'left',
  fontSize: '14px'
};

const dividerStyle = {
  height: '1px', background: '#334155', margin: '5px 16px'
};
