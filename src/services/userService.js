// const BASE_URL = "https://great-dryers-attack.loca.lt"; 

// const getToken = () => localStorage.getItem("token");

// // CREATE / UPDATE USER
// export const upsertUser = async (user, operation) => {
//   const res = await fetch(`${BASE_URL}/users/upsert`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify({
//       ...user,
//       operation,
//     }),
//   });

//   return res.json();
// };

// // DELETE USER
// export const deleteUserApi = async (id) => {
//   await fetch(`${BASE_URL}/users/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
// };

// // SEARCH USERS
// export const searchUsers = async (query, filters) => {
//   const res = await fetch(`${BASE_URL}/users/search`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify({
//       query,
//       filters,
//     }),
//   });

//   return res.json();
// };
// services/userService.js

import usersData from "../data/users";

// make a local copy (acts like DB)
let users = [...usersData];

// CREATE / UPDATE
export const upsertUser = async (user, operation) => {
  if (operation === "create") {
    const newUser = {
      ...user,
      id: Date.now(),
      status: user.is_active ? "Active" : "Inactive",
    };

    users.push(newUser);
  }

  if (operation === "update") {
    users = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.is_active ? "Active" : "Inactive",
          }
        : u
    );
  }

  return { success: true };
};

// DELETE
export const deleteUserApi = async (id) => {
  users = users.filter((u) => u.id !== id);
};

// SEARCH + FILTER
export const searchUsers = async (query, filters) => {
  let filtered = [...users];

  // SEARCH (name/email)
  if (query) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  // FILTERS
  filters.forEach((f) => {
    if (f.key === "role") {
      filtered = filtered.filter((u) => u.role === f.value);
    }

    if (f.key === "is_active") {
      const status = f.value === "true" ? "Active" : "Inactive";
      filtered = filtered.filter((u) => u.status === status);
    }
  });

  return filtered;
};