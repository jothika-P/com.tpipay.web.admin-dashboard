import api from "./api";

/* ================= KYC ================= */

// initiate KYC
export const initiateKyc = (data) =>
  api.post("/kyc/initiate", data);

// get single KYC
export const getKycById = (kycId) =>
  api.get(`/kyc/${kycId}`);

// get KYC by merchant
export const getKycByMerchant = (merchantId) =>
  api.get(`/kyc/merchant/${merchantId}`);

// approve
export const approveKyc = (kycId) =>
  api.post(`/kyc/${kycId}/approve`);

// reject
export const rejectKyc = (kycId) =>
  api.post(`/kyc/${kycId}/reject`);

/* ================= DOCUMENTS ================= */

export const uploadDocument = (kycId, type, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/kyc/${kycId}/documents/${type}`, formData);
};

export const updateDocument = (kycId, type, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.put(`/kyc/${kycId}/documents/${type}`, formData);
};

export const getDocuments = (kycId) =>
  api.get(`/kyc/${kycId}/documents`);

export const getDocumentById = (kycId, docId) =>
  api.get(`/kyc/${kycId}/documents/${docId}`);

export const deleteDocument = (kycId, docId) =>
  api.delete(`/kyc/${kycId}/documents/${docId}`);

export const downloadZip = (kycId) =>
  api.get(`/kyc/${kycId}/documents/download-zip`, {
    responseType: "blob",
  });

/* ================= NOTES ================= */

export const addNote = (kycId, note) =>
  api.post(`/kyc/${kycId}/notes`, { note });

export const getNotes = (kycId) =>
  api.get(`/kyc/${kycId}/notes`);
