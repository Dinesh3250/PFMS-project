import { useEffect, useState } from "react";
import { listTx, createTx } from "./api";

export default function App() {
  const [items, setItems] = useState<any[]>([]);
  const [amount, setAmount] = useState("");

  async function refresh() { setItems(await listTx()); }
  useEffect(() => { refresh(); }, []);

  async function addDemo() {
    await createTx({ kind: "income", amount: Number(amount || 100), category: "demo" });
    setAmount(""); refresh();
  }
  return (
    <div style={{ padding: 24 }}>
      <h2>PFMS Dashboard</h2>
      <div>
        <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button onClick={addDemo}>Add Income</button>
        <button onClick={refresh}>Refresh</button>
      </div>
      <ul>
        {items.map(i => <li key={i.id}>{i.kind} ${i.amount} • {i.category}</li>)}
      </ul>
    </div>
  );
}
