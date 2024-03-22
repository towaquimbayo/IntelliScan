import { Routes, Route } from "react-router-dom";
import "./css/global.css";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}
