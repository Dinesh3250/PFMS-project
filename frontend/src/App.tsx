import { useEffect, useState } from "react";
import { listTransactions, createTransaction } from "./api";

interface Transaction {
  id: number;
  kind: "income" | "expense";
  amount: number;
  category: string;
  note: string;
  created_at: string;
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    kind: "income" as "income" | "expense",
    amount: "",
    category: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function refreshTransactions() {
    setLoading(true);
    setError(null);
    try {
      const data = await listTransactions();
      setTransactions(data);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshTransactions();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createTransaction({
        kind: formData.kind,
        amount: Number(formData.amount),
        category: formData.category || "general",
        note: formData.note,
      });
      setFormData({ kind: "income", amount: "", category: "", note: "" });
      await refreshTransactions();
    } catch (err) {
      setError("Failed to add transaction");
    } finally {
      setSubmitting(false);
    }
  }

  const totalIncome = transactions
    .filter(t => t.kind === "income")
    .reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : 0), 0);

  const totalExpense = transactions
    .filter(t => t.kind === "expense")
    .reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : 0), 0);

  const net = totalIncome - totalExpense;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>PFMS - Personal Finance Management System</h1>

      {/* Add Transaction Form */}
      <div style={{ marginBottom: 32, padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>
              Kind:
              <select
                value={formData.kind}
                onChange={e => setFormData(prev => ({ ...prev, kind: e.target.value as "income" | "expense" }))}
                style={{ marginLeft: 8 }}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>
              Amount:
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>
              Category:
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="general"
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>
              Note:
              <input
                type="text"
                value={formData.note}
                onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Transaction"}
          </button>
        </form>
      </div>

      {/* Totals */}
      <div style={{ marginBottom: 24, padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
        <h2>Current Month Totals</h2>
        <div style={{ display: "flex", gap: 24 }}>
          <div>Income: ${totalIncome.toFixed(2)}</div>
          <div>Expense: ${totalExpense.toFixed(2)}</div>
          <div>Net: ${net.toFixed(2)}</div>
        </div>
      </div>

      {/* Transactions List */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2>Transactions</h2>
          <button onClick={refreshTransactions} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: 16, padding: 8, backgroundColor: "#ffebee", borderRadius: 4 }}>
            {error}
          </div>
        )}

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <div style={{ border: "1px solid #ccc", borderRadius: 8 }}>
            {transactions.map(tx => (
              <div key={tx.id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{tx.kind.toUpperCase()}</strong> - ${(typeof tx.amount === 'number' ? tx.amount : 0).toFixed(2)} - {tx.category}
                  </div>
                  <div style={{ fontSize: "0.9em", color: "#666" }}>
                    {new Date(tx.created_at).toLocaleDateString()}
                  </div>
                </div>
                {tx.note && <div style={{ fontSize: "0.9em", color: "#666" }}>{tx.note}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
