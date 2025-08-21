import { AppError } from "./errors";

const provider = process.env.AI_PROVIDER ?? "gemini";
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

export async function complete(prompt: string) {
  if (provider === "mock") {
    return { text: `${prompt} → mock completion` };
  }

  if (provider === "openai") {
    if (!OPENAI_KEY) throw new AppError("Missing OpenAI API key", { status: 503, code: "NO_API_KEY" });
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    });
    if (!res.ok) throw new AppError(`OpenAI error ${res.status}`, { status: 502, code: "UPSTREAM_ERROR" });
    const data = await res.json() as any;
    const text = data.choices?.[0]?.message?.content ?? "";
    return { text };
  }

  if (provider === "gemini") {
    if (!GEMINI_KEY) throw new AppError("Missing Gemini API key", { status: 503, code: "NO_API_KEY" });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1000
          }
        })
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})) as any;
      throw new AppError(`Gemini error ${res.status}: ${errorData?.error?.message || 'Unknown error'}`, { status: 502, code: "UPSTREAM_ERROR" });
    }

    const data = await res.json() as any;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response generated";
    return { text };
  }

  // Fallback
  throw new AppError(`Unknown AI provider: ${provider}`, { status: 400, code: "BAD_CONFIG" });
}