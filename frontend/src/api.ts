const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function listTx(kind?: "income" | "expense") {
  const q = kind ? `?kind=${kind}` : "";
  const r = await fetch(`${API_BASE}/transactions/${q}`);
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export async function createTx(input: { kind:"income"|"expense"; amount:number; category?:string; note?:string }) {
  const r = await fetch(`${API_BASE}/transactions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}
