import { Router } from "express";
const router = Router();
import { filePrompt } from "../controllers/file";
import { fileValidation } from "../middleware/file-validation";
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

router.post("/prompt", upload.single("file"), fileValidation, filePrompt);

export default router;
