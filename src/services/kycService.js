import api from "./api";

/**
 * 🔍 KYC RETRIEVAL
 */
export const getKycById = async (kycId) => {
  try {
    const res = await api.get(`kyc/${kycId}`);
    return res.data;
  } catch (err) {
    console.error("getKycById error:", err);
    throw err.response?.data?.message || "Failed to fetch KYC details";
  }
};

export const getKycByMerchant = async (merchantId) => {
  try {
    const url = merchantId ? `kyc/merchant/${merchantId}` : `kyc`;
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("getKycByMerchant error:", err);
    throw err.response?.data?.message || "Failed to fetch KYC list";
  }
};

/**
 * ✅ ACTIONS
 */
export const approveKyc = async (kycId) => {
  try {
    const res = await api.post(`kyc/${kycId}/approve`);
    return res.data;
  } catch (err) {
    console.error("approveKyc error:", err);
    throw err.response?.data?.message || "Failed to approve KYC";
  }
};

export const rejectKyc = async (kycId) => {
  try {
    const res = await api.post(`kyc/${kycId}/reject`);
    return res.data;
  } catch (err) {
    console.error("rejectKyc error:", err);
    throw err.response?.data?.message || "Failed to reject KYC";
  }
};

/**
 * 📂 DOCUMENTS
 */
export const getDocuments = async (kycId) => {
  try {
    const res = await api.get(`kyc/${kycId}/documents`);
    return res.data;
  } catch (err) {
    console.error("getDocuments error:", err);
    throw err.response?.data?.message || "Failed to fetch documents";
  }
};

export const uploadDocument = async (kycId, type, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`kyc/${kycId}/documents/${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (err) {
    console.error("uploadDocument error:", err);
    throw err.response?.data?.message || "Failed to upload document";
  }
};

export const updateDocument = async (kycId, type, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.put(`kyc/${kycId}/documents/${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (err) {
    console.error("updateDocument error:", err);
    throw err.response?.data?.message || "Failed to update document";
  }
};

export const deleteDocument = async (kycId, docId) => {
  try {
    const res = await api.delete(`kyc/${kycId}/documents/${docId}`);
    return res.data;
  } catch (err) {
    console.error("deleteDocument error:", err);
    throw err.response?.data?.message || "Failed to delete document";
  }
};

export const downloadZip = async (kycId) => {
  try {
    const res = await api.get(`kyc/${kycId}/documents/download-zip`, {
      responseType: "blob",
    });
    return res;
  } catch (err) {
    console.error("downloadZip error:", err);
    throw "Failed to download documents zip";
  }
};

/**
 * 📝 NOTES
 */
export const getNotes = async (kycId) => {
  try {
    const res = await api.get(`kyc/${kycId}/notes`);
    return res.data;
  } catch (err) {
    console.error("getNotes error:", err);
    throw err.response?.data?.message || "Failed to fetch notes";
  }
};

export const addNote = async (kycId, note) => {
  try {
    const res = await api.post(`kyc/${kycId}/notes`, { note });
    return res.data;
  } catch (err) {
    console.error("addNote error:", err);
    throw err.response?.data?.message || "Failed to add note";
  }
};
