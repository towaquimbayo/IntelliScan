import { Request, Response } from "express";
import { z } from "zod";
import User from "../models/User";
import Otp from "../models/Otp";
import { messages } from "../messages/lang/en/user";

type RequestBody = {
  email: string;
  userOtp: string;
};

// zod Validations
const loginSchema = z
  .object({
    email: z.string().min(6).email(),
    userOtp: z.string().min(4),
  })
  .strict();

export const otpValidation = async (req: Request, res: Response) => {
  // validating using zod
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).send(parsed.error);
    return;
  }

  const { email: email, userOtp: userOtp }: RequestBody = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(400)
        .send({ message: messages.userNotFound });
      return;
    }

    const otp = await Otp.findOne({ email: email });
    if (!otp || !otp.otpCode) {
      console.error("No code found for this email.", email, otp);
      res.status(400).send({ message: messages.noOtpCodeFound });
      return;
    } else if (otp.otpCode !== Number(userOtp)) {
      console.error("Invalid code. Please try again.", userOtp, otp.otpCode);
      res.status(400).send({ message: messages.invalidOtpCode });
      return;
    }

    // Delete the OTP from the database
    await Otp.deleteOne({ email: email });
    res.status(200).send({ message: messages.otpValidationSuccess });
  } catch (err) {
    console.error("Error occurred while verifying OTP: ", err);
    res.status(500).send({ message: messages.serverError });
  }
};
