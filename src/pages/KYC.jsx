import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Upload, Download, PlusCircle, FileText, Check, X } from "lucide-react";

import {
  getKycByMerchant,
  approveKyc,
  rejectKyc,
  addNote,
  getNotes,
  downloadZip,
} from "../services/kycService";

export default function Kyc() {
  const [data, setData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const [searchBusiness, setSearchBusiness] = useState("");
  const [searchRM, setSearchRM] = useState("");

  const [drawer, setDrawer] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [noteText, setNoteText] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchKyc();
  }, []);

  const fetchKyc = async () => {
    try {
      // ⚠️ replace with real API if you have list API
      const res = await getKycByMerchant("");
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ACTIONS ================= */

  const updateStatus = async (id, status) => {
    try {
      if (status === "APPROVED") {
        await approveKyc(id);
      } else {
        await rejectKyc(id);
      }
      fetchKyc();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async () => {
    try {
      await addNote(selectedRow.id, noteText);
      alert("Note Added ✅");
      closeDrawer();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadZip = async (row) => {
    const res = await downloadZip(row.id);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "kyc-documents.zip";
    link.click();
  };

  /* ================= FILTER ================= */

  const filteredData = data.filter((item) =>
    item.business?.toLowerCase().includes(searchBusiness.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="kyc-container">
      <div className="kyc-card">

        <div className="kyc-header">
          <h2>KYC Management</h2>
        </div>

        <div className="users-filters">
          <input
            placeholder="Search business..."
            value={searchBusiness}
            onChange={(e) => setSearchBusiness(e.target.value)}
          />
        </div>

        <table className="kyc-table">
          <thead>
            <tr>
              <th>Business</th>
              <th>RM</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td>{row.business}</td>
                <td>{row.rm}</td>
                <td>{row.stage}</td>
                <td>{row.status}</td>

                <td>
                  <button onClick={() => navigate(`/kyc/details/${row.id}`)}>
                    <Eye size={16} />
                  </button>

                  <button onClick={() => navigate(`/kyc/documents/${row.id}`)}>
                    <Upload size={16} />
                  </button>

                  <button onClick={() => handleDownloadZip(row)}>
                    <Download size={16} />
                  </button>

                  <button onClick={() => updateStatus(row.id, "APPROVED")}>
                    <Check size={16} />
                  </button>

                  <button onClick={() => updateStatus(row.id, "REJECTED")}>
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
