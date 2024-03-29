import { Response, Request } from "express"

export const notFound = (_: Request, res: Response) => res.status(404).send({ message: 'Route does not exist!' })