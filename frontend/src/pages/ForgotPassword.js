import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VerificationInput from "react-verification-input";
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
  const steps = {
    verifyEmail: "verifyEmail",
    verifyOTP: "verifyOTP",
    resetPassword: "resetPassword",
  };
  const [formStep, setFormStep] = useState(steps.verifyEmail);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  function clearMessages() {
    setSuccessMsg("");
    setInfoMsg("");
    setErrMsg("");
  }

  /**
   * Step 1: Verify email
   * Send an email to the user with a verification code if the email exists.
   * @param {*} e an event object
   * @returns {Promise<void>}
   */
  async function sendVerificationCode(e) {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (!email) {
      setErrMsg("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        document.getElementById("forgotPasswordForm").reset(); // Clear form
        setInfoMsg("An email has been sent. Please check your inbox.");
        setFormStep(steps.verifyOTP);
      } else {
        const data = await response.json();
        console.error("Error sending email:", data);
        setErrMsg(data.message || "An unexpected error occurred. Please try again later.");
      }
    } catch (e) {
      console.error("Error sending email:", e);
      setErrMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Step 2: Verify OTP
   * Validate the OTP code entered by the user.
   * @param {*} e an event object
   * @returns {Promise<void>}
   */
  async function validateOTP(e) {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (!otp) {
      setErrMsg("Please enter the verification code.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, userOtp: otp }),
      });

      if (response.ok) {
        setSuccessMsg("Verification successful. Please enter a new password.");
        setFormStep(steps.resetPassword);
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        const data = await response.json();
        console.error("Error validating OTP:", data);
        setErrMsg(data.message);
      }
    } catch (e) {
      console.error("Error validating OTP:", e);
      setErrMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Step 3: Reset password
   * Update the user's password with the new password.
   * @param {*} e an event object
   * @returns {Promise<void>}
   */
  async function resetPassword(e) {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (!password || password.length < 8 || password.length > 50) {
      setErrMsg("Please enter a password between 8 and 50 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setSuccessMsg(
          "Password updated successfully. Redirecting you to the login page..."
        );
        setTimeout(() => {
          setLoading(false);
          navigate("/login");
        }, 3000);
      } else {
        const data = await response.json();
        console.error("Error resetting password:", data);
        setErrMsg(data.message);
      }
    } catch (e) {
      console.error("Error resetting password:", e);
      setErrMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function pageHeader() {
    if (formStep === steps.verifyEmail) {
      return (
        <div className="pageHeader">
          <h1>Forgot Password</h1>
          <p>Please enter your email address to reset your password.</p>
        </div>
      );
    } else if (formStep === steps.verifyOTP) {
      return (
        <div className="pageHeader">
          <h1>Verify Code</h1>
          <p>Please enter the 4 digit code from your email.</p>
        </div>
      );
    } else if (formStep === steps.resetPassword) {
      return (
        <div className="pageHeader">
          <h1>Update Password</h1>
          <p>Almost done! Please enter a new password for your account.</p>
        </div>
      );
    }
  }

  function pageForm() {
    if (formStep === steps.verifyEmail) {
      return (
        <>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              onChange={(e) => {
                setEmail(e.target.value.trim().toLowerCase());
                setErrMsg("");
              }}
              minLength={3}
              maxLength={100}
              required
            />
          </div>
          <Button
            type="submit"
            title="Send Email"
            text="Send Email"
            loading={loading}
            onClick={sendVerificationCode}
            customStyle={{ marginTop: "1rem" }}
          />
        </>
      );
    } else if (formStep === steps.verifyOTP) {
      return (
        <>
          <div className="otpContainer">
            <VerificationInput
              length={4}
              autoFocus
              placeholder="*"
              validChars="0-9"
              classNames={{
                container: "otpInputContainer",
                character: "otpText",
                characterInactive: "inactiveText",
                characterSelected: "selectedText",
              }}
              onChange={(value) => {
                setOtp(value);
                setErrMsg("");
              }}
            />
          </div>
          <Button
            type="submit"
            title="Enter Verification Code"
            text="Enter Verification Code"
            loading={loading}
            onClick={validateOTP}
            customStyle={{ marginTop: "1rem" }}
          />
        </>
      );
    } else if (formStep === steps.resetPassword) {
      return (
        <>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter a new password"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrMsg("");
              }}
              minLength={8}
              maxLength={50}
              required
            />
          </div>
          <Button
            type="submit"
            title="Update Password"
            text="Update Password"
            loading={loading}
            onClick={resetPassword}
            customStyle={{ marginTop: "1rem" }}
          />
        </>
      );
    }
  }

  return (
    <Layout title="Forgot Password">
      <div className="container">
        {pageHeader()}
        {successMsg && <AlertMessage msg={successMsg} type="success" />}
        {infoMsg && <AlertMessage msg={infoMsg} type="info" />}
        {errMsg && <AlertMessage msg={errMsg} type="error" />}
        <form action="POST" id="forgotPasswordForm">
          {pageForm()}
        </form>
      </div>
    </Layout>
  );
}
