/**
 * Signup page component.
 * Allows users to create a new account.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { config } from "../config";
import AlertMessage from "../components/AlertMessage";
import messages from "../messages/lang/en/user.json";
import "../css/auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const endpoint = config.url;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  /**
   * Handles the signup form submission.
   * Sends a POST request to the server to create a new user account.
   * @param {Event} e the form submission event
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    if (!name || !email || !password) {
      setErrMsg(messages.emptyFieldError);
      setLoading(false);
      return;
    }

    if (!validateName(name)) {
      setErrMsg(messages.nameLengthError);
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrMsg(messages.invalidEmailError);
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setErrMsg(messages.invalidPasswordError);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoint + "/api/v1/user/register", {
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
        setErrMsg(messages.serverError);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrMsg(messages.serverError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validates that the email address is in the correct format.
   * @param {string} email
   * @returns true if the email is valid, false otherwise
   */
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Validates that the password is at least 6 characters long,
   * contains at least one lowercase letter, one uppercase letter
   * and one number.
   * @param {string} password 
   * @returns true if the password is valid, false otherwise
   */
  function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{3,}$/;
    return re.test(password);
  }

  /**
   * Validates that the name is at least 3 characters long.
   * @param {string} name 
   * @returns true if the name is valid, false otherwise
   */
  function validateName(name) {
    return name.length >= 3;
  }

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
                    src="/amir.jpg"
                    alt="avatar"
                    width={35}
                    height={35}
                    style={{ borderRadius: "50%", marginBottom: "0rem" }}
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
