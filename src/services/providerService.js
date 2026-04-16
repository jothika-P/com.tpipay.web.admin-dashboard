import api from "./api";

/**
 * 🔍 FETCH PROVIDER CREDENTIALS for a merchant
 * GET /merchant-provider-credentials/{merchantId}
 */
export const getProviderCredentials = async (merchantId) => {
  try {
    const res = await api.get(`merchant-provider-credentials/${merchantId}`);
    return res.data;
  } catch (error) {
    console.error("getProviderCredentials error:", error);
    throw error.response?.data?.message || "Failed to fetch provider credentials";
  }
};

/**
 * ➕ CREATE PROVIDER CREDENTIAL
 * POST /merchant-provider-credentials
 */
export const createProviderCredential = async (data) => {
  try {
    const res = await api.post("merchant-provider-credentials", data);
    return res.data;
  } catch (error) {
    console.error("createProviderCredential error:", error);
    throw error.response?.data?.message || "Failed to create credential";
  }
};

/**
 * 📝 UPDATE PROVIDER CREDENTIAL
 * PUT /merchant-provider-credentials/{id}
 */
export const updateProviderCredential = async (id, data) => {
  try {
    const res = await api.put(`merchant-provider-credentials/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("updateProviderCredential error:", error);
    throw error.response?.data?.message || "Failed to update credential";
  }
};

/**
 * ❌ DELETE PROVIDER CREDENTIAL
 * DELETE /merchant-provider-credentials/{id}
 */
export const deleteProviderCredential = async (id) => {
  try {
    const res = await api.delete(`merchant-provider-credentials/${id}`);
    return res.data;
  } catch (error) {
    console.error("deleteProviderCredential error:", error);
    throw error.response?.data?.message || "Failed to delete credential";
  }
};
