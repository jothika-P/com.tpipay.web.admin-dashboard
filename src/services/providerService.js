import api from "./api";

/**
 * 🔍 FETCH PROVIDER CREDENTIALS for a merchant
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
 * ➕ CREATE / UPDATE PROVIDER CREDENTIAL
 */
export const upsertProviderCredential = async (data) => {
  try {
    const res = await api.post("merchant-provider-credentials/upsert", data);
    return res.data;
  } catch (error) {
    console.error("upsertProviderCredential error:", error);
    throw error.response?.data?.message || "Failed to save credential";
  }
};

/**
 * ❌ DELETE PROVIDER CREDENTIAL
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
