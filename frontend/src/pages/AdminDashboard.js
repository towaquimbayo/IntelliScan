import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  return (
    <Layout title="Admin Dashboard">
      <h1>Admin Dashboard</h1>
    </Layout>
  );
}
