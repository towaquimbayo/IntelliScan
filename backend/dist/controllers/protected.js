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
exports.fetchApiInfo = exports.editUser = exports.deleteUser = exports.fetchUsers = exports.sampleController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Api_1 = __importDefault(require("../models/Api"));
const user_1 = require("../messages/lang/en/user");
const sampleController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ data: 'This is only accessible using JWT', user: req.user });
});
exports.sampleController = sampleController;
const fetchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({}, '-password');
        const userId = req.user.id;
        if (!userId) {
            console.error("User not found");
            return res.status(404).send({ message: user_1.messages.userNotFound });
        }
        const api = yield Api_1.default.findOne({ user: userId, endpoint: "/api/v1/protected/users" });
        if (!api) {
            console.error("API not found for fetch users endpoint.");
            return res.status(400).send({ message: user_1.messages.fetchUsersEndpointNotFound });
        }
        api.requests += 1;
        yield api.save();
        res.status(200).json({ users });
    }
    catch (err) {
        console.error("Error occurred while fetching users:", err);
        res.status(500).send({ message: user_1.messages.serverError });
    }
});
exports.fetchUsers = fetchUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield User_1.default.findByIdAndDelete(id);
        if (!user) {
            console.error("User not found");
            return res.status(404).send({ message: user_1.messages.userNotFound });
        }
        const api = yield Api_1.default.findOne({
            user: user.id,
            endpoint: "/api/v1/protected/users/:id",
            method: "DELETE"
        });
        if (!api) {
            console.error("API not found for delete user endpoint.");
            return res.status(400).send({ message: user_1.messages.deleteUserEndpointNotFound });
        }
        api.requests += 1;
        yield api.save();
        res.status(200).json({ message: user_1.messages.deleteUserSuccess });
    }
    catch (err) {
        console.error("Error occurred while deleting user:", err);
        res.status(500).send({ message: user_1.messages.serverError });
    }
});
exports.deleteUser = deleteUser;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { name, email, admin, api_calls } = req.body;
        const user = yield User_1.default.findByIdAndUpdate(id, { name, email, admin, api_calls }, { new: true });
        if (!user) {
            console.error('User not found');
            return res.status(404).send({ message: user_1.messages.userNotFound });
        }
        const api = yield Api_1.default.findOne({
            user: user.id,
            endpoint: "/api/v1/protected/users/:id",
            method: "PUT"
        });
        if (!api) {
            console.error("API not found for edit user endpoint.");
            return res.status(400).send({ message: user_1.messages.editUserEndpointNotFound });
        }
        api.requests += 1;
        yield api.save();
        res.status(200).json({ message: user_1.messages.userUpdatedSuccess, user });
    }
    catch (err) {
        console.error("Error occurred while updating user:", err);
        res.status(500).send({ message: user_1.messages.serverError });
    }
});
exports.editUser = editUser;
const fetchApiInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const api = yield Api_1.default.find({ user: id });
        if (!api) {
            console.error("User API not found.");
            return res.status(404).send({ message: user_1.messages.userApiInfoNotFound });
        }
        res.status(200).json({ api });
    }
    catch (err) {
        console.error("Error occurred while fetching api info:", err);
        res.status(500).send({ message: user_1.messages.serverError });
    }
});
exports.fetchApiInfo = fetchApiInfo;
