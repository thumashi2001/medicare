import { useEffect, useState } from "react";
import adminAPI from "../../api/adminApi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./adminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.get(`/users?search=${search}`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("User fetch error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await adminAPI.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
    }
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
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={user.active ? "status active" : "status inactive"}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="user-actions">
                    <button className="icon-btn edit" type="button">
                      <FiEdit2 />
                    </button>
                    <button
                      className="icon-btn delete"
                      type="button"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}