import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getKycById } from "../services/kycService";

export default function KycDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getKycById(id);
    setMerchant(res.data);
  };

  if (!merchant) return <p>Loading...</p>;

  return (
    <div className="dash-content">
      <button onClick={() => navigate("/kyc")}>Back</button>

      <h2>{merchant.business}</h2>
      <p>Status: {merchant.status}</p>
      <p>Stage: {merchant.stage}</p>
      <p>Email: {merchant.email}</p>
      <p>Phone: {merchant.phone}</p>
    </div>
  );
}
