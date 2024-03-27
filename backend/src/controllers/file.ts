import { Response, Request } from "express";

interface UploadedFile extends Express.Multer.File {}

type RequestBody = {
  prompt: string;
};
export const filePrompt = async (req: Request, res: Response) => {
  const { prompt }: RequestBody = req.body;
  const file = req.file;
  console.log("File prompt request:", file, prompt)

  try {
    // @TODO: send file and prompt to LLM server
    // @TODO: wait for response and obtain message from LLm server
    const message = "You asked for help with SQL injection. Here is a resource that might help: https://owasp.org/www-community/attacks/SQL_Injection";

    console.log("File prompt returned message:", message);
    res.send(message);
  } catch (err) {
    console.error("File prompt failed:", err);
    res.status(400).send(err);
  }
};
