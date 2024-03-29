"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpValidation = void 0;
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const Otp_1 = __importDefault(require("../models/Otp"));
const loginSchema = zod_1.z
    .object({
    email: zod_1.z.string().min(6).email(),
    userOtp: zod_1.z.string().min(4),
})
    .strict();
const otpValidation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).send(parsed.error);
        return;
    }
    const { email: email, userOtp: userOtp } = req.body;
    try {
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            res
                .status(400)
                .send({ message: "Invalid email provided. Please try again." });
            return;
        }
        const otp = yield Otp_1.default.findOne({ email: email });
        if (!otp || !otp.otpCode) {
            console.error("No code found for this email.", email, otp);
            res.status(400).send({ message: "No code found for this email." });
            return;
        }
        else if (otp.otpCode !== Number(userOtp)) {
            console.error("Invalid code. Please try again.", userOtp, otp.otpCode);
            res.status(400).send({ message: "Invalid code. Please try again." });
            return;
        }
        yield Otp_1.default.deleteOne({ email: email });
        res.status(200).send({ message: "OTP verified successfully." });
    }
    catch (err) {
        console.error("Error occurred while verifying OTP: ", err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.otpValidation = otpValidation;
