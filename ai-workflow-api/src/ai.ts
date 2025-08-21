import { AppError } from "./errors";

const provider = process.env.AI_PROVIDER ?? "mock";
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const HF_TOKEN = process.env.HF_TOKEN;

export async function generateNextStep(task: string) {
  if (provider === "openai") {
    if (!OPENAI_KEY) throw new AppError("Missing OpenAI API key", { status: 503, code: "NO_API_KEY" });
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return a single actionable next step and one-sentence rationale." },
        { role: "user", content: `Task: ${task}` }
      ],
      temperature: 0.2
    };
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new AppError(`OpenAI error ${res.status}`, { status: 502, code: "UPSTREAM_ERROR" });
    const data = await res.json() as any;
    const text: string = data.choices?.[0]?.message?.content ?? "Create a checklist";
    const [nextStep = text, rationale = ""] = text.split("\n");
    return { nextStep: nextStep.trim(), rationale: rationale.trim() };
  }

  if (provider === "hf") {
    if (!HF_TOKEN) throw new AppError("Missing HuggingFace token", { status: 503, code: "NO_API_KEY" });
    return { nextStep: "Extract key fields with OCR", rationale: "Found in similar tasks dataset." };
  }

  // mock
  return { nextStep: "Create customer record", rationale: "First step to enable downstream actions" };
}