import api from "./api";

/**
 * 🔍 SEARCH USERS
 * Expected Payload: { query: string, filters: array, limit: number, offset: number }
 */
export const searchUsers = async (payload) => {
  try {
    const res = await api.post("users/search", payload);
    return res.data; // Expected { content: [...], totalElements: 100 } or similar
  } catch (error) {
    console.error("searchUsers error:", error);
    throw error.response?.data?.message || "Failed to fetch users";
  }
};

/**
 * ➕ CREATE / UPDATE USER (Upsert)
 * For Create: { name, email, role, password, operation: "create", isActive: true }
 * For Update: { id, name, email, role, operation: "update", isActive: boolean }
 */
export const upsertUser = async (data) => {
  try {
    const res = await api.post("users/upsert", data);
    return res.data;
  } catch (error) {
    console.error("upsertUser error:", error);
    throw error.response?.data?.message || "Failed to save user";
  }
};

/**
 * ❌ DELETE USER
 */
export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`users/${id}`);
    return res.data;
  } catch (error) {
    console.error("deleteUser error:", error);
    throw error.response?.data?.message || "Failed to delete user";
  }
};
