import express from "express";
import { logRequest } from "./loggers";
import { errorMiddleware, AppError } from "./errors";
import { GenerateStepInput } from "./validation";
import { generateNextStep } from "./ai";

const app = express();
app.use(express.json());
app.use(logRequest);

app.get("/health", (_req, res) => res.json({ ok: true }));

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
app.listen(port, () => console.log(`API on http://localhost:${port}`));