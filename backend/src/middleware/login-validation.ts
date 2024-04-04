import { Request, Response, NextFunction } from 'express'
import { z } from "zod";
import bcrypt from 'bcryptjs'
import User from '../models/User';
import { messages } from '../messages/lang/en/user';

type RequestBody = {
    email: string;
    password: string
}

// zod Validations
const loginSchema = z.object({
    email: z.string().min(6).email(),
    password: z.string().min(3)
}).strict();

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    // validating using zod
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).send(parsed.error)
        return;
    }

    const { email: emailFromBody, password: passwordFromBody }: RequestBody = req.body;
    try {
        // checking if the email exists
        const user = await User.findOne({ email: emailFromBody })
        if (!user) {
            res.status(400).send({ message: messages.userNotFound });
            return;
        }

        // checking if the password is correct
        const validPass = await bcrypt.compare(passwordFromBody, user.password)
        if (!validPass) {
            res.status(400).send({
                message: messages.invalidEmailOrPassword
            });
            return;
        }
        req.userId = user._id;
        next();
    } catch (err) {
        console.error('Error occurred while validating login: ', err)
        res.status(500).send({ message: messages.serverError });
    }
}