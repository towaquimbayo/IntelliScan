import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { messages } from "../messages/lang/en/user";

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
    const { userId, prompt } = req.body;
    const file = req.file;

    if (!file) return res.status(400).send({ message: messages.noFileFound });
    if (!prompt) return res.status(400).send({ message: messages.noPromptProvided });
    if (!userId) return res.status(400).send({ message: messages.noUserIdProvided });

    if (file.mimetype !== "application/pdf") {
      return res.status(400).send({ message: messages.invalidFileType });
    }
    if (file.size > 2097152) {
      return res.status(400).send({
        message: messages.filesizeExceeded,
      });
    }
    console.log("File validation passed!");
    next();
  }
};
