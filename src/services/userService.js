import api from "./api";

/* 🔍 SEARCH USERS */
export const searchUsers = async (payload) => {
  const res = await api.post("/users/search", payload);
  return res.data;
};

/* ➕ CREATE / UPDATE USER */
export const upsertUser = async (data) => {
  const res = await api.post("/users/upsert", data);
  return res.data;
};

/* ❌ DELETE USER */
export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};
