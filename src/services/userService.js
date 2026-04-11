import usersData from "../data/users";

// local DB
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

  // SEARCH
  if (query) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  // FILTER
  filters.forEach((f) => {
    if (f.key === "role") {
      filtered = filtered.filter((u) => u.role === f.value);
    }

    if (f.key === "is_active") {
      const status = f.value === true ? "Active" : "Inactive"; // ✅ FIXED
      filtered = filtered.filter((u) => u.status === status);
    }
  });

  return filtered;
};