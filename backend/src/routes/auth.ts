import { Router } from "express";
const router = Router();
import {
  registerUser,
  loginUser,
  sendForgotPasswordEmail,
  updatePassword,
} from "../controllers/auth";
import { registerValidation } from "../middleware/register-validation";
import { loginValidation } from "../middleware/login-validation";
import { emailValidation } from "../middleware/email-validation";
import { otpValidation } from "../middleware/otp-validation";
import { passwordValidation } from "../middleware/password-validation";

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/forgot-password", emailValidation, sendForgotPasswordEmail);
router.post("/verify-otp", otpValidation);
router.post("/reset-password", passwordValidation, updatePassword);

export default router;
