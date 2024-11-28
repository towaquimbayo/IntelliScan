import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config } from "../config";
import Layout from "../components/Layout";
import { LucideTrash, LucideSquarePen } from "lucide-react";
import "../css/admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const endpoint = config.url;
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const loggedInUserId = useSelector((state) => state.user.id);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
    if (!isAdmin) navigate("/");
  }, [isLoggedIn, isAdmin, navigate]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(endpoint + "/api/v1/protected/users", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error("Fetch users failed:", response);
      }
    } catch (error) {
      console.error("Error during fetch users:", error);
    }
  };

  const handleUserDelete = async (id) => {
    try {
      const response = await fetch(endpoint + `/api/v1/protected/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        fetchUsers();
      } else {
        console.error("Delete user failed:", response);
      }
    } catch (error) {
      console.error("Error during delete user:", error);
    }
  };

  const truncateToken = (token) => {
    if (token.length > 15) {
      return token.slice(0, 15) + "...";
    }
    return token;
  };

  return (
    <Layout title="Admin Dashboard">
      <h1>
        All Users<span className="num-users">{users.length}</span>
      </h1>
      {users.length > 0 && (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th className="token-head">Token</th>
              <th className="date-head">Created Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <div>
                      <span className="user-name">
                        {user.name}
                        {user._id === loggedInUserId && (
                          <span className="logged-in-tag">You</span>
                        )}
                      </span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="role">{user.admin ? "Admin" : "User"}</span>
                </td>
                <td className="token-row">
                  {truncateToken(user?.token || "")}
                </td>
                <td className="date-row">
                  {new Date(user.date).toLocaleDateString()}
                </td>
                <td className="action">
                  <LucideSquarePen
                    className="edit-icon"
                    color="#aaa"
                    size={20}
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                  />
                  {user._id !== loggedInUserId && (
                    <LucideTrash
                      className="delete-icon"
                      color="#aaa"
                      size={20}
                      onClick={() => handleUserDelete(user._id)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
