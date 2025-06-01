import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { apiService } from '../../services/apiService';

export default function ExpenseTrackingPanel() {
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiService.createExpense({ amount: Number(amount), receipt_url: receipt ? receipt.name : null });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-green-600">Expense submitted!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
            />
            <label htmlFor="expense-receipt" className="sr-only">Upload receipt file</label>
            <input
              id="expense-receipt"
              type="file"
              accept="image/*,application/pdf"
              onChange={e => setReceipt(e.target.files?.[0] || null)}
              className="border rounded px-2 py-1 w-full"
              title="Upload receipt file"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit Expense'}</button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
        )}
      </CardContent>
    </Card>
  );
} 