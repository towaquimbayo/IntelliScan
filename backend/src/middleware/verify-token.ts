import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { messages } from "../messages/lang/en/user";

export const verify = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['token'];
    if (!token) {
        console.error('No access token found.', token);
        return res.status(401).send({ message: messages.noAccessTokenFound });
    }

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verify;
        next()
    } catch (err) {
        return res.status(400).send({ message: messages.accessTokenDenied });
    }
}