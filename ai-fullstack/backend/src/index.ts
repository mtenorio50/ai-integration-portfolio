import express from "express";
import cors from "cors"; 
import { logger } from "./logger";
import { errorMiddleware, AppError } from "./errors";
import { complete } from "./ai";

const app = express();
app.use(cors());  // Add this line - allows all origins
app.use(express.json());
app.use(logger);

app.get("/", (_req, res) => {
  res.json({
    name: "AI Full-Stack Backend",
    version: "0.1.0",
    description: "Backend API for AI text completion",
    endpoints: [
      {
        path: "/ai/complete",
        method: "POST",
        description: "Complete text using AI",
        body: { prompt: "string" }
      }
    ],
    status: "running"
  });
});

app.post("/ai/complete", async (req, res, next) => {
  try {
    const prompt = String(req.body?.prompt ?? "").trim();
    if (!prompt) throw new AppError("'prompt' is required", { status: 400, code: "BAD_INPUT" });
    const out = await complete(prompt);
    res.json(out);
  } catch (e) { next(e); }
});

app.use(errorMiddleware);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`BE http://localhost:${port}`));