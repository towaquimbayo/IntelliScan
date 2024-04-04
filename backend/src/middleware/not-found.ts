import { Response, Request } from "express";
import { messages } from '../messages/lang/en/user';

export const notFound = (_: Request, res: Response) => res.status(404).send({ message: messages.noRouteExists })