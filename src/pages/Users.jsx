import React, { useEffect, useState } from "react";
import "../styles/users.css";

const initialUsers = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: i % 2 === 0 ? "Rahul" : "Priya",
  email: `user${i + 1}@gmail.com`,
  role: i % 2 === 0 ? "ADMIN" : "MANAGER",
  status: i % 2 === 0 ? "Active" : "Inactive",
}));

export default function Users() {
  const [users, setUsers] = useState(initialUsers);

  const [openMenu, setOpenMenu] = useState(null);

  const [drawer, setDrawer] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  /* ================= FILTER STATES ================= */
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ================= ADD USER ================= */
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "ADMIN",
    status: "Active",
  });

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    const close = () => setOpenMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

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

  const updateStatus = (id, status) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status } : u))
    );
    setOpenMenu(null);
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setOpenMenu(null);
  };

  const saveEdit = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? selectedUser : u
      )
    );
    closeDrawer();
  };

  const addUser = () => {
    const user = {
      id: Date.now(),
      ...newUser,
    };

    setUsers((prev) => [user, ...prev]);

    setNewUser({
      name: "",
      email: "",
      role: "ADMIN",
      status: "Active",
    });

    setShowAdd(false);
  };

  /* ================= FILTER LOGIC ================= */
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === "all" ? true : u.role === roleFilter;

    const matchStatus =
      statusFilter === "all" ? true : u.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / perPage);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="users-container">

      <div className="users-card">

        {/* HEADER */}
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

        {/* FILTER BAR */}
        <div className="users-filters">

          <input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>

        {/* TABLE */}
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

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
                  <button
                    className="action-btn"
                    onClick={(e) => toggleMenu(e, u.id)}
                  >
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

                      <button onClick={() => deleteUser(u.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span>
            Page {page} / {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* BACKDROP */}
      {drawer && <div className="backdrop" onClick={closeDrawer}></div>}

      {/* VIEW / EDIT DRAWER */}
      <div className={`drawer ${drawer ? "open" : ""}`}>
        {drawer === "view" && selectedUser && (
          <div>
            <h3>User Details</h3>
            <p><b>Name:</b> {selectedUser.name}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Role:</b> {selectedUser.role}</p>
            <p><b>Status:</b> {selectedUser.status}</p>
            <button onClick={closeDrawer}>Close</button>
          </div>
        )}

        {drawer === "edit" && selectedUser && (
          <div>
            <h3>Edit User</h3>

            <input
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
            />

            <input
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />

            <select
              value={selectedUser.role}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
            >
              <option>ADMIN</option>
              <option>MANAGER</option>
            </select>

            <div className="modal-actions">
              <button onClick={saveEdit}>Save</button>
              <button onClick={closeDrawer}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* ADD USER MODAL */}
      {showAdd && (
        <>
          <div className="backdrop" onClick={() => setShowAdd(false)}></div>

          <div className="drawer open">
            <h3>Add User</h3>

            <input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option>ADMIN</option>
              <option>MANAGER</option>
            </select>

            <select
              value={newUser.status}
              onChange={(e) =>
                setNewUser({ ...newUser, status: e.target.value })
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setShowAdd(false)}>Cancel</button>
              <button onClick={addUser} className="primary">
                Create
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}