import { Router } from "express";
const router = Router();

import { verify } from "../middleware/verify-token";
import { sampleController, fetchUsers } from "../controllers/protected";

router.get('/', verify, sampleController)
router.get('/users', verify, fetchUsers)

export default router