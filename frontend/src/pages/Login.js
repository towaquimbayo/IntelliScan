/**
 * Login page component.
 */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/actions/UserAction";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { config } from "../config";
import "../css/auth.css";
import AlertMessage from "../components/AlertMessage";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const endpoint = config.url;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  /**
   * Handles the login form submission.
   * @param {*} e the form submission event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    if (!email || !password) {
      setErrMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoint + "/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(true, data.id, data.apiCalls, data.isAdmin, data.name));
        setLoading(false);
        navigate("/");
      } else {
        const data = await response.json();
        console.error("Login failed:", data);
        setErrMsg(
          data.message ||
          "An unexpected error occurred. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrMsg("An unexpected error occurred. Please try again later.");
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
                    src="/amir.jpg"
                    alt="avatar"
                    width={35}
                    height={35}
                    style={{ borderRadius: "50%"}}
                  />
                </div>
                <div>
                  <p className="name">Amir Amintabar</p>
                  <p>Localization Lead at Microsoft</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-form">
          <h1>Welcome Back!</h1>
          {errMsg && <AlertMessage msg={errMsg} type="error" />}
          <form onSubmit={handleLogin}>
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
