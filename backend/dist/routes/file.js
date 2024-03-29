"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const file_1 = require("../controllers/file");
const file_validation_1 = require("../middleware/file-validation");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.split(" ").join("_"));
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/prompt", upload.single("file"), file_validation_1.fileValidation, file_1.filePrompt);
exports.default = router;
