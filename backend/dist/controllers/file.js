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
Object.defineProperty(exports, "__esModule", { value: true });
exports.filePrompt = void 0;
const filePrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    const file = req.file;
    console.log("File prompt request:", file, prompt);
    try {
        const message = "You asked for help with SQL injection. Here is a resource that might help: https://owasp.org/www-community/attacks/SQL_Injection";
        console.log("File prompt returned message:", message);
        res.send(message);
    }
    catch (err) {
        console.error("File prompt failed:", err);
        res.status(400).send(err);
    }
});
exports.filePrompt = filePrompt;
