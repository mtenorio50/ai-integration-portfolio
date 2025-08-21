export async function complete(prompt: string){
  const url = import.meta.env.VITE_API_URL + "/ai/complete";
  try {
    const res = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ prompt }) });
    if(!res.ok){ const body = await res.json().catch(()=>({})); throw new Error(body?.error || `HTTP ${res.status}`); }
    return await res.json();
  } catch (e:any){ throw new Error(e.message || "Network error"); }
}