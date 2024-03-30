import { Response, Request } from "express";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import User from "../models/User";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import Otp from "../models/Otp";

// Setup transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.NODEMAIL_USER,
        pass: process.env.NODEMAIL_PASS,
    },
});

export const registerUser = async (req: Request, res: Response) => {
    type RequestBody = {
        name: string;
        email: string;
        password: string
        admin: boolean;
    }

    const { name, email, password, admin }: RequestBody = req.body;
    try {
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // store the user in db
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            admin: admin ?? false
        });
        await user.save();
        res.send({ user: user._id })
    } catch (err) {
        res.status(400).send(err)
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) {
        console.error("User not found for the provided email. Please try again.");
        res.status(400).send({
            message: "User not found for the provided email. Please try again.",
        });
        return;
    }

    // Create and assign a JWT
    const token = jwt.sign({ id: req.userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
    res.header('Authorization', `Bearer ${token}`);
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    });
    res.send({
        "status": 200,
        "message": "User logged in successfully!",
        "id": user._id,
        "apiCalls": user.api_calls,
        "isAdmin": user.admin,
        "name": user.name,
    });
}

function sendMail(email: string, subject: string, mailContent: string) {
    const mailOptions = {
        from: process.env.NODEMAIL_USER,
        to: email,
        subject: subject,
        html: mailContent,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err: Error | null, info: nodemailer.SentMessageInfo) => {
            if (err) {
                console.error("Error occurred while sending email: ", err);
                reject(err);
            } else {
                console.log("Mail info:", info);
                console.log("Email sent to:", email);
                resolve(info);
            }
        });
    });
}

export const sendForgotPasswordEmail = async (req: Request, res: Response) => {
    type RequestBody = { email: string }
    const { email }: RequestBody = req.body;

    try {
        // Delete any existing OTP for the email
        const otpExists = await Otp.findOne({ email: email });
        if (otpExists) {
            await Otp.deleteOne({ email: email });
        }

        // Generate a new OTP
        const otp = Math.floor(1000 + Math.random() * 9000); // 4 digit OTP
        console.log("OTP: ", otp)
        const otpSchema = new Otp({
            email: email,
            otpCode: otp,
        });
        await otpSchema.save();

        const subject = "IntelliScan - Password Reset One Time Password Code";
        const mailContent = `
        <div style="max-width: 1000px;border:solid 1px #CBCBCB; margin: 0 auto;padding: 50px 60px;box-sizing:border-box;">
            <p>We received a request to reset your password associated with your IntelliScan account.</p>
            <p>To reset your password, please enter the following 4-digit code:</p>
            <div style="margin: 2rem; text-align: center;">
                <h1 style="letter-spacing: 5px;">${otp}</h1>
            </div>
            <p>If you did not initiate this request, you can safely ignore this email or contact us at <a href="mailto:${process.env.NODEMAIL_USER}">${process.env.NODEMAIL_USER}</a>.</p>
            <p>Thank you,<br/>The IntelliScan Team</p>
        </div>
        `;
       
        // Send email to user with OTP
        await sendMail(email, subject, mailContent);
        res.status(200).send("Reset password email sent successfully!");
    } catch (err) {
        console.error("Error occurred during sending reset password email: ", err);
        res.status(400).send(err);
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    type RequestBody = {
        email: string;
        newPassword: string;
    }
    const { email, newPassword }: RequestBody = req.body;

    try {
        // checking to see if the user is already registered
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).send({
                message: "User not found for the provided email. Please try again.",
            });
            return;
        }

        // updating the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send("Password updated successfully!");
    } catch (err) {
        console.error("Error occurred while updating password: ", err);
        res.status(500).send("Internal Server Error");
    }
}
