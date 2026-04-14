import api from "./api";

/* 🔍 SEARCH MERCHANTS */
export const searchMerchants = async (payload) => {
  const res = await api.post("/merchants/search", payload);
  return res.data;
};

/* ➕ CREATE / UPDATE MERCHANT */
export const upsertMerchant = async (data) => {
  const res = await api.post("/merchants/upsert", data);
  return res.data;
};

/* ❌ DELETE MERCHANT */
export const deleteMerchant = async (id) => {
  await api.delete(`/merchants/${id}`);
};
