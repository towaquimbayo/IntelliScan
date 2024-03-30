import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config } from "../config";
import Layout from "../components/Layout";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const endpoint = config.url;
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdmin = useSelector((state) => state.user.isAdmin);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
    if (!isAdmin) navigate("/");
  }, [isLoggedIn, isAdmin, navigate]);

  const fetchUsers = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(endpoint + "/api/protected/users", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Fetch users failed:", response);
      }
    } catch (error) {
      console.error("Error during fetch users:", error);
    }
  }

  return (
    <Layout title="Admin Dashboard">
      <h1>Admin Dashboard</h1>
      {isAdmin && (
        <button onClick={fetchUsers}>Test endpoint</button>
      )}
    </Layout>
  );
}
