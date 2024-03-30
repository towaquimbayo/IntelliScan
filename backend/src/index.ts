import express from "express";
const app = express();
import { connectDB } from "./db/connect";
import { notFound } from "./middleware/not-found";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import authRoute from "./routes/auth";
import protectedRoutes from "./routes/protected";
import fileRoute from "./routes/file";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 8080;
const clientProdUrl = process.env.CLIENT_PROD_URL || '';
const clientDevUrl = process.env.CLIENT_DEV_URL || '';

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(
  cors({
    origin: [clientProdUrl, clientDevUrl],
    credentials: true,
  })
);

// Routes
app.use("/api/user", authRoute);
app.use("/api/file", fileRoute);
app.use("/api/protected", protectedRoutes); // just for example
app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    console.info("Server running on", process.env.NODE_ENV);
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on port ${port}...`));
  } catch (err) {
    console.error(err);
  }
};

start();
