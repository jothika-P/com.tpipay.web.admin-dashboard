import api from "./api";

// ✅ Overall Platform Analytics
export const getOverallAnalytics = (params) =>
  api.get("/analytics/payments/overall", { params });

// ✅ Merchant Summary
export const getMerchantSummary = (merchantId, params) =>
  api.get(`/analytics/merchants/${merchantId}/summary`, { params });

// ✅ Merchant Payments List
export const getMerchantPayments = (merchantId, params) =>
  api.get(`/analytics/merchants/${merchantId}/payments`, { params });

// ✅ RM Summary
export const getRMSummary = (rmId, params) =>
  api.get(`/analytics/relationship-managers/${rmId}/summary`, { params });

// ✅ Users Search (for filter)
export const searchUsers = (payload) =>
  api.post("/users/search", payload);
