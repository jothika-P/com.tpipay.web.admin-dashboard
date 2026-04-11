import React, { useEffect, useState } from "react";
import "../styles/kyc.css";

const initialData = [
  {
    id: 1,
    business: "ABC Traders",
    rm: "Rahul",
    stage: "RM Review",
    status: "PENDING",
  },
  {
    id: 2,
    business: "XYZ Pvt Ltd",
    rm: "Priya",
    stage: "Backend",
    status: "PENDING",
  },
];

export default function Kyc() {
  const [data, setData] = useState(initialData);
  const [openMenu, setOpenMenu] = useState(null);

  /* ================= SEARCH + FILTER ================= */
  const [searchBusiness, setSearchBusiness] = useState("");
  const [searchRM, setSearchRM] = useState("");
  const [rmFilter, setRmFilter] = useState("All");

  /* ================= DRAWER ================= */
  const [drawer, setDrawer] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [files, setFiles] = useState({
    aadhaar: null,
    pan: null,
    gst: null,
  });

  useEffect(() => {
    const handleClick = () => setOpenMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenu(openMenu === id ? null : id);
  };

  const updateStatus = (id, status) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
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
  };

  const submitKyc = () => {
    alert("KYC Submitted Successfully ✅");
    closeDrawer();
    setFiles({ aadhaar: null, pan: null, gst: null });
  };

  /* ================= FILTER LOGIC ================= */
  const rmList = ["All", ...new Set(data.map((d) => d.rm))];

  const filteredData = data.filter((item) => {
    const matchRM =
      rmFilter === "All" || item.rm === rmFilter;

    const matchBusiness =
      item.business
        .toLowerCase()
        .includes(searchBusiness.toLowerCase());

    const matchRMSearch =
      item.rm.toLowerCase().includes(searchRM.toLowerCase());

    return matchRM && matchBusiness && matchRMSearch;
  });

  return (
    <div className="kyc-container">
      <h2 className="title">KYC Management</h2>

      {/* ================= SEARCH + FILTER BAR ================= */}
      <div className="kyc-filters">

        <input
          type="text"
          placeholder="Search business..."
          value={searchBusiness}
          onChange={(e) => setSearchBusiness(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search RM..."
          value={searchRM}
          onChange={(e) => setSearchRM(e.target.value)}
        />

        <select
          value={rmFilter}
          onChange={(e) => setRmFilter(e.target.value)}
        >
          {rmList.map((rm) => (
            <option key={rm} value={rm}>
              {rm}
            </option>
          ))}
        </select>

      </div>

      {/* ================= TABLE ================= */}
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
              <td>
                <span className={`status ${row.status.toLowerCase()}`}>
                  {row.status}
                </span>
              </td>

              <td style={{ position: "relative" }}>
                <button
                  className="action-btn"
                  onClick={(e) => toggleMenu(e, row.id)}
                >
                  ⋮
                </button>

                {openMenu === row.id && (
                  <div className="action-dropdown">
                    <button onClick={() => openDrawer("details", row)}>
                      👁 Details
                    </button>

                    <button onClick={() => openDrawer("kyc", row)}>
                      📄 KYC
                    </button>

                    {row.status === "PENDING" && (
                      <>
                        <button onClick={() => updateStatus(row.id, "APPROVED")}>
                          ✔ Approve
                        </button>

                        <button onClick={() => updateStatus(row.id, "REJECTED")}>
                          ✖ Reject
                        </button>
                      </>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= BACKDROP ================= */}
      {drawer && <div className="backdrop" onClick={closeDrawer}></div>}

      {/* ================= DRAWER ================= */}
      <div className={`drawer ${drawer ? "open" : ""}`}>

        {drawer === "details" && selectedRow && (
          <div>
            <h3>Business Details</h3>
            <p><b>Business:</b> {selectedRow.business}</p>
            <p><b>RM:</b> {selectedRow.rm}</p>
            <p><b>Stage:</b> {selectedRow.stage}</p>
            <p><b>Status:</b> {selectedRow.status}</p>

            <button onClick={closeDrawer}>Close</button>
          </div>
        )}

        {drawer === "kyc" && selectedRow && (
          <div>
            <h3>KYC Upload</h3>

            <label>Aadhaar</label>
            <input
              type="file"
              onChange={(e) =>
                setFiles({ ...files, aadhaar: e.target.files[0] })
              }
            />

            <label>PAN</label>
            <input
              type="file"
              onChange={(e) =>
                setFiles({ ...files, pan: e.target.files[0] })
              }
            />

            <label>GST</label>
            <input
              type="file"
              onChange={(e) =>
                setFiles({ ...files, gst: e.target.files[0] })
              }
            />

            <div className="modal-actions">
              <button onClick={submitKyc}>Submit</button>
              <button onClick={closeDrawer}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}