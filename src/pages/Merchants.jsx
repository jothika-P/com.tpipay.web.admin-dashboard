import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye } from "lucide-react";
import { searchMerchants } from "../services/merchantService";

export default function Merchants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [merchants, setMerchants] = useState([]);
  const navigate = useNavigate();

  const fetchMerchants = async () => {
    try {
      const res = await searchMerchants({
        query: searchTerm,
        filters: [],
      });
      setMerchants(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [searchTerm]);

  return (
    <div className="dash-content">
      <h1>Merchant Management</h1>

      <button onClick={() => navigate("/merchants/create")}>
        <Plus size={18} /> Create
      </button>

      <input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Business</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {merchants.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.legal_name}</td>
              <td>{m.business_name}</td>
              <td>{m.email}</td>
              <td>
                <button onClick={() => navigate(`/merchants/view/${m.id}`)}>
                  <Eye size={16} /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
