import React, { useEffect, useState } from "react";
import {
  searchUsers,
  upsertUser,
  deleteUserApi,
} from "../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);

  const [openMenu, setOpenMenu] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "ADMIN",
    status: "Active",
  });

  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    const close = () => setOpenMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    const filters = [];

    if (roleFilter !== "all") {
      filters.push({
        key: "role",
        value: roleFilter,
        operator: "=",
      });
    }

    if (statusFilter !== "all") {
      filters.push({
        key: "is_active",
        value: statusFilter === "Active" ? "true" : "false",
        operator: "=",
      });
    }

    const body = {
      query: search,
      filters,
      limit: perPage,
      offset: (page - 1) * perPage,
    };

    try {
      const res = await searchUsers(body);

      const formatted = (res?.content || res || []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.is_active ? "Active" : "Inactive",
      }));

      setUsers(formatted);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, page]);

  /* ================= ACTIONS ================= */
  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenu(openMenu === id ? null : id);
  };

  const openDrawer = (type, user) => {
    setSelectedUser({ ...user });
    setDrawer(type);
    setOpenMenu(null);
  };

  const closeDrawer = () => {
    setDrawer(null);
    setSelectedUser(null);
  };

  const updateStatus = async (id, status) => {
    await upsertUser({
      id,
      operation: "update",
      is_active: status === "Active",
    });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await deleteUserApi(id);
    fetchUsers();
  };

  const saveEdit = async () => {
    await upsertUser({
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
      operation: "update",
    });

    closeDrawer();
    fetchUsers();
  };

  const addUser = async () => {
    await upsertUser({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      operation: "create",
      is_active: newUser.status === "Active",
    });

    setNewUser({
      name: "",
      email: "",
      role: "ADMIN",
      status: "Active",
    });

    setShowAdd(false);
    fetchUsers();
  };

  const filteredUsers = users;
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers;

  return (
    <div className="users-container">
      <div className="users-card">
        <div className="users-header">
          <h2>User Management</h2>

          <div className="header-right">
            <span className="users-count">
              {filteredUsers.length} users
            </span>

            <button className="add-btn" onClick={() => setShowAdd(true)}>
              + Add User
            </button>
          </div>
        </div>

        <div className="users-filters">
          <input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="RELATIONSHIP_MANAGER">RELATIONSHIP_MANAGER</option>
            <option value="BACKEND_AGENT">BACKEND_AGENT</option>
            <option value="LEGAL_TEAM">LEGAL_TEAM</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <table className="users-table">
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span className={`status ${u.status.toLowerCase()}`}>
                    {u.status}
                  </span>
                </td>

                <td className="action-cell">
                  <button className="action-btn" onClick={(e) => toggleMenu(e, u.id)}>
                    ⋮
                  </button>

                  {openMenu === u.id && (
                    <div className="action-dropdown">
                      <button onClick={() => openDrawer("view", u)}>View</button>
                      <button onClick={() => openDrawer("edit", u)}>Edit</button>

                      <button
                        onClick={() =>
                          updateStatus(
                            u.id,
                            u.status === "Active" ? "Inactive" : "Active"
                          )
                        }
                      >
                        Toggle
                      </button>

                      <button onClick={() => deleteUser(u.id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span>Page {page} / {totalPages || 1}</span>

          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
