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
  });
  if (!parsed.success) res.status(400).send(parsed.error);
  else {
    const { prompt } = req.body;
    const file = req.file;
    console.log("File validation middleware:", file, prompt);

    // @TODO: add more validation logic here

    console.log("File validation passed!");
    next();
  }
};
