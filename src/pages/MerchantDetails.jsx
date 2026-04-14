import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { searchMerchants } from "../services/merchantService";

export default function MerchantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await searchMerchants({
        query: id,
        filters: [],
      });

      setMerchant(res[0]);
    };

    fetchData();
  }, [id]);

  if (!merchant) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate("/merchants")}>Back</button>

      <h2>{merchant.business_name}</h2>
      <p>{merchant.legal_name}</p>
      <p>{merchant.email}</p>
      <p>{merchant.kyc_stage}</p>
    </div>
  );
}
