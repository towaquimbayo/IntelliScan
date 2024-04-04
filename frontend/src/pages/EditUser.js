import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "../config";
import Layout from "../components/Layout";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import "../css/editUser.css";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const endpoint = config.url;
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const [user, setUser] = useState(null);
  const [apiInfo, setApiInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
    if (!isAdmin) navigate("/");
  }, [isLoggedIn, isAdmin, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(endpoint + "/api/v1/protected/users", {
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
    fetchUser();
  }, [id, endpoint]);

  useEffect(() => {
    const fetchApiInfo = async () => {
      try {
        const response = await fetch(endpoint + `/api/v1/protected/api-info/${id}`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setApiInfo(data.api);
        } else {
          console.error("Fetch API info failed:", response);
        }
      } catch (error) {
        console.error("Error during fetch API info:", error);
      }
    };
    fetchApiInfo();
  }, [id, endpoint]);

  const handleUserEdit = async (e, id) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    if (!user.name || !user.email || !(user.api_calls >= 0)) {
      setErrMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoint + `/api/v1/protected/users/${id}`, {
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
        setErrMsg(
          data.message ||
          "An unexpected error occurred. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error during edit user:", error);
      setErrMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Edit User">
      <h1>Edit User</h1>
      <div className="edit-user-container">
        <div className="edit-user-form">
          {user ? (
            <div>
              {errMsg && <AlertMessage msg={errMsg} type="error" />}
              <form onSubmit={(e) => handleUserEdit(e, user._id)} className="edit-user-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={user.name}
                    onChange={(e) => {
                      setUser({ ...user, name: e.target.value });
                      setErrMsg("");
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    onChange={(e) => {
                      setUser({ ...user, email: e.target.value });
                      setErrMsg("");
                    }}
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
                <Button
                  type="submit"
                  title="Edit"
                  loading={loading}
                  text="Edit"
                  customStyle={{ paddingInline: "2rem" }}
                />
              </form>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="api-table-container">
          <table className="user-table api-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Calls</th>
              </tr>
            </thead>
            <tbody>
              {apiInfo.map((info, index) => (
                <tr key={index}>
                  <td>{info.method}</td>
                  <td>{info.endpoint}</td>
                  <td>{info.requests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
