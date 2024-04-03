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
exports.filePrompt = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const Api_1 = __importDefault(require("../models/Api"));
dotenv_1.default.config();
function getTextFromPdf(base64Pdf) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append("base64_content", base64Pdf);
        try {
            const res = yield axios_1.default.post(process.env.API_MODEL_ENDPOINT + "/convertPDF/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "x-api-key": process.env.API_MODEL_KEY,
                },
            });
            console.log("LLM API response:", res.data);
            if (!res.data.text)
                throw new Error("Failed to extract text from PDF.");
            return res.data.text;
        }
        catch (err) {
            console.error("LLM API PDF conversion failed:", err);
            throw err;
        }
    });
}
function getModelResponse(prompt, pdfText) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = { context: pdfText, prompt: prompt };
        try {
            const res = yield axios_1.default.post(process.env.API_MODEL_ENDPOINT + "/generate/", body, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.API_MODEL_KEY,
                },
            });
            console.log("LLM API model response:", res.data);
            if (!res.data.response)
                throw new Error("Failed to get model response.");
            return res.data.response;
        }
        catch (err) {
            console.error("LLM API model response failed:", err);
            throw err;
        }
    });
}
const filePrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, userId } = req.body;
    const file = req.file;
    if (!file)
        return res.status(400).send({ message: "No file uploaded." });
    if (!prompt)
        return res.status(400).send({ message: "No prompt provided." });
    if (!userId)
        return res.status(400).send({ message: "No user ID provided." });
    try {
        const base64file = fs_1.default.readFileSync(file.path, { encoding: "base64" });
        const pdfText = yield getTextFromPdf(base64file);
        console.log("Extracted text from PDF:", pdfText);
        if (!pdfText) {
            return res
                .status(400)
                .send({ message: "Failed to extract text from PDF." });
        }
        const modelResponse = yield getModelResponse(prompt, pdfText);
        console.log("LLM model response to prompt:", modelResponse);
        if (!modelResponse) {
            return res
                .status(400)
                .send({ message: "Failed to get model response based on prompt." });
        }
        const apiPrompt = yield Api_1.default.findOne({
            user: userId,
            endpoint: "/api/file/prompt",
        });
        if (!apiPrompt) {
            console.error("API not found for prompt file endpoint.");
            return res.status(400).send({
                message: "API not found for prompt file endpoint.",
            });
        }
        apiPrompt.requests += 1;
        yield apiPrompt.save();
        fs_1.default.unlinkSync(file.path);
        res.send(modelResponse);
    }
    catch (err) {
        console.error("File prompt failed:", err);
        res.status(400).send(err);
    }
});
exports.filePrompt = filePrompt;
