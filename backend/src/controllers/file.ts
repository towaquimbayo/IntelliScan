import { Response, Request } from "express";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import User from "../models/User";
dotenv.config();

/**
 * Convert PDF to text using LLM API
 * @param base64Pdf base64 encoded PDF file
 * @returns extracted text from PDF
 */
async function getTextFromPdf(base64Pdf: string) {
  const formData = new FormData();
  formData.append("base64_content", base64Pdf);

  try {
    const res = await axios.post(
      process.env.API_MODEL_ENDPOINT + "/convertPDF/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": process.env.API_MODEL_KEY,
        },
      }
    );
    console.log("LLM API response:", res.data);

    if (!res.data.text) throw new Error("Failed to extract text from PDF.");
    return res.data.text;
  } catch (err) {
    console.error("LLM API PDF conversion failed:", err);
    throw err;
  }
}

async function getModelResponse(prompt: string, pdfText: string) {
  const body = { context: pdfText, prompt: prompt };
  try {
    const res = await axios.post(
      process.env.API_MODEL_ENDPOINT + "/generate/",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_MODEL_KEY,
        },
      }
    );
    console.log("LLM API model response:", res.data);

    if (!res.data.response) throw new Error("Failed to get model response.");
    return res.data.response;
  } catch (err) {
    console.error("LLM API model response failed:", err);
    throw err;
  }
}

type RequestBody = {
  prompt: string;
  userId: string;
};
export const filePrompt = async (req: Request, res: Response) => {
  const { prompt, userId }: RequestBody = req.body;
  const file: Express.Multer.File | undefined = req.file;

  if (!file) return res.status(400).send({ message: "No file uploaded." });
  if (!prompt) return res.status(400).send({ message: "No prompt provided." });
  if (!userId) return res.status(400).send({ message: "No user ID provided." });

  try {
    // encode file to base64 string
    const base64file = fs.readFileSync(file.path, { encoding: "base64" });

    // extract pdf text
    const pdfText = await getTextFromPdf(base64file);
    console.log("Extracted text from PDF:", pdfText);

    if (!pdfText) {
      return res
        .status(400)
        .send({ message: "Failed to extract text from PDF." });
    }

    // send prompt and extracted text to LLM server to get model response
    const modelResponse = await getModelResponse(prompt, pdfText);
    console.log("LLM model response to prompt:", modelResponse);

    if (!modelResponse) {
      return res
        .status(400)
        .send({ message: "Failed to get model response based on prompt." });
    }

    // update user's api call usage
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found for the provided ID.");
      return res
        .status(404)
        .send({
          message: "User not found for the provided ID. Please try again.",
        });
    }
    user.api_calls += 1;
    await user.save();

    // delete the file from /uploads folder
    fs.unlinkSync(file.path);

    res.send(modelResponse);
  } catch (err) {
    console.error("File prompt failed:", err);
    res.status(400).send(err);
  }
};
