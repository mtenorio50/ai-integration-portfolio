import 'dotenv/config';
import express from "express";
import cors from "cors";
import { logger } from "./logger";
import { errorMiddleware, AppError } from "./errors";
import { complete } from "./ai";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";

const app = express();
app.use(cors());  // Add this line - allows all origins
app.use(express.json());
app.use(logger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "AI Full-Stack Backend API Documentation"
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     description: Returns basic information about the AI Full-Stack Backend API
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "AI Full-Stack Backend"
 *                 version:
 *                   type: string
 *                   example: "0.1.0"
 *                 provider:
 *                   type: string
 *                   example: "gemini"
 */

app.get("/", (_req, res) => {
  res.json({
    name: "AI Full-Stack Backend",
    version: "0.1.0",
    description: "Backend API for Fullstack",
    endpoints: [
      {
        path: "/ai/complete",
        method: "POST",
        description: "Respond to prompt",
        body: { prompt: "string" }
      }
    ],
    status: "running"
  });
});

/**
 * @swagger
 * /ai/complete:
 *   post:
 *     summary: Complete text using AI
 *     description: Generate text completion using the configured AI provider (OpenAI, Gemini, or Mock)
 *     tags:
 *       - AI Completion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompletionRequest'
 *     responses:
 *       200:
 *         description: Successfully generated text completion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompletionResponse'
 *       400:
 *         description: Bad request - invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "'prompt' is required"
 *               code: "BAD_INPUT"
 *               status: 400
 *       503:
 *         description: Service unavailable - missing API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Missing Gemini API key"
 *               code: "NO_API_KEY"
 *               status: 503
 *       502:
 *         description: Bad gateway - AI service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Gemini error 400"
 *               code: "UPSTREAM_ERROR"
 *               status: 502
 */

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
app.listen(port, () => {
  console.log(`🚀 Backend API: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
});