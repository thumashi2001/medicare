import { useEffect, useMemo, useState } from "react";
import adminAPI from "../../api/adminApi";
import { FiTrash2 } from "react-icons/fi";
import "./adminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("User fetch error:", error);
      setMessage("Failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((user) => {
      const name = (user.name || user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const role = (user.role || "").toLowerCase();
      return name.includes(keyword) || email.includes(keyword) || role.includes(keyword);
    });
  }, [users, search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;
    try {
      await adminAPI.delete(`/users/${id}`);
      setMessage("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      setMessage("Failed to delete user.");
    }
  };

  const getStatus = (user) => {
    if (user.role === "doctor") return user.isVerified ? "Verified" : "Pending";
    return "Active";
  };

  const getStatusClass = (user) => {
    if (user.role === "doctor") return user.isVerified ? "status verified" : "status pending";
    return "status active";
  };

  return (
    <div className="admin-users-page">
      <div className="users-header">
        <div>
          <h2>User Management</h2>
          <p>Manage patient and admin accounts</p>
        </div>
        <button type="button" className="add-user-btn">+ Add User</button>
      </div>

      <div className="users-toolbar">
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {message && <p className="users-message">{message}</p>}

      <div className="users-table-card">
        <table className="users-table">
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || user.fullName || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={getStatusClass(user)}>{getStatus(user)}</span>
                  </td>
                  <td className="user-actions">
                    <button
                      className="icon-btn delete"
                      type="button"
                      onClick={() => handleDelete(user._id)}
                      title="Delete User"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
