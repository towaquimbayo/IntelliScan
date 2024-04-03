"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ApiSchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    endpoint: {
        type: String,
        required: true,
    },
    requests: {
        type: Number,
        default: 0,
    },
});
const Api = (0, mongoose_1.model)("Api", ApiSchema);
exports.default = Api;
