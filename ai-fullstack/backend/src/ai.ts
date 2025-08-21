import { AppError } from "./errors";
const provider = process.env.AI_PROVIDER ?? "mock";
export async function complete(prompt: string){
  if (provider === "mock") return { text: `${prompt} → mock completion` };
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new AppError("Missing API key", { status:503, code:"NO_API_KEY"});
  const res = await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{"Content-Type":"application/json", Authorization:`Bearer ${key}`},
    body: JSON.stringify({ model:"gpt-4o-mini", messages:[{role:"user", content: prompt}], temperature:0.2 })
  });
  if(!res.ok) throw new AppError(`Upstream ${res.status}`, { status:502, code:"UPSTREAM_ERROR"});
  const data = await res.json() as any;
  const text = data.choices?.[0]?.message?.content ?? "";
  return { text };
}