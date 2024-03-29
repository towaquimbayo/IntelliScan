import { Router } from "express";
const router = Router();
import { registerUser, loginUser, sendForgotPasswordEmail } from '../controllers/auth'
import { registerValidation } from "../middleware/register-validation";
import { loginValidation } from "../middleware/login-validation";
import { emailValidation } from "../middleware/email-validation";

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/forgot-password', emailValidation, sendForgotPasswordEmail);

export default router