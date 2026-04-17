import api from "./api";

/**
 * 🔑 GET MERCHANT PROVIDER CREDENTIALS
 * GET /merchant-provider-credentials/{merchantId}
 */
export const getMerchantProviderCredentials = async (merchantId) => {
  try {
    const res = await api.get(`merchant-provider-credentials/${merchantId}`);
    return res.data;
  } catch (error) {
    console.error("getMerchantProviderCredentials error:", error);
    throw error.response?.data?.message || "Failed to fetch merchant credentials";
  }
};

/**
 * ➕ CREATE MERCHANT PROVIDER CREDENTIAL
 * POST /merchant-provider-credentials
 */
export const createMerchantProviderCredential = async (data) => {
  try {
    const res = await api.post("merchant-provider-credentials", data);
    return res.data;
  } catch (error) {
    console.error("createMerchantProviderCredential error:", error);
    throw error.response?.data?.message || "Failed to create merchant credential";
  }
};

/**
 * 📝 UPDATE MERCHANT PROVIDER CREDENTIAL
 * PUT /merchant-provider-credentials/{id}
 */
export const updateMerchantProviderCredential = async (id, data) => {
  try {
    const res = await api.put(`merchant-provider-credentials/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("updateMerchantProviderCredential error:", error);
    throw error.response?.data?.message || "Failed to update merchant credential";
  }
};

/**
 * ❌ DELETE MERCHANT PROVIDER CREDENTIAL
 * DELETE /merchant-provider-credentials/{id}
 */
export const deleteMerchantProviderCredential = async (id) => {
  try {
    const res = await api.delete(`merchant-provider-credentials/${id}`);
    return res.data;
  } catch (error) {
    console.error("deleteMerchantProviderCredential error:", error);
    throw error.response?.data?.message || "Failed to delete merchant credential";
  }
};
