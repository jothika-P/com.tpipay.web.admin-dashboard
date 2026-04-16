import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Trash2, Building2, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { searchMerchants, deleteMerchant } from "../services/merchantService";

export default function Merchants() {
  const navigate = useNavigate();

  // --- Data State ---
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Filtering & Pagination ---
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const perPage = 1000;

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        query: searchTerm || "",
        filters: [],
        limit: perPage,
        offset: (page - 1) * perPage,
      };

      const res = await searchMerchants(payload);
      // Backend usually returns { content: [], totalElements: 12 } or just the array
      const data = res?.content || res || [];
      setMerchants(data);
      setTotalElements(res?.totalElements || data.length);
    } catch (err) {
      setError(err?.toString() || "Failed to fetch merchants");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this merchant?")) return;
    try {
      await deleteMerchant(id);
      fetchMerchants();
    } catch (err) {
      alert(err || "Failed to delete merchant");
    }
  };

  const totalPages = Math.ceil(totalElements / perPage);

  return (
    <div className="analytics-container">
      {/* HEADER SECTION */}
      <div className="header-section" style={{ textAlign: 'left', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="title" style={{ fontSize: '1.8rem', textAlign: 'left', margin: 0 }}>Merchants</h1>
          <p className="subtitle" style={{ margin: '0' }}>Monitor and manage onboarded business entities.</p>
        </div>
        <button className="add-btn" onClick={() => navigate("/merchants/create")} style={{ height: '50px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px' }}>
          <Plus size={18} /> Add Merchant
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* SEARCH BAR */}
        <div className="filter-section" style={{ borderRadius: '0', border: 'none', background: 'transparent', marginBottom: '0', padding: '20px 24px' }}>
          <div className="search-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              placeholder="Search by business name or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              style={{ padding: '12px 16px 12px 45px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white' }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div style={{ overflowX: 'auto', padding: '0 24px 24px' }}>
          {error && (
            <div className="glass-card" style={{ borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger)', marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}

          <table className="kyc-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                <th>Business Entity</th>
                <th>Identity</th>
                <th>Contact Email</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && merchants.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Loading merchants...</p>
                  </td>
                </tr>
              ) : merchants.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                    No merchants found matching your search.
                  </td>
                </tr>
              ) : (
                merchants.map((m) => (
                  <tr key={m.id} onClick={() => navigate(`/merchants/view/${m.id}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--glass-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', margin: '0' }}>{m.business_name || "N/A"}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0' }}>{m.legal_name || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>#{m.id}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{m.email || "N/A"}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button className="action-btn" onClick={(e) => { e.stopPropagation(); navigate(`/merchants/view/${m.id}`); }} title="View Details">
                          <Eye size={16} />
                        </button>
                        <button className="action-btn" style={{ color: 'var(--danger)' }} onClick={(e) => handleDelete(e, m.id)} title="Delete Merchant">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '10px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, totalElements)} of {totalElements} merchants
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="action-btn" style={{ background: page === 1 ? 'transparent' : 'var(--glass-hover)', opacity: page === 1 ? 0.5 : 1 }}>
                <ChevronLeft size={20} />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="action-btn" style={{ background: page >= totalPages ? 'transparent' : 'var(--glass-hover)', opacity: page >= totalPages ? 0.5 : 1 }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
