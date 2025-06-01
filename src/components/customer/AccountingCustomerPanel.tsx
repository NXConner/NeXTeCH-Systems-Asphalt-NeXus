import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function AccountingCustomerPanel() {
  const [revenue, setRevenue] = useState('');
  const [expenses, setExpenses] = useState('');
  const [roi, setRoi] = useState<number | null>(null);

  const calculateROI = () => {
    const rev = Number(revenue);
    const exp = Number(expenses);
    if (exp > 0) {
      setRoi(((rev - exp) / exp) * 100);
    } else {
      setRoi(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounting & ROI (Customer)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); calculateROI(); }} className="space-y-2">
          <input
            type="number"
            placeholder="Revenue"
            value={revenue}
            onChange={e => setRevenue(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <input
            type="number"
            placeholder="Expenses"
            value={expenses}
            onChange={e => setExpenses(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Calculate ROI</button>
        </form>
        {roi !== null && (
          <div className="mt-2 font-bold">ROI: {roi.toFixed(2)}%</div>
        )}
      </CardContent>
    </Card>
  );
} 