import React, { useEffect, useRef, useState } from "react";
import "../styles/kyc.css";
import { getKycList, uploadKycDocument } from "../services/kycService";
import { MoreHorizontal } from "lucide-react";

const KYC = () => {
  const [data, setData] = useState([]);

  const [searchBusiness, setSearchBusiness] = useState("");
  const [searchRM, setSearchRM] = useState("");
  const [rmFilter, setRmFilter] = useState("All");

  const [menuOpen, setMenuOpen] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [kycData, setKycData] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    getKycList().then(setData);
  }, []);

  // OUTSIDE CLICK CLOSE MENU
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rmList = ["All", ...new Set(data.map((d) => d.rm))];

  const filtered = data.filter((item) => {
    const matchRM = rmFilter === "All" || item.rm === rmFilter;

    const matchBusiness = item.business
      .toLowerCase()
      .includes(searchBusiness.toLowerCase());

    const matchRMSearch = item.rm
      .toLowerCase()
      .includes(searchRM.toLowerCase());

    return matchRM && matchBusiness && matchRMSearch;
  });

  const handleStatusChange = (id, status) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const handleUpload = async (id, type, file) => {
    const res = await uploadKycDocument(id, type, file);

    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              docs: {
                ...item.docs,
                [type]: res.fileUrl,
              },
            }
          : item
      )
    );
  };

  const handleDeleteDoc = (id, type) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              docs: {
                ...item.docs,
                [type]: null,
              },
            }
          : item
      )
    );
  };

  return (
    <div className="kyc-container">
      <h2>KYC Management</h2>

      {/* FILTERS */}
      <div className="filters">

        <input
          placeholder="Search Business..."
          value={searchBusiness}
          onChange={(e) => setSearchBusiness(e.target.value)}
        />

        <input
          placeholder="Search RM..."
          value={searchRM}
          onChange={(e) => setSearchRM(e.target.value)}
        />

        {/* ✅ RM COMBOBOX FILTER */}
        <div className="rm-combobox">
          <input
            className="rm-input"
            placeholder="Filter by RM..."
            value={rmFilter === "All" ? "" : rmFilter}
            onChange={(e) =>
              setRmFilter(e.target.value === "" ? "All" : e.target.value)
            }
            list="rm-list"
          />

          <datalist id="rm-list">
            {rmList.map((rm, i) => (
              <option key={i} value={rm} />
            ))}
          </datalist>
        </div>
      </div>

      {/* TABLE */}
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
          {filtered.map((row) => (
            <tr key={row.id}>
              <td>{row.business}</td>
              <td>{row.rm}</td>
              <td>{row.stage}</td>

              <td>
                <span className={`status ${row.status?.toLowerCase()}`}>
                  {row.status}
                </span>
              </td>

              {/* ACTION */}
              <td>
                <div className="menu-wrapper" ref={menuRef}>
                  <div
                    className="icon"
                    onClick={() =>
                      setMenuOpen(menuOpen === row.id ? null : row.id)
                    }
                  >
                    <MoreHorizontal />
                  </div>

                  {menuOpen === row.id && (
                    <div className="dropdown">
                      <div
                        onClick={() => {
                          setViewData(row);
                          setMenuOpen(null);
                        }}
                      >
                        Details
                      </div>

                      <div
                        onClick={() => {
                          setKycData(row);
                          setMenuOpen(null);
                        }}
                      >
                        KYC
                      </div>

                      <div
                        onClick={() => {
                          handleStatusChange(row.id, "APPROVED");
                          setMenuOpen(null);
                        }}
                      >
                        Approve
                      </div>

                      <div
                        onClick={() => {
                          handleStatusChange(row.id, "REJECTED");
                          setMenuOpen(null);
                        }}
                      >
                        Reject
                      </div>

                      <div
                        onClick={() => {
                          alert("Delete clicked");
                          setMenuOpen(null);
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DETAILS MODAL */}
      {viewData && (
        <div className="modal">
          <div className="modal-box">
            <h3>Business Details</h3>
            <p><b>Business:</b> {viewData.business}</p>
            <p><b>RM:</b> {viewData.rm}</p>
            <p><b>Stage:</b> {viewData.stage}</p>
            <p><b>Status:</b> {viewData.status}</p>

            <button onClick={() => setViewData(null)}>Close</button>
          </div>
        </div>
      )}

      {/* KYC MODAL */}
      {kycData && (
        <div className="modal">
          <div className="modal-box">
            <h3>KYC Documents</h3>

            {["aadhaar", "pan", "gst"].map((doc) => (
              <div className="doc-row" key={doc}>
                <span>{doc.toUpperCase()}</span>

                {kycData.docs?.[doc] ? (
                  <>
                    <button onClick={() => window.open(kycData.docs[doc])}>
                      View
                    </button>
                    <button onClick={() => handleDeleteDoc(kycData.id, doc)}>
                      Delete
                    </button>
                  </>
                ) : (
                  <input
                    type="file"
                    onChange={(e) =>
                      handleUpload(kycData.id, doc, e.target.files[0])
                    }
                  />
                )}
              </div>
            ))}

            <button onClick={() => setKycData(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYC;