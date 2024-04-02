import { Router } from "express";
const router = Router();
import { filePrompt } from "../controllers/file";
import { fileValidation } from "../middleware/file-validation";
import { verify } from "../middleware/verify-token";
import multer from "multer";

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.split(" ").join("_"));
  },
});
const upload = multer({ storage: storage });

router.post("/prompt", verify, upload.single("file"), fileValidation, filePrompt);

export default router;
