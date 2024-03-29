import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/actions/UserAction";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { config } from "../config";
import "../css/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const endpoint = config.url;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(endpoint + "/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(true, data.apiCalls, data.isAdmin, data.name));
        setLoading(false);
        navigate("/");
      } else {
        // Handle error case
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login">
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
          <h1>Welcome Back</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Link to="/forgot-password" className="linkAlt">
              Forgot password?
            </Link>
            <Button
              type="submit"
              title="Login"
              loading={loading}
              text="Login"
              full
              customStyle={{ marginTop: "2rem" }}
            />
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
