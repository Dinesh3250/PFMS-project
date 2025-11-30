import { useState, useEffect } from 'react';
import './App.css';

// API base URL
const API_BASE = 'http://localhost:8000';

// Predefined categories
const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Home & Garden',
  'Personal Care',
  'Insurance',
  'Other'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance Work',
  'Investments',
  'Business Income',
  'Rental Income',
  'Dividends',
  'Gifts',
  'Bonus',
  'Other'
];

// Type definitions
interface Transaction {
  id: number;
  amount: string;
  note?: string;
  category: string;
  created_at?: string;
  date?: string;
  kind: 'income' | 'expense';
}

interface Budget {
  id: number;
  category: string;
  cap_amount?: string;
  limit?: string;
  utilization?: string;
  spent?: string;
  month: string;
}

interface Reminder {
  id: number;
  name: string;
  amount: string;
  due_date: string;
  payee?: string;
  notes?: string;
  is_completed: boolean;
}

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  category: string;
  description?: string;
  is_completed: string;
  progress_percentage?: number;
}

function App() {
  const [activeTab, setActiveTab] = useState('transactions');
  
  // Transaction state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionForm, setTransactionForm] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense'
  });

  // Budget state
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    limit: '',
    month: new Date().toISOString().slice(0, 7) // YYYY-MM format
  });

  // Reminder state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderForm, setReminderForm] = useState({
    name: '',
    amount: '',
    due_date: '',
    payee: '',
    notes: ''
  });

  // Goal state
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalForm, setGoalForm] = useState({
    name: '',
    target_amount: '',
    target_date: '',
    category: 'savings',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch functions
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE}/transactions/`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`${API_BASE}/budgets/`);
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await fetch(`${API_BASE}/reminders/`);
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE}/goals/`);
      if (response.ok) {
        const data = await response.json();
        // Convert string amounts to numbers for frontend compatibility
        const processedGoals = data.map((goal: any) => ({
          ...goal,
          target_amount: parseFloat(goal.target_amount),
          current_amount: parseFloat(goal.current_amount)
        }));
        setGoals(processedGoals);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
    fetchReminders();
    fetchGoals();
  }, []);

  // Form submission handlers
  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE}/transactions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: transactionForm.type,
          amount: parseFloat(transactionForm.amount),
          category: transactionForm.category,
          note: transactionForm.description,
          date: transactionForm.date
        }),
      });
      
      if (response.ok) {
        setTransactionForm({ amount: '', description: '', category: '', date: new Date().toISOString().split('T')[0], type: 'expense' });
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE}/budgets/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: budgetForm.category,
          month: budgetForm.month,
          cap_amount: parseFloat(budgetForm.limit)
        }),
      });
      
      if (response.ok) {
        setBudgetForm({ category: '', limit: '', month: new Date().toISOString().slice(0, 7) });
        fetchBudgets();
      } else {
        const error = await response.json();
        alert(`Error creating budget: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE}/reminders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reminderForm,
          amount: parseFloat(reminderForm.amount)
        }),
      });
      
      if (response.ok) {
        setReminderForm({ name: '', amount: '', due_date: '', payee: '', notes: '' });
        fetchReminders();
      }
    } catch (error) {
      console.error('Error adding reminder:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE}/goals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...goalForm,
          target_amount: parseFloat(goalForm.target_amount),
          target_date: goalForm.target_date || null
        }),
      });
      
      if (response.ok) {
        setGoalForm({ name: '', target_amount: '', target_date: '', category: 'savings', description: '' });
        fetchGoals();
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoalContribution = async (goalId: number, amount: number) => {
    try {
      const response = await fetch(`${API_BASE}/goals/${goalId}/contribute?amount=${amount}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        fetchGoals();
      }
    } catch (error) {
      console.error('Error contributing to goal:', error);
    }
  };

  const handleGoalDelete = async (goalId: number) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        const response = await fetch(`${API_BASE}/goals/${goalId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchGoals();
        }
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  // Helper functions for insights
  const upcomingReminders = reminders.filter(reminder => {
    const dueDate = new Date(reminder.due_date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= nextWeek && !reminder.is_completed;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "transactions":
        return (
          <div>
            {/* Add Transaction Form */}
            <div style={{ 
              marginBottom: 32, 
              padding: 24, 
              border: "1px solid #e0e0e0", 
              borderRadius: 12,
              backgroundColor: "#fafafa",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "1.5em" }}>💰 Add Transaction</h2>
              <form onSubmit={handleTransactionSubmit}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr 1fr", 
                  gap: 16, 
                  marginBottom: 20 
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      💳 Type:
                    </label>
                    <select
                      value={transactionForm.type}
                      onChange={e => setTransactionForm(prev => ({ ...prev, type: e.target.value as 'income' | 'expense', category: '' }))}
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        backgroundColor: "white",
                        boxSizing: "border-box"
                      }}
                    >
                      <option value="expense">💸 Expense</option>
                      <option value="income">💵 Income</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      💰 Amount ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={transactionForm.amount}
                      onChange={e => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                      required
                      placeholder="0.00"
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      📅 Date:
                    </label>
                    <input
                      type="date"
                      value={transactionForm.date}
                      onChange={e => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                      style={{ 
                        width: "100%", 
                        padding: "12px", 
                        height: "44px",
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                    📝 Description:
                  </label>
                  <input
                    type="text"
                    value={transactionForm.description}
                    onChange={e => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    placeholder="What was this transaction for?"
                    style={{ 
                      width: "100%", 
                      padding: "12px", height: "44px", 
                      border: "2px solid #e0e0e0", 
                      borderRadius: 8,
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                    🏷️ Category:
                  </label>
                  <select
                    value={transactionForm.category}
                    onChange={e => setTransactionForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                    style={{ 
                      width: "100%", 
                      padding: "12px", height: "44px", 
                      border: "2px solid #e0e0e0", 
                      borderRadius: 8,
                      fontSize: "14px",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="">Select a category</option>
                    {(transactionForm.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    backgroundColor: submitting ? "#ccc" : "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s"
                  }}
                >
                  {submitting ? "⏳ Adding..." : "✅ Add Transaction"}
                </button>
              </form>
            </div>

            {/* Transactions List */}
            <div>
              <h2 style={{ color: "#333", fontSize: "1.4em", marginBottom: 16 }}>📊 Recent Transactions</h2>
              {transactions.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: 40,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  color: "#666"
                }}>
                  <div style={{ fontSize: "3em", marginBottom: 16 }}>📝</div>
                  <p>No transactions yet. Add your first transaction above!</p>
                </div>
              ) : (
                <div style={{ 
                  border: "1px solid #e0e0e0", 
                  borderRadius: 12,
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  {transactions.slice().reverse().map((transaction, index) => (
                    <div key={transaction.id} style={{ 
                      padding: 16, 
                      borderBottom: index < transactions.length - 1 ? "1px solid #f0f0f0" : "none",
                      transition: "background-color 0.2s"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: "bold", 
                            fontSize: "1.1em",
                            color: "#333",
                            marginBottom: 4
                          }}>
                            {transaction.kind === 'income' ? '💵' : '💸'} {transaction.note || 'No description'}
                          </div>
                          <div style={{ 
                            fontSize: "0.9em", 
                            color: "#666",
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                          }}>
                            <span style={{
                              backgroundColor: transaction.kind === 'income' ? '#e8f5e8' : '#ffebee',
                              color: transaction.kind === 'income' ? '#4caf50' : '#f44336',
                              padding: "2px 8px",
                              borderRadius: 12,
                              fontSize: "0.8em",
                              fontWeight: "bold"
                            }}>
                              {transaction.category}
                            </span>
                            <span>•</span>
                            <span>{new Date(transaction.created_at || transaction.date || new Date()).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div style={{
                          fontWeight: "bold",
                          fontSize: "1.2em",
                          color: transaction.kind === 'income' ? "#4caf50" : "#f44336"
                        }}>
                          {transaction.kind === 'income' ? '+' : '-'}${parseFloat(transaction.amount.toString()).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "budgets":
        return (
          <div>
            {/* Add Budget Form */}
            <div style={{ 
              marginBottom: 32, 
              padding: 24, 
              border: "1px solid #e0e0e0", 
              borderRadius: 12,
              backgroundColor: "#fafafa",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "1.5em" }}>🎯 Set Budget</h2>
              <form onSubmit={handleBudgetSubmit}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: 16, 
                  marginBottom: 20 
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      🏷️ Category:
                    </label>
                    <select
                      value={budgetForm.category}
                      onChange={e => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                      required
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        backgroundColor: "white",
                        boxSizing: "border-box"
                      }}
                    >
                      <option value="">Select a category</option>
                      {EXPENSE_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      💰 Budget Limit ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={budgetForm.limit}
                      onChange={e => setBudgetForm(prev => ({ ...prev, limit: e.target.value }))}
                      required
                      placeholder="0.00"
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                    📅 Month:
                  </label>
                  <input
                    type="month"
                    value={budgetForm.month}
                    onChange={e => setBudgetForm(prev => ({ ...prev, month: e.target.value }))}
                    required
                    style={{ 
                      width: "100%", 
                      padding: "12px", 
                      height: "44px",
                      border: "2px solid #e0e0e0", 
                      borderRadius: 8,
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    backgroundColor: submitting ? "#ccc" : "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s"
                  }}
                >
                  {submitting ? "⏳ Setting..." : "🎯 Set Budget"}
                </button>
              </form>
            </div>

            {/* Budget Dashboard */}
            <div>
              <h2 style={{ color: "#333", fontSize: "1.4em", marginBottom: 16 }}>📊 Budget Dashboard</h2>
              {budgets.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: 40,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  color: "#666"
                }}>
                  <div style={{ fontSize: "3em", marginBottom: 16 }}>🎯</div>
                  <p>No budgets set yet. Create one above!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 20 }}>
                  {budgets.map(budget => {
                    const limit = parseFloat(budget.cap_amount || budget.limit || '0');
                    const spent = parseFloat(budget.utilization || budget.spent || '0');
                    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
                    const isOverBudget = spent > limit;
                    const remaining = limit - spent;
                    
                    return (
                      <div key={budget.id} style={{ 
                        padding: 20, 
                        border: `2px solid ${isOverBudget ? '#f44336' : '#e0e0e0'}`, 
                        borderRadius: 12,
                        backgroundColor: isOverBudget ? '#ffebee' : 'white',
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                          <div>
                            <h3 style={{ margin: "0 0 4px 0", fontSize: "1.3em", color: isOverBudget ? "#f44336" : "#333" }}>
                              🏷️ {budget.category}
                            </h3>
                            <div style={{ fontSize: "0.9em", color: "#666" }}>
                              📅 {new Date(budget.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "1.4em", fontWeight: "bold", color: isOverBudget ? "#f44336" : "#333" }}>
                              ${spent.toFixed(2)} / ${limit.toFixed(2)}
                            </div>
                            <div style={{ fontSize: "0.9em", color: isOverBudget ? "#f44336" : "#4caf50", fontWeight: "bold" }}>
                              {isOverBudget ? `💸 Over by $${(spent - limit).toFixed(2)}` : `💰 $${remaining.toFixed(2)} remaining`}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ 
                          height: 12, 
                          backgroundColor: "#e0e0e0", 
                          borderRadius: 6, 
                          overflow: "hidden",
                          marginBottom: 8
                        }}>
                          <div style={{
                            height: "100%",
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: isOverBudget ? "#f44336" : percentage > 80 ? "#ff9800" : "#4caf50",
                            transition: "width 0.5s ease",
                            borderRadius: percentage >= 100 ? "6px" : "6px 0 0 6px"
                          }} />
                        </div>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: "0.9em", fontWeight: "bold", color: isOverBudget ? "#f44336" : "#666" }}>
                            {percentage.toFixed(1)}% used
                          </div>
                          {percentage > 80 && !isOverBudget && (
                            <div style={{ fontSize: "0.8em", color: "#ff9800", fontWeight: "bold" }}>
                              ⚠️ Approaching limit
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case "reminders":
        return (
          <div>
            {/* Add Reminder Form */}
            <div style={{ 
              marginBottom: 32, 
              padding: 24, 
              border: "1px solid #e0e0e0", 
              borderRadius: 12,
              backgroundColor: "#fafafa",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "1.5em" }}>⏰ Add Bill Reminder</h2>
              <form onSubmit={handleReminderSubmit}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr 1fr", 
                  gap: 16, 
                  marginBottom: 20 
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      📋 Bill Name:
                    </label>
                    <input
                      type="text"
                      value={reminderForm.name}
                      onChange={e => setReminderForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Electric Bill, Rent"
                      required
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      💰 Amount ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={reminderForm.amount}
                      onChange={e => setReminderForm(prev => ({ ...prev, amount: e.target.value }))}
                      required
                      placeholder="0.00"
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      📅 Due Date:
                    </label>
                    <input
                      type="date"
                      value={reminderForm.due_date}
                      onChange={e => setReminderForm(prev => ({ ...prev, due_date: e.target.value }))}
                      required
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: 16, 
                  marginBottom: 20 
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      🏢 Payee:
                    </label>
                    <input
                      type="text"
                      value={reminderForm.payee}
                      onChange={e => setReminderForm(prev => ({ ...prev, payee: e.target.value }))}
                      placeholder="Optional - Company or person"
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      📝 Notes:
                    </label>
                    <input
                      type="text"
                      value={reminderForm.notes}
                      onChange={e => setReminderForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Optional notes"
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    backgroundColor: submitting ? "#ccc" : "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "background-color 0.3s ease"
                  }}
                >
                  {submitting ? "Adding..." : "⏰ Add Reminder"}
                </button>
              </form>
            </div>

            {/* Upcoming Reminders */}
            <div style={{ marginBottom: 32 }}>
              <h2>Upcoming Bills (Next 7 Days)</h2>
              {upcomingReminders.length === 0 ? (
                <p>No upcoming bills in the next 7 days.</p>
              ) : (
                <div style={{ border: "1px solid #ccc", borderRadius: 8 }}>
                  {upcomingReminders.map(reminder => {
                    const daysUntilDue = Math.ceil(
                      (new Date(reminder.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isUrgent = daysUntilDue <= 2;
                    return (
                      <div key={reminder.id} style={{
                        padding: 12,
                        borderBottom: "1px solid #eee",
                        backgroundColor: isUrgent ? "#ffebee" : "#f9f9f9"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: "bold", color: isUrgent ? "#f44336" : "#333" }}>
                              {reminder.name}
                            </div>
                            <div style={{ fontSize: "0.9em", color: "#666" }}>
                              Due: {new Date(reminder.due_date).toLocaleDateString()} ({daysUntilDue} days)
                            </div>
                            {reminder.payee && (
                              <div style={{ fontSize: "0.9em", color: "#666" }}>Payee: {reminder.payee}</div>
                            )}
                          </div>
                          <div style={{ textAlign: "right", fontWeight: "bold", color: isUrgent ? "#f44336" : "#333" }}>
                            ${parseFloat(reminder.amount.toString()).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* All Reminders */}
            <div>
              <h2>All Reminders</h2>
              {reminders.length === 0 ? (
                <p>No reminders yet.</p>
              ) : (
                <div style={{ border: "1px solid #ccc", borderRadius: 8 }}>
                  {reminders.map(reminder => (
                    <div key={reminder.id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: "bold" }}>{reminder.name}</div>
                          <div style={{ fontSize: "0.9em", color: "#666" }}>
                            Due: {new Date(reminder.due_date).toLocaleDateString()}
                          </div>
                          {reminder.payee && (
                            <div style={{ fontSize: "0.9em", color: "#666" }}>Payee: {reminder.payee}</div>
                          )}
                          {reminder.notes && (
                            <div style={{ fontSize: "0.9em", color: "#666" }}>Notes: {reminder.notes}</div>
                          )}
                        </div>
                        <div style={{ textAlign: "right", fontWeight: "bold" }}>
                          ${parseFloat(reminder.amount.toString()).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "goals":
        return (
          <div>
            {/* Add Goal Form */}
            <div style={{ 
              marginBottom: 32, 
              padding: 24, 
              border: "1px solid #e0e0e0", 
              borderRadius: 12,
              backgroundColor: "#fafafa",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "1.5em" }}>🎯 Create Savings Goal</h2>
              <form onSubmit={handleGoalSubmit}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr 1fr", 
                  gap: 16, 
                  marginBottom: 20 
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      🎯 Goal Name:
                    </label>
                    <input
                      type="text"
                      value={goalForm.name}
                      onChange={e => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Emergency Fund, Vacation, New Car"
                      required
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      💰 Target Amount ($):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={goalForm.target_amount}
                      onChange={e => setGoalForm(prev => ({ ...prev, target_amount: e.target.value }))}
                      required
                      placeholder="0.00"
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      📅 Target Date:
                    </label>
                    <input
                      type="date"
                      value={goalForm.target_date}
                      onChange={e => setGoalForm(prev => ({ ...prev, target_date: e.target.value }))}
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: 16, 
                  marginBottom: 20 
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      🏷️ Category:
                    </label>
                    <select
                      value={goalForm.category}
                      onChange={e => setGoalForm(prev => ({ ...prev, category: e.target.value }))}
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        backgroundColor: "white",
                        boxSizing: "border-box"
                      }}
                    >
                      <option value="savings">💰 Savings</option>
                      <option value="emergency">🚨 Emergency Fund</option>
                      <option value="vacation">🏖️ Vacation</option>
                      <option value="purchase">🛒 Major Purchase</option>
                      <option value="other">📋 Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: "bold", color: "#555" }}>
                      📝 Description:
                    </label>
                    <input
                      type="text"
                      value={goalForm.description}
                      onChange={e => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description"
                      style={{ 
                        width: "100%", 
                        padding: "12px", height: "44px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: 8,
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    backgroundColor: submitting ? "#ccc" : "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "background-color 0.3s ease"
                  }}
                >
                  {submitting ? "Creating..." : "🎯 Create Goal"}
                </button>
              </form>
            </div>

            {/* Goals List */}
            <div>
              <h2>Your Goals</h2>
              {goals.length === 0 ? (
                <p>No goals set yet. Create one above!</p>
              ) : (
                <div style={{ display: "grid", gap: 16 }}>
                  {goals.map(goal => {
                    const progress = goal.progress_percentage || 0;
                    const isCompleted = goal.is_completed === "true";
                    
                    return (
                      <div key={goal.id} style={{ 
                        padding: 16, 
                        border: "1px solid #ccc", 
                        borderRadius: 8,
                        backgroundColor: isCompleted ? "#e8f5e8" : "#f9f9f9"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div>
                            <h3 style={{ margin: "0 0 4px 0", color: isCompleted ? "#4caf50" : "#333" }}>
                              {goal.name} {isCompleted && "✓"}
                            </h3>
                            <div style={{ fontSize: "0.9em", color: "#666" }}>
                              ${goal.current_amount.toFixed(2)} of ${goal.target_amount.toFixed(2)}
                            </div>
                            {goal.target_date && (
                              <div style={{ fontSize: "0.9em", color: "#666" }}>
                                Target: {new Date(goal.target_date).toLocaleDateString()}
                              </div>
                            )}
                            {goal.description && (
                              <div style={{ fontSize: "0.9em", color: "#666" }}>
                                {goal.description}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "1.2em", fontWeight: "bold", color: isCompleted ? "#4caf50" : "#333" }}>
                              {progress.toFixed(1)}%
                            </div>
                            <div style={{ fontSize: "0.8em", color: "#666" }}>
                              {goal.category}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ 
                            height: 8, 
                            backgroundColor: "#e0e0e0", 
                            borderRadius: 4, 
                            overflow: "hidden" 
                          }}>
                            <div style={{
                              height: "100%",
                              width: `${Math.min(progress, 100)}%`,
                              backgroundColor: isCompleted ? "#4caf50" : "#2196f3",
                              transition: "width 0.3s ease"
                            }} />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {!isCompleted && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="Amount to add"
                              style={{ flex: 1, padding: "12px 8px", height: "44px" }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const amount = parseFloat((e.target as HTMLInputElement).value);
                                  if (amount > 0) {
                                    handleGoalContribution(goal.id, amount);
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }
                              }}
                            />
                            <button 
                              onClick={(event) => {
                                const input = (event?.target as HTMLElement)?.previousElementSibling as HTMLInputElement;
                                const amount = parseFloat(input.value);
                                if (amount > 0) {
                                  handleGoalContribution(goal.id, amount);
                                  input.value = '';
                                }
                              }}
                              style={{ padding: "4px 12px" }}
                            >
                              Add
                            </button>
                            <button 
                              onClick={() => handleGoalDelete(goal.id)}
                              style={{ padding: "4px 12px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px" }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case "insights":
        const insightsTotalIncome = transactions
          .filter(t => t.kind === 'income')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const insightsTotalExpenses = transactions
          .filter(t => t.kind === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const categoryExpenses = transactions
          .filter(t => t.kind === 'expense')
          .reduce((acc, t) => {
            const category = t.category;
            acc[category] = (acc[category] || 0) + parseFloat(t.amount);
            return acc;
          }, {} as Record<string, number>);

        const monthlyData = transactions.reduce((acc, t) => {
          const month = (t.created_at || t.date || '').slice(0, 7);
          if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
          acc[month][t.kind === 'income' ? 'income' : 'expenses'] += parseFloat(t.amount);
          return acc;
        }, {} as Record<string, { income: number; expenses: number }>);

        return (
          <div>
            <h2 style={{ color: "#333", fontSize: "1.6em", marginBottom: 24, textAlign: "center" }}>📊 Financial Insights</h2>
            
            {/* Summary Cards */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: 20, 
              marginBottom: 40 
            }}>
              <div style={{ 
                padding: 20, 
                border: "2px solid #4caf50", 
                borderRadius: 12, 
                backgroundColor: "#e8f5e8",
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2em", marginBottom: 8 }}>💵</div>
                <h3 style={{ margin: "0 0 8px 0", color: "#4caf50", fontSize: "1.1em" }}>Total Income</h3>
                <div style={{ fontSize: "2em", fontWeight: "bold", color: "#2e7d32" }}>${insightsTotalIncome.toFixed(2)}</div>
              </div>
              <div style={{ 
                padding: 20, 
                border: "2px solid #f44336", 
                borderRadius: 12, 
                backgroundColor: "#ffebee",
                boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2em", marginBottom: 8 }}>💸</div>
                <h3 style={{ margin: "0 0 8px 0", color: "#f44336", fontSize: "1.1em" }}>Total Expenses</h3>
                <div style={{ fontSize: "2em", fontWeight: "bold", color: "#c62828" }}>${insightsTotalExpenses.toFixed(2)}</div>
              </div>
              <div style={{ 
                padding: 20, 
                border: `2px solid ${insightsTotalIncome - insightsTotalExpenses >= 0 ? '#9c27b0' : '#f44336'}`, 
                borderRadius: 12, 
                backgroundColor: insightsTotalIncome - insightsTotalExpenses >= 0 ? "#f3e5f5" : "#ffebee",
                boxShadow: `0 4px 12px rgba(${insightsTotalIncome - insightsTotalExpenses >= 0 ? '156, 39, 176' : '244, 67, 54'}, 0.2)`,
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2em", marginBottom: 8 }}>{insightsTotalIncome - insightsTotalExpenses >= 0 ? '📈' : '📉'}</div>
                <h3 style={{ margin: "0 0 8px 0", color: insightsTotalIncome - insightsTotalExpenses >= 0 ? "#9c27b0" : "#f44336", fontSize: "1.1em" }}>Net Income</h3>
                <div style={{ 
                  fontSize: "2em", 
                  fontWeight: "bold", 
                  color: insightsTotalIncome - insightsTotalExpenses >= 0 ? "#7b1fa2" : "#c62828"
                }}>
                  ${(insightsTotalIncome - insightsTotalExpenses).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Spending by Category */}
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ color: "#333", fontSize: "1.3em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🏷️</span> Spending by Category
              </h3>
              {Object.keys(categoryExpenses).length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: 40,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  color: "#666"
                }}>
                  <div style={{ fontSize: "3em", marginBottom: 16 }}>📊</div>
                  <p>No expense data available yet. Start adding expenses to see insights!</p>
                </div>
              ) : (
                <div style={{ 
                  border: "1px solid #e0e0e0", 
                  borderRadius: 12,
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  {Object.entries(categoryExpenses)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount], index) => {
                      const percentage = insightsTotalExpenses > 0 ? (amount / insightsTotalExpenses) * 100 : 0;
                      return (
                        <div key={category} style={{ 
                          padding: 16, 
                          borderBottom: index < Object.entries(categoryExpenses).length - 1 ? "1px solid #f0f0f0" : "none"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontWeight: "bold", fontSize: "1.1em", color: "#333" }}>📁 {category}</span>
                            <span style={{ fontWeight: "bold", fontSize: "1.1em", color: "#f44336" }}>
                              ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div style={{ height: 8, backgroundColor: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: `${percentage}%`,
                              backgroundColor: `hsl(${220 - (index * 30) % 360}, 70%, 50%)`,
                              transition: "width 0.5s ease"
                            }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Monthly Overview */}
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ color: "#333", fontSize: "1.3em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span>📅</span> Monthly Overview
              </h3>
              {Object.keys(monthlyData).length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: 40,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  color: "#666"
                }}>
                  <div style={{ fontSize: "3em", marginBottom: 16 }}>📈</div>
                  <p>No monthly data available yet. Add some transactions to see trends!</p>
                </div>
              ) : (
                <div style={{ 
                  border: "1px solid #e0e0e0", 
                  borderRadius: 12,
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  {Object.entries(monthlyData)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([month, data], index) => (
                      <div key={month} style={{ 
                        padding: 20, 
                        borderBottom: index < Object.entries(monthlyData).length - 1 ? "1px solid #f0f0f0" : "none"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h4 style={{ margin: 0, fontSize: "1.2em", color: "#333" }}>
                            📆 {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                          </h4>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#4caf50", fontWeight: "bold", marginBottom: 4 }}>
                              💵 Income: ${data.income.toFixed(2)}
                            </div>
                            <div style={{ color: "#f44336", fontWeight: "bold", marginBottom: 4 }}>
                              💸 Expenses: ${data.expenses.toFixed(2)}
                            </div>
                            <div style={{ 
                              fontWeight: "bold", 
                              fontSize: "1.1em",
                              color: data.income - data.expenses >= 0 ? "#4caf50" : "#f44336",
                              padding: "12px 8px", height: "44px",
                              borderRadius: 8,
                              backgroundColor: data.income - data.expenses >= 0 ? "#e8f5e8" : "#ffebee"
                            }}>
                              📊 Net: ${(data.income - data.expenses).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Upcoming Bills Summary */}
            <div>
              <h3 style={{ color: "#333", fontSize: "1.3em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span>⏰</span> Upcoming Bills Summary
              </h3>
              {upcomingReminders.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: 40,
                  backgroundColor: "#e8f5e8",
                  borderRadius: 12,
                  border: "2px solid #4caf50",
                  color: "#2e7d32"
                }}>
                  <div style={{ fontSize: "3em", marginBottom: 16 }}>✅</div>
                  <p style={{ fontWeight: "bold" }}>No upcoming bills in the next 7 days. You're all set!</p>
                </div>
              ) : (
                <div style={{ 
                  border: "2px solid #ff9800", 
                  borderRadius: 12, 
                  padding: 20,
                  backgroundColor: "#fff3e0",
                  boxShadow: "0 4px 12px rgba(255, 152, 0, 0.2)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: "2em" }}>⚠️</div>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "1.2em", color: "#f57400" }}>
                        You have {upcomingReminders.length} bill{upcomingReminders.length > 1 ? 's' : ''} due in the next 7 days
                      </div>
                      <div style={{ fontSize: "1.4em", fontWeight: "bold", color: "#e65100", marginTop: 4 }}>
                        💰 Total amount: ${upcomingReminders.reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <header style={{ 
        textAlign: "center", 
        marginBottom: "40px",
        padding: "32px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ margin: "0 0 12px 0", fontSize: "2.5em", fontWeight: "bold" }}>
          💰 Personal Finance Manager
        </h1>
        <p style={{ margin: 0, fontSize: "1.2em", opacity: 0.9 }}>
          Track your transactions, budgets, reminders, and financial goals with ease
        </p>
      </header>

      {/* Tab Navigation */}
      <div style={{ 
        borderBottom: "3px solid #e0e0e0", 
        marginBottom: "40px",
        display: "flex",
        gap: "0",
        backgroundColor: "white",
        borderRadius: "12px 12px 0 0",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        {[
          { id: "transactions", label: "💳 Transactions", color: "#4caf50" },
          { id: "budgets", label: "🎯 Budgets", color: "#2196f3" },
          { id: "reminders", label: "⏰ Reminders", color: "#ff9800" },
          { id: "goals", label: "🎯 Goals", color: "#9c27b0" },
          { id: "insights", label: "📊 Insights", color: "#f44336" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "16px 12px",
              border: "none",
              borderBottom: activeTab === tab.id ? `4px solid ${tab.color}` : "4px solid transparent",
              backgroundColor: activeTab === tab.id ? "#f8f9fa" : "white",
              cursor: "pointer",
              fontWeight: activeTab === tab.id ? "bold" : "normal",
              color: activeTab === tab.id ? tab.color : "#666",
              fontSize: "14px",
              transition: "all 0.3s ease",
              borderRadius: activeTab === tab.id ? "8px 8px 0 0" : "0"
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = "#f0f0f0";
                target.style.color = tab.color;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = "white";
                target.style.color = "#666";
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ 
        minHeight: "500px",
        padding: "20px",
        backgroundColor: "#fafafa",
        borderRadius: "0 0 12px 12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;
