"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../messages/lang/en/user");
const verify = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) {
        console.error('No access token found.', token);
        return res.status(401).send({ message: user_1.messages.noAccessTokenFound });
    }
    try {
        const verify = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verify;
        next();
    }
    catch (err) {
        return res.status(400).send({ message: user_1.messages.accessTokenDenied });
    }
};
exports.verify = verify;
