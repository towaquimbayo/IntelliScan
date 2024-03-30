import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import User from "../models/User";

type RequestBody = {
  email: string;
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
  if (!parsed.success) {
    res.status(400).send(parsed.error);
    return;
  }

  const { email: email }: RequestBody = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(400)
        .send({
          message: "User not found for the provided email. Please try again.",
        });
      return;
    }
    next();
  } catch (err) {
    console.error("Error occurred while verifying email: ", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
