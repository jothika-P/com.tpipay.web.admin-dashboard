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

  // DRAWER STATE
  const [drawer, setDrawer] = useState(null); // "details" | "kyc"
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

  return (
    <div className="kyc-container">
      <h2 className="title">KYC Management</h2>

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
          {data.map((row) => (
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
                        <button
                          className="approve"
                          onClick={() =>
                            updateStatus(row.id, "APPROVED")
                          }
                        >
                          ✔ Approve
                        </button>

                        <button
                          className="reject"
                          onClick={() =>
                            updateStatus(row.id, "REJECTED")
                          }
                        >
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

      {/* ================= RIGHT DRAWER ================= */}
      <div className={`drawer ${drawer ? "open" : ""}`}>

        {/* DETAILS */}
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

        {/* KYC */}
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