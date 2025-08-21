import { AppError } from "./errors";

const provider = process.env.AI_PROVIDER ?? "gemini";
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const HF_TOKEN = process.env.HF_TOKEN;
const GEMINI_TOKEN = process.env.GEMINI_TOKEN;

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

  if (provider === "gemini") {
    if (!GEMINI_TOKEN) throw new AppError("Missing Gemini API key", { status: 503, code: "NO_API_KEY" });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Task: ${task}
                Please provide:
                1. The next actionable step for this task
                2. A brief rationale (one sentence)

                Format your response as:
                Next Step: [specific action]
                Rationale: [brief explanation]`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 150
          }
        })
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})) as any;
      throw new AppError(`Gemini error ${res.status}: ${errorData?.error?.message || 'Unknown error'}`, { status: 502, code: "UPSTREAM_ERROR" });
    }

    const data = await res.json() as any;
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Parse the response to extract next step and rationale
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    let nextStep = "Create a task breakdown";
    let rationale = "First step to organize the workflow";

    // Look for "Next Step:" and "Rationale:" patterns
    for (const line of lines) {
      if (line.toLowerCase().includes('next step:')) {
        nextStep = line.replace(/next step:/i, '').trim();
      } else if (line.toLowerCase().includes('rationale:')) {
        rationale = line.replace(/rationale:/i, '').trim();
      }
    }

    // If structured format wasn't followed, try to extract first meaningful line
    if (nextStep === "Create a task breakdown" && lines.length > 0) {
      nextStep = lines[0];
      rationale = lines.length > 1 ? lines[1] : "AI-generated workflow step";
    }

    return {
      nextStep: nextStep.trim(),
      rationale: rationale.trim()
    };
  }
  // mock
  return { nextStep: "Create customer record", rationale: "First step to enable downstream actions" };
}