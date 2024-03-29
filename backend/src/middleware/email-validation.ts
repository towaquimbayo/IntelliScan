import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import User from "../models/User";

type RequestBody = {
  email: string;
  password: string;
};

// zod Validations
const loginSchema = z
  .object({
    email: z.string().min(6).email(),
  })
  .strict();

export const emailValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validating using zod
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) res.status(400).send(parsed.error);
  else {
    const { email: email }: RequestBody = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(400)
        .send({ message: "Invalid email provided. Please try again." });
    }
    next();
  }
};
