import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "../config";
import Layout from "../components/Layout";
import Button from "../components/Button";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const endpoint = config.url;
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
    if (!isAdmin) navigate("/");
    fetchUser();
  }, [isLoggedIn, isAdmin, navigate]);

  const fetchUser = async () => {
    try {
      const response = await fetch(endpoint + "/api/protected/users", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const user = data.users.find((user) => user._id === id);
        setUser(user);
      } else {
        console.error("Fetch users failed:", response);
      }
    } catch (error) {
      console.error("Error during fetch users:", error);
    }
  }

  const handleUserEdit = async (e, id) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(endpoint + `/api/protected/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setLoading(false);
        navigate("/admin");
      } else {
        const data = await response.json();
        console.error("Edit user failed:", data);
      }
    } catch (error) {
      console.error("Error during edit user:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Edit User">
      <h1>Edit User</h1>
      {user ? (
        <form onSubmit={(e) => handleUserEdit(e, user._id)} className="edit-user-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={user.admin ? "admin" : "user"}
              onChange={(e) =>
                setUser({ ...user, admin: e.target.value === "admin" })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="apiCalls">API Calls</label>
            <input
              type="number"
              id="apiCalls"
              value={user.api_calls}
              onChange={(e) => setUser({ ...user, api_calls: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            title="Edit"
            loading={loading}
            text="Edit"
            customStyle={{ paddingInline: "2rem" }}
          />
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
}
