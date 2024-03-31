import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// zod Validations
const fileSchema = z
  .object({
    file: z.object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string(),
      destination: z.string(),
      filename: z.string(),
      path: z.string(),
      size: z.number(),
    }),
    prompt: z.string(),
    userId: z.string(),
  })
  .strict();

export const fileValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validating using zod
  const parsed = fileSchema.safeParse({
    file: req.file,
    prompt: req.body.prompt,
    userId: req.body.userId,
  });
  if (!parsed.success) res.status(400).send(parsed.error);
  else {
    const { prompt } = req.body;
    const file = req.file;
    console.log("File validation middleware:", file, prompt);

    if (!file) return res.status(400).send({ message: "No file uploaded." });
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
