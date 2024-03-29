import { Schema, model, Document } from "mongoose";

interface IOtp extends Document {
  email: String;
  otpCode: Number;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      max: 255,
    },
    otpCode: {
      type: Number,
      required: true,
      max: 9999,
    },
    createdAt: {
      type: Date,
      expires: 600, // 10 minutes
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Otp = model<IOtp>("Otp", OtpSchema);
export default Otp;
