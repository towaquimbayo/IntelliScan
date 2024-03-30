import { Routes, Route } from "react-router-dom";
import "./css/global.css";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import EditUser from "./pages/EditUser";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="admin/users/:id" element={<EditUser />} />
    </Routes>
  );
}
