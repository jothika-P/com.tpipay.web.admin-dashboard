import { useState, useEffect } from "react";
import "../styles/table.css";
import {
  upsertUser,
  deleteUserApi,
  searchUsers,
} from "../services/userService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const [confirmBox, setConfirmBox] = useState({
    show: false,
    type: "",
    message: "",
    user: null,
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "ADMIN",
    status: "Active",
  });

  // FETCH USERS
  const fetchUsers = async () => {
    const data = await searchUsers("", []);
    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // SEARCH
  useEffect(() => {
    handleSearch();
  }, [search, roleFilter, statusFilter]);

  const handleSearch = async () => {
    const filters = [];

    if (roleFilter) {
      filters.push({ key: "role", value: roleFilter });
    }

    if (statusFilter) {
      filters.push({
        key: "is_active",
        value: statusFilter === "Active" ? "true" : "false",
      });
    }

    const data = await searchUsers(search, filters);
    setUsers(data || []);
  };

  // CREATE
  const createUser = async () => {
    await upsertUser(
      {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        is_active: newUser.status === "Active",
      },
      "create"
    );

    fetchUsers();
    setShowModal(false);
  };

  // CONFIRM ACTION
  const confirmAction = async () => {
    const u = confirmBox.user;

    if (confirmBox.type === "delete") {
      await deleteUserApi(u.id);
    }

    if (confirmBox.type === "status") {
      await upsertUser(
        {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          is_active: u.status !== "Active",
        },
        "update"
      );
    }

    if (confirmBox.type === "edit") {
      await upsertUser(
        {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          is_active: u.status === "Active",
        },
        "update"
      );
    }

    fetchUsers();
    setConfirmBox({ show: false });
    setEditUser(null);
  };

  const roles = [...new Set(users.map((u) => u.role))];

  return (
    <div className="users-page">

      {/* TOP BAR */}
      <div className="top-bar">
        <button className="create-btn" onClick={() => setShowModal(true)}>
          + Create User
        </button>

        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {roles.map((r, i) => (
            <option key={i}>{r}</option>
          ))}
        </select>

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>

              <td>
                <span
                  className={
                    u.status === "Active"
                      ? "status active"
                      : "status inactive"
                  }
                >
                  {u.status}
                </span>
              </td>

              <td className="actions">
                <i onClick={() => setViewUser(u)}>👁</i>

                <i onClick={() => setEditUser(u)}>✏️</i>

                <i
                  onClick={() =>
                    setConfirmBox({
                      show: true,
                      type: "delete",
                      message: "Are you sure you want to delete this user?",
                      user: u,
                    })
                  }
                >
                  🗑
                </i>

                <i
                  className={
                    u.status === "Active"
                      ? "toggle-active"
                      : "toggle-inactive"
                  }
                  onClick={() =>
                    setConfirmBox({
                      show: true,
                      type: "status",
                      message: "Do you want to change user status?",
                      user: u,
                    })
                  }
                >
                  ⏻
                </i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* VIEW */}
      {viewUser && (
        <div className="modal">
          <div className="view-box">
            <h3>User Details</h3>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Role:</b> {viewUser.role}</p>
            <p><b>Status:</b> {viewUser.status}</p>
            <button onClick={() => setViewUser(null)}>Close</button>
          </div>
        </div>
      )}

      {/* CREATE */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Create User</h3>

            <input
              placeholder="Name"
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <select
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option>ADMIN</option>
              <option>RELATIONSHIP_MANAGER</option>
              <option>BACKEND_AGENT</option>
            </select>

            <select
              onChange={(e) =>
                setNewUser({ ...newUser, status: e.target.value })
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={createUser}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT */}
      {editUser && (
        <div className="modal">
          <div className="modal-box">
            <h3>Edit User</h3>

            <input
              value={editUser.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
            />

            <input
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />

            <div className="modal-footer">
              <button onClick={() => setEditUser(null)}>Cancel</button>
              <button
                onClick={() =>
                  setConfirmBox({
                    show: true,
                    type: "edit",
                    message: "Save changes to this user?",
                    user: editUser,
                  })
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM BOX */}
      {confirmBox.show && (
        <div className="modal">
          <div className="confirm-box small">
            <p>{confirmBox.message}</p>

            <div className="confirm-actions">
              <button onClick={() => setConfirmBox({ show: false })}>
                Cancel
              </button>
              <button className="danger" onClick={confirmAction}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;