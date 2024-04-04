import { Response, Request, NextFunction, Errback } from "express";
import { messages } from "../messages/lang/en/user";

export const errorHandlerMiddleware = async (err: Errback, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    return res.status(500).send({ message: messages.serverError });
}