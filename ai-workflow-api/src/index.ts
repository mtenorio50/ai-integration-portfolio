import 'dotenv/config';
import express from "express";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";
import { logRequest } from "./loggers";
import { errorMiddleware, AppError } from "./errors";
import { GenerateStepInput } from "./validation";
import { generateNextStep } from "./ai";

const app = express();
app.use(express.json());
app.use(logRequest);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "AI Workflow API Documentation"
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     description: Returns basic information about the AI Workflow API
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
 *                   example: "AI Workflow API"
 *                 version:
 *                   type: string
 *                   example: "0.1.0"
 *                 description:
 *                   type: string
 *                   example: "API for AI-powered workflow automation"
 */
app.get("/", (_req, res) => {
  res.json({
    name: "AI Workflow API",
    version: "0.1.0",
    description: "API for AI-powered workflow automation",
    documentation: "/api-docs",
    endpoints: [
      {
        path: "/health",
        method: "GET",
        description: "Health check endpoint"
      },
      {
        path: "/generate-step",
        method: "POST",
        description: "Generate next workflow step",
        body: { task: "string" }
      }
    ]
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API server is running
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 */
app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * @swagger
 * /generate-step:
 *   post:
 *     summary: Generate next workflow step
 *     description: Use AI to generate the next actionable step for a given task
 *     tags:
 *       - Workflow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Successfully generated next step
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkflowStep'
 *       400:
 *         description: Bad request - invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Invalid input: 'task' required"
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
app.post("/generate-step", async (req, res, next) => {
  try {
    const parsed = GenerateStepInput.safeParse(req.body);
    if (!parsed.success) throw new AppError("Invalid input: 'task' required", { status: 400, code: "BAD_INPUT" });
    const { task } = parsed.data;
    const out = await generateNextStep(task);
    res.json(out);
  } catch (e) {
    next(e);
  }
});

app.use(errorMiddleware);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`🚀 API on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
});