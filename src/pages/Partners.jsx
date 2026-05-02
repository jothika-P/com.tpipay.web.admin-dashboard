import React, { useEffect, useState, useCallback } from "react";
import {
  searchUsers,
  upsertUser,
  deleteUser,
} from "../services/userService";
import { Handshake, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight, Loader2, Eye, UserPlus } from "lucide-react";

export default function Partners() {
  // --- Data State ---
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Filter/Pagination State ---
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const perPage = 25;

  // --- UI State (Drawer/Dropdown) ---
  const [drawerMode, setDrawerMode] = useState(null); // 'add' | 'edit' | 'view' | null
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "PARTNER", // Hardcoded for Partners page
    password: "", // Only for Create
    isActive: true,
  });

  // --- Fetch Logic ---
  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError(null);

    const filters = [{ key: "role", value: "PARTNER", operator: "=" }];
    
    const payload = {
      query: search,
      filters: filters,
      limit: perPage,
      offset: (page - 1) * perPage,
    };

    try {
      const res = await searchUsers(payload);
      const data = res?.content || res || [];
      setPartners(data);
      setTotalElements(res?.totalElements || (data.length === perPage ? (page * perPage + 1) : (page - 1) * perPage + data.length));
    } catch (err) {
      setError(err?.toString() || "Failed to load partners");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // --- Actions ---
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      role: "PARTNER",
      password: "",
      isActive: true,
    });
    setDrawerMode("add");
  };

  const handleOpenEdit = (partner) => {
    setFormData({
      id: partner.id,
      name: partner.name,
      email: partner.email,
      role: "PARTNER",
      isActive: partner.isActive,
      partnerReferralCode: partner.partnerReferralCode,
    });
    setDrawerMode("edit");
  };

  const handleOpenView = (partner) => {
    setFormData({
      id: partner.id,
      name: partner.name,
      email: partner.email,
      role: "PARTNER",
      isActive: partner.isActive,
      partnerReferralCode: partner.partnerReferralCode,
    });
    setDrawerMode("view");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        operation: drawerMode === "add" ? "create" : "update",
      };
      await upsertUser(payload);
      setDrawerMode(null);
      fetchPartners();
    } catch (err) {
      alert(err || "Failed to save partner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return;
    try {
      await deleteUser(id);
      fetchPartners();
    } catch (err) {
      alert(err || "Failed to delete partner");
    }
  };

  const totalPages = Math.ceil(totalElements / perPage);

  return (
    <div className="analytics-container">
      {/* HEADER SECTION */}
      <div className="header-section" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h1 className="title" style={{ fontSize: '1.8rem', textAlign: 'left' }}>Partner Management</h1>
        <p className="subtitle" style={{ margin: '0' }}>Manage strategic partners and their platform access.</p>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* FILTERS & SEARCH */}
        <div className="filter-section" style={{ borderRadius: '0', border: 'none', background: 'transparent', marginBottom: '0' }}>
          <div className="filter-box" style={{ gridTemplateColumns: '2fr auto' }}>
            <div className="search-wrapper" style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                placeholder="Search partners by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ paddingLeft: '45px', width: '100%' }}
              />
            </div>

            <button className="add-btn" onClick={handleOpenAdd} style={{ height: '50px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={18} /> Add Partner
            </button>
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
                <th>Partner Detail</th>
                <th>Referral Code</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && partners.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Fetching platform partners...</p>
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                    No partners found matching your search.
                  </td>
                </tr>
              ) : (
                partners.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--glass-hover)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--secondary)' }}>
                          {p.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', margin: '0' }}>{p.name}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0' }}>{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <code style={{ background: 'var(--glass-hover)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>
                        {p.partnerReferralCode || "N/A"}
                      </code>
                    </td>
                    <td>
                      <span className={`status ${p.isActive ? 'approved' : 'rejected'}`} style={{ textTransform: 'uppercase', fontSize: '11px' }}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button className="action-btn" onClick={() => handleOpenView(p)} title="View Details">
                          <Eye size={16} />
                        </button>
                        <button className="action-btn" onClick={() => handleOpenEdit(p)} title="Edit Partner">
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p.id)} title="Delete Partner">
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
              Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, totalElements)} of {totalElements} partners
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="action-btn" style={{ background: page === 1 ? 'transparent' : 'var(--glass-hover)', opacity: page === 1 ? 0.5 : 1 }}>
                <ChevronLeft size={20} />
              </button>
              <button 
                disabled={partners.length < perPage && totalElements <= page * perPage} 
                onClick={() => setPage(page + 1)} 
                className="action-btn" 
                style={{ background: (partners.length < perPage && totalElements <= page * perPage) ? 'transparent' : 'var(--glass-hover)', opacity: (partners.length < perPage && totalElements <= page * perPage) ? 0.5 : 1 }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER OVERLAY */}
      {drawerMode && (
        <div className="modal-overlay" onClick={() => setDrawerMode(null)}>
          <div className="small-dialog" onClick={(e) => e.stopPropagation()} style={{ width: '450px', background: 'var(--dark-bg)', border: '1px solid var(--glass-border)', boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>
                {drawerMode === 'add' ? 'Create Partner' : drawerMode === 'edit' ? 'Edit Partner Details' : 'Partner Profile Details'}
              </h2>
              <button onClick={() => setDrawerMode(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Partner Name</label>
                <input
                  required
                  readOnly={drawerMode === 'view'}
                  placeholder="e.g. Acme Solutions"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', color: drawerMode === 'view' ? 'var(--text-muted)' : 'white', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Email Address</label>
                <input
                  required
                  readOnly={drawerMode === 'view'}
                  type="email"
                  placeholder="contact@partner.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', color: drawerMode === 'view' ? 'var(--text-muted)' : 'white', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                />
              </div>

              {(drawerMode === 'view' || drawerMode === 'edit') && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Referral Code</label>
                  <input
                    readOnly
                    value={formData.partnerReferralCode || "N/A"}
                    style={{ width: '100%', padding: '12px 16px', color: 'var(--primary)', fontWeight: 'bold', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Status</label>
                <select
                  disabled={drawerMode === 'view'}
                  value={formData.isActive ? "Active" : "Inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "Active" })}
                  style={{ width: '100%', padding: '12px 16px', color: drawerMode === 'view' ? 'var(--text-muted)' : 'black', borderRadius: '12px', background: 'white', border: '1px solid #ccc' }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {drawerMode === 'add' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Temporary Password</label>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', color: 'white', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                  />
                </div>
              )}

              <div style={{ marginTop: '2rem', display: 'flex', gap: '12px' }}>
                {drawerMode !== 'view' ? (
                  <>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="add-btn"
                      style={{ flex: 2, justifyContent: 'center', height: '50px' }}
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : (drawerMode === 'add' ? 'Create Partner' : 'Update Partner')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerMode(null)}
                      style={{ flex: 1, background: 'var(--glass-hover)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '12px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDrawerMode(null)}
                    className="add-btn"
                    style={{ flex: 1, justifyContent: 'center', height: '50px' }}
                  >
                    Close Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
