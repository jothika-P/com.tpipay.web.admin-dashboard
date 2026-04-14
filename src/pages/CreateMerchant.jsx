import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { upsertMerchant } from "../services/merchantService";

export default function CreateMerchant() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    legal_name: "",
    business_name: "",
    email: "",
    contact_number: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await upsertMerchant({
        ...formData,
        operation: "create",
      });

      navigate("/merchants");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Legal Name"
        onChange={(e) =>
          setFormData({ ...formData, legal_name: e.target.value })
        }
      />

      <input
        placeholder="Business Name"
        onChange={(e) =>
          setFormData({ ...formData, business_name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        onChange={(e) =>
          setFormData({ ...formData, contact_number: e.target.value })
        }
      />

      <button type="submit">Create Merchant</button>
    </form>
  );
}
