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
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, admin } = req.body;
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    const user = new User_1.default({
        name: name,
        email: email,
        password: hashedPassword,
        admin: admin !== null && admin !== void 0 ? admin : false
    });
    try {
        yield user.save();
        res.send({ user: user._id });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.userId);
    if (!user)
        return res.status(400).send('User not found');
    const token = jsonwebtoken_1.default.sign({ id: req.userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
    res.header('Authorization', `Bearer ${token}`);
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    });
    res.send({
        "status": 200,
        "message": "User logged in successfully!",
        "apiCalls": user.api_calls,
        "isAdmin": user.admin,
        "name": user.name,
    });
});
exports.loginUser = loginUser;
