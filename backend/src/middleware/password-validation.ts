import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { messages } from "../messages/lang/en/user";

// zod Validations
const userSchema = z
  .object({
    email: z.string().min(6).email(),
    newPassword: z.string().min(6),
  })
  .strict();

type RequestBody = {
  email: string;
  newPassword: string;
};
export const passwordValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validating using zod
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).send(parsed.error);
    return;
  }

  const { email: email, newPassword: newPassword }: RequestBody = req.body;
  try {
    // checking to see if the user is already registered
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).send({ message: messages.userNotFound });
      return;
    }

    // checking if the new password is the same as the old password
    if (await bcrypt.compare(newPassword, user.password)) {
      res.status(400).send({
        message: messages.samePasswordError,
      });
      return;
    }

    next();
  } catch (err) {
    console.error("Error occurred while validating user and password: ", err);
    res.status(500).send({ message: messages.serverError })
  }
};
