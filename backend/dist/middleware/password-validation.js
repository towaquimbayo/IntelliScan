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
exports.passwordValidation = void 0;
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../messages/lang/en/user");
const userSchema = zod_1.z
    .object({
    email: zod_1.z.string().min(6).email(),
    newPassword: zod_1.z.string().min(6),
})
    .strict();
const passwordValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).send(parsed.error);
        return;
    }
    const { email: email, newPassword: newPassword } = req.body;
    try {
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            res.status(400).send({ message: user_1.messages.userNotFound });
            return;
        }
        if (yield bcryptjs_1.default.compare(newPassword, user.password)) {
            res.status(400).send({
                message: user_1.messages.samePasswordError,
            });
            return;
        }
        next();
    }
    catch (err) {
        console.error("Error occurred while validating user and password: ", err);
        res.status(500).send({ message: user_1.messages.serverError });
    }
});
exports.passwordValidation = passwordValidation;
