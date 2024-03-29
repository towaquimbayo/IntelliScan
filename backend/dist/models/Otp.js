"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        max: 255,
    },
    otpCode: {
        type: Number,
        required: true,
        max: 9999,
    },
    createdAt: {
        type: Date,
        expires: 600,
        default: Date.now(),
    },
}, { timestamps: true });
const Otp = (0, mongoose_1.model)("Otp", OtpSchema);
exports.default = Otp;
