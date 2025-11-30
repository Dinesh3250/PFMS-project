const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function listTx(kind?: "income" | "expense") {
  const q = kind ? `?kind=${kind}` : "";
  const r = await fetch(`${API_BASE}/transactions/${q}`);
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export const listTransactions = listTx;

export async function createTx(input: { kind:"income"|"expense"; amount:number; category?:string; note?:string }) {
  const r = await fetch(`${API_BASE}/transactions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export const createTransaction = createTx;

export async function listBudgets(month?: string) {
  const q = month ? `?month=${encodeURIComponent(month)}` : "";
  const r = await fetch(`${API_BASE}/budgets/${q}`);
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}
export async function createBudget(input:{category:string; month:string; cap_amount:number}) {
  const r = await fetch(`${API_BASE}/budgets/`, {
    method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(input)
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export async function listReminders(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  const q = params.toString() ? `?${params.toString()}` : "";
  const r = await fetch(`${API_BASE}/reminders/${q}`);
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}
export async function createReminder(input:{name:string; due_date:string; amount:number; payee?:string; notes?:string}) {
  const r = await fetch(`${API_BASE}/reminders/`, {
    method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(input)
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export async function listGoals() {
  const r = await fetch(`${API_BASE}/goals/`);
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export async function createGoal(input:{name:string; target_amount:number; target_date?:string; category?:string; description?:string}) {
  const r = await fetch(`${API_BASE}/goals/`, {
    method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(input)
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export async function contributeToGoal(goalId: number, amount: number) {
  const r = await fetch(`${API_BASE}/goals/${goalId}/contribute`, {
    method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ amount })
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export async function deleteGoal(goalId: number) {
  const r = await fetch(`${API_BASE}/goals/${goalId}`, {
    method:"DELETE"
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}
