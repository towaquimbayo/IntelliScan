"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileValidation = void 0;
const zod_1 = require("zod");
const fileSchema = zod_1.z
    .object({
    file: zod_1.z.object({
        fieldname: zod_1.z.string(),
        originalname: zod_1.z.string(),
        encoding: zod_1.z.string(),
        mimetype: zod_1.z.string(),
        destination: zod_1.z.string(),
        filename: zod_1.z.string(),
        path: zod_1.z.string(),
        size: zod_1.z.number(),
    }),
    prompt: zod_1.z.string(),
    userId: zod_1.z.string(),
})
    .strict();
const fileValidation = (req, res, next) => {
    const parsed = fileSchema.safeParse({
        file: req.file,
        prompt: req.body.prompt,
        userId: req.body.userId,
    });
    if (!parsed.success)
        res.status(400).send(parsed.error);
    else {
        const { prompt } = req.body;
        const file = req.file;
        console.log("File validation middleware:", file, prompt);
        if (!file)
            return res.status(400).send({ message: "No file uploaded." });
        if (!prompt)
            return res.status(400).send({ message: "No prompt provided." });
        if (file.mimetype !== "application/pdf") {
            return res
                .status(400)
                .send({ message: "Invalid file type. Please upload a PDF file." });
        }
        if (file.size > 2097152) {
            return res.status(400).send({
                message: "File size too large. Please upload a file less than 2MB.",
            });
        }
        console.log("File validation passed!");
        next();
    }
};
exports.fileValidation = fileValidation;
