import api from "./api";

/**
 * 📊 OVERALL PLATFORM ANALYTICS
 */
export const getOverallAnalytics = async (params) => {
  try {
    const res = await api.get("analytics/payments/overall", { params });
    return res.data;
  } catch (err) {
    console.error("getOverallAnalytics error:", err);
    throw err.response?.data?.message || "Failed to fetch overall analytics";
  }
};

/**
 * 🏪 MERCHANT SPECIFIC ANALYTICS
 */
export const getMerchantSummary = async (merchantId, params) => {
  try {
    const res = await api.get(`analytics/merchants/${merchantId}/summary`, { params });
    return res.data;
  } catch (err) {
    console.error("getMerchantSummary error:", err);
    throw err.response?.data?.message || `Failed to fetch summary for merchant ${merchantId}`;
  }
};

export const getMerchantPayments = async (merchantId, params) => {
  try {
    const res = await api.get(`analytics/merchants/${merchantId}/payments`, { params });
    return res.data;
  } catch (err) {
    console.error("getMerchantPayments error:", err);
    throw err.response?.data?.message || `Failed to fetch payments for merchant ${merchantId}`;
  }
};

/**
 * 🧑‍💼 RM SPECIFIC ANALYTICS
 */
export const getRMSummary = async (rmId, params) => {
  try {
    const res = await api.get(`analytics/relationship-managers/${rmId}/summary`, { params });
    return res.data;
  } catch (err) {
    console.error("getRMSummary error:", err);
    throw err.response?.data?.message || `Failed to fetch summary for RM ${rmId}`;
  }
};

/**
 * 🔍 USER SEARCH (Used to populate RM filters)
 */
export const searchUsers = async (payload) => {
  try {
    const res = await api.post("users/search", payload);
    return res.data;
  } catch (err) {
    console.error("searchUsers error:", err);
    throw err.response?.data?.message || "Failed to load relationship managers";
  }
};
export const getMerchantCounts = async (rmId) => {
  try {
    const res = await api.get("analytics/merchants/counts", {
      params: rmId ? { rmId } : {}
    });
    return res.data;
  } catch (err) {
    console.error("getMerchantCounts error:", err);
    throw err.response?.data?.message || "Failed to fetch merchant counts";
  }
};
