import { useState } from "react";
import { complete } from "./lib/api";

export default function App(){
  const [prompt,setPrompt]=useState("");
  const [out,setOut]=useState<string|undefined>();
  const [err,setErr]=useState<string|undefined>();
  const [loading,setLoading]=useState(false);

  async function onRun(){
    setLoading(true); setErr(undefined); setOut(undefined);
    try { const r = await complete(prompt); setOut(r.text); }
    catch(e:any){ setErr(e.message); }
    finally{ setLoading(false); }
  }

  return (
    <div style={{maxWidth:720, margin:"2rem auto", fontFamily:"system-ui"}}>
      <h1>Full‑Stack AI Demo</h1>
      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Enter prompt" style={{width:"100%",height:120,padding:12}} />
      <div style={{marginTop:8, display:"flex", gap:8}}>
        <button onClick={onRun} disabled={loading || !prompt.trim()}>Run</button>
        <button onClick={()=>{setPrompt(""); setOut(undefined); setErr(undefined);}}>Reset</button>
      </div>
      {loading && <p>Loading…</p>}
      {err && <p style={{color:"#b45309"}}>⚠️ {err}</p>}
      {out && (
        <pre style={{background:"#f9fafb", padding:12, borderRadius:8, marginTop:12}}>{out}</pre>
      )}
    </div>
  );
}