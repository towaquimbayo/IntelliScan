import { Request, Response, NextFunction } from "express";

import { z } from "zod";
import User from "../models/User";

// zod Validations
const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().min(3).email(),
    password: z.string().min(3),
    admin: z.boolean().optional(),
    token: z.string().optional(),
}).strict();

type RequestBody = {
    email: string;
    admin: boolean;
}
export const registerValidation = async (req: Request, res: Response, next: NextFunction) => {
    // validating using zod
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).send(parsed.error)
        return;
    }

    const { email: emailFromBody }: RequestBody = req.body;
    try {
        // checking to see if the user is already registered
        const emailExist = await User.findOne({ email: emailFromBody })
        if (emailExist) {
            res.status(400).send({
                message: 'An account with this email already exists. Please try again.',
            })
            return;
        }
        next();
    } catch (err) {
        console.error('Error occurred while validating registration: ', err)
        res.status(500).send('Internal Server Error')
    }
}
