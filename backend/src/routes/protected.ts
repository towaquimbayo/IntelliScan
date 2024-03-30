import { Router } from "express";
const router = Router();

import { verify } from "../middleware/verify-token";
import { sampleController, fetchUsers, deleteUser } from "../controllers/protected";

router.get('/', verify, sampleController)
router.get('/users', verify, fetchUsers)
router.delete('/users/:id', verify, deleteUser)

export default router