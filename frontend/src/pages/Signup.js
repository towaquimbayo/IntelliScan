import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { config } from "../config";
import AlertMessage from "../components/AlertMessage";
import "../css/auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const endpoint = config.url;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    if (!name || !email || !password) {
      setErrMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoint + "/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setLoading(false);
        navigate("/login");
      } else {
        const data = await response.json();
        console.error("Signup failed:", data);
        setErrMsg("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Signup">
      <div className="auth-container">
        <div className="auth-illustration">
          <div className="auth-info">
            <Link to="/" className="logo">
              IntelliScan
            </Link>
            <div className="auth-info-head">
              <h1>Chat with your documents in seconds.</h1>
              <p>
                IntelliScan allows you to have conversations with any PDF
                document. Simply upload your file and start asking questions
                right away.
              </p>
            </div>
            <div className="review">
              <p>
                <q>
                  <i>
                    Simply unbelievable! I am really satisfied with the quality
                    of replies from the AI bot. This is absolutely wonderful.
                  </i>
                </q>
              </p>
              <div className="reviewer">
                <div className="avatar">
                  <img
                    src="https://api.dicebear.com/8.x/avataaars/svg?seed=Whiskers"
                    alt="avatar"
                    width={35}
                  />
                </div>
                <div>
                  <p className="name">John Doe</p>
                  <p>Freelancer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-form">
          <h1>Get Started</h1>
          {errMsg && <AlertMessage msg={errMsg} type="error" />}
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                onChange={(e) => {
                  setName(e.target.value);
                  setErrMsg("");
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrMsg("");
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrMsg("");
                }}
              />
            </div>
            <Button
              type="submit"
              title="Sign Up"
              loading={loading}
              text="Sign Up"
              full
              customStyle={{ marginTop: "2rem" }}
            />
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
