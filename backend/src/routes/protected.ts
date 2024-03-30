import { Router } from "express";
const router = Router();

import { verify } from "../middleware/verify-token";
import { sampleController, fetchUsers, deleteUser, editUser } from "../controllers/protected";

router.get('/', verify, sampleController)
router.get('/users', verify, fetchUsers)
router.delete('/users/:id', verify, deleteUser)
router.put('/users/:id', verify, editUser)

export default router