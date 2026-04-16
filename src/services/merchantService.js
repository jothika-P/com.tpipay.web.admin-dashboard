import api from "./api";

/**
 * 🔍 SEARCH MERCHANTS
 * Payload: { query: string, filters: array, limit: number, offset: number }
 */
export const searchMerchants = async (payload) => {
  try {
    const res = await api.post("merchants/search", payload);
    return res.data;
  } catch (error) {
    console.error("searchMerchants error:", error);
    throw error.response?.data?.message || "Failed to fetch merchants";
  }
};

/**
 * ➕ CREATE / UPDATE MERCHANT
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

/**
 * 📄 GET KYC DOCUMENTS for a merchant
 * GET /kyc/{kycId}/documents
 */
export const getKycDocuments = async (kycId) => {
  try {
    const res = await api.get(`kyc/${kycId}/documents`);
    return res.data;
  } catch (error) {
    console.error("getKycDocuments error:", error);
    throw error.response?.data?.message || "Failed to fetch KYC documents";
  }
};

/**
 * 📦 DOWNLOAD ALL KYC DOCUMENTS as ZIP
 * GET /kyc/{kycId}/documents/download-zip
 */
export const downloadKycZip = async (kycId) => {
  try {
    const res = await api.get(`kyc/${kycId}/documents/download-zip`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `kyc_documents_${kycId}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("downloadKycZip error:", error);
    throw error.response?.data?.message || "Failed to download ZIP";
  }
};
