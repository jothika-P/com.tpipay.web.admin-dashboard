import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Eye, MoreVertical } from "lucide-react";

const initialMerchants = [
  { id: "M-1001", name: "Rahul Sharma", business: "Sharma Electronics", gst: "27AAAAA0000A1Z5", pan: "ABCDE1234F", added: "2024-03-10" },
  { id: "M-1002", name: "Anjali Gupta", business: "Gupta Fashion", gst: "27BBBBB1111B1Z6", pan: "FGHIJ5678K", added: "2024-03-12" },
  { id: "M-1003", name: "Vikram Malhotra", business: "Malhotra Logics", gst: "27CCCCC2222C1Z7", pan: "KLMNO9012P", added: "2024-03-15" },
];

export default function Merchants() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredMerchants = initialMerchants.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dash-content animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="dash-title">Merchant Management</h1>
          <p className="dash-subtitle">Manage and onboard your business partners.</p>
        </div>
        <button 
          className="gradient-btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => navigate("/merchants/create")}
        >
          <Plus size={18} />
          Create Merchant
        </button>
      </div>

      <div className="glass-card" style={{ padding: "0" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: 'flex', gap: '16px' }}>
          <div className="search-wrapper" style={{ position: 'relative', flex: 1 }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} 
            />
            <input 
              type="text" 
              placeholder="Search by name, business or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="premium-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Merchant Name</th>
                <th>Business Name</th>
                <th>GST Number</th>
                <th>Added Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMerchants.length > 0 ? (
                filteredMerchants.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: '600', color: '#8b5cf6' }}>{m.id}</td>
                    <td>{m.name}</td>
                    <td>{m.business}</td>
                    <td style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{m.gst}</td>
                    <td style={{ color: '#94a3b8' }}>{m.added}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="icon-btn-view"
                        onClick={() => navigate(`/merchants/view/${m.id}`)}
                        title="View Details"
                      >
                        <Eye size={18} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No merchants found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
