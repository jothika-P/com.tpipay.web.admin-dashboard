import api from "./api";

/**
 * 🔍 SEARCH MERCHANTS
 * Payload: { query: string, filters: array, limit: number, offset: number }
 */
export const searchMerchants = async (payload) => {
  try {
    const res = await api.post("merchants/search", payload);
    return res.data; // Expected { content: [...], totalElements: 100 }
  } catch (error) {
    console.error("searchMerchants error:", error);
    throw error.response?.data?.message || "Failed to fetch merchants";
  }
};

/**
 * ➕ CREATE / UPDATE MERCHANT
 * payload: { legal_name, business_name, email, contact_number, operation: "create" | "update" }
 */
export const upsertMerchant = async (data) => {
  try {
    const res = await api.post("merchants/upsert", data);
    return res.data;
  } catch (error) {
    console.error("upsertMerchant error:", error);
    throw error.response?.data?.message || "Failed to save merchant";
  }
};

/**
 * ❌ DELETE MERCHANT
 */
export const deleteMerchant = async (id) => {
  try {
    const res = await api.delete(`merchants/${id}`);
    return res.data;
  } catch (error) {
    console.error("deleteMerchant error:", error);
    throw error.response?.data?.message || "Failed to delete merchant";
  }
};
