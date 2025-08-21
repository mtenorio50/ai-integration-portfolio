// Thin AI adapter with safe fallbacks and precise errors
export type SuggestionResult = { suggestions: string[]; meta?: { provider: string } };

class AppError extends Error {
  status: number;
  code: string;
  constructor(message: string, opts: { status?: number; code?: string } = {}) {
    super(message);
    this.status = opts.status ?? 500;
    this.code = opts.code ?? "INTERNAL_ERROR";
  }
}

const provider = import.meta.env.VITE_AI_PROVIDER ?? "mock";
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function getSuggestions(input: string): Promise<SuggestionResult> {
  if (!input?.trim()) return { suggestions: [], meta: { provider } };
  const p = provider.toLowerCase();

  if (p === "openai") {
    if (!OPENAI_KEY) throw new AppError("Missing OpenAI API key", { status: 503, code: "NO_API_KEY" });
    // Keep logic simple: just echo-style suggestions
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You generate 3 short autocomplete suggestions." },
        { role: "user", content: `Suggest 3 concise continuations for: ${input}` }
      ],
      temperature: 0.2
    };
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new AppError(`OpenAI error ${res.status}`, { status: 502, code: "UPSTREAM_ERROR" });
    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content ?? "";
    const suggestions = text
      .split(/\n|\r/) // split lines
      .map(s => s.replace(/^[-*\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);
    return { suggestions, meta: { provider: "openai" } };
  }

  if (p === "hf") {
    if (!HF_TOKEN) throw new AppError("Missing HuggingFace token", { status: 503, code: "NO_API_KEY" });
    // Minimal example: use a lightweight model endpoint (pseudo). Replace with a real endpoint if desired.
    const res = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: input.slice(0, 128) })
    });
    if (!res.ok) throw new AppError(`HF error ${res.status}`, { status: 502, code: "UPSTREAM_ERROR" });
    const out = await res.json();
    const text: string = out?.[0]?.generated_text ?? input;
    const suggestions = [
      `${input} — please assist`,
      `${input} — next steps`,
      text.slice(0, 60)
    ];
    return { suggestions, meta: { provider: "hf" } };
  }



  if (p === "gemini") {
    if (!GEMINI_KEY) throw new AppError("Missing Gemini API key", { status: 503, code: "NO_API_KEY" });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate exactly 3 short autocomplete suggestions for: "${input}". Format each suggestion on a new line with no bullet points or numbers.`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 100
          }
        })
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new AppError(`Gemini error ${res.status}: ${errorData?.error?.message || 'Unknown error'}`, { status: 502, code: "UPSTREAM_ERROR" });
    }

    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const suggestions = text
      .split(/\n|\r/)
      .map(s => s.replace(/^[-*\s0-9.]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    return { suggestions, meta: { provider: "gemini" } };
  }

  // Mock provider: deterministic suggestions for demo/review
  const base = input.trim();
  return {
    suggestions: [
      `${base} — please help with this`,
      `${base} — steps to resolve`,
      `${base} — summary`
    ],
    meta: { provider: "mock" }
  };
}

export { AppError };