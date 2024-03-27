import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AlertMessage from "../components/AlertMessage";
import Button from "../components/Button";
import "../css/forgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [successMsg, setSuccessMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  function pageHeader(heading, subheading) {
    return (
      <div className="pageHeader">
        <h1>{heading}</h1>
        <p>{subheading}</p>
      </div>
    );
  }

  return (
    <Layout title="Forgot Password">
      <div className="container">
        {pageHeader(
          "Forgot Password",
          "Enter your email address to reset your password."
        )}
        {successMsg && <AlertMessage msg={successMsg} type="success" />}
        {infoMsg && <AlertMessage msg={infoMsg} type="info" />}
        {errMsg && <AlertMessage msg={errMsg} type="error" />}

        <form action="POST" id="forgotPasswordForm">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              required
            />
          </div>
          <Button
            type="submit"
            title="Send Email"
            text="Send Email"
            loading={loading}
            customStyle={{ marginTop: "1rem" }}
          />
        </form>
      </div>
    </Layout>
  );
}
