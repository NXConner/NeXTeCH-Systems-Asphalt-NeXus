import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function CostCalculatorPanel() {
  const [area, setArea] = useState('');
  const [cost, setCost] = useState<number | null>(null);
  const calculateCost = () => {
    // Placeholder: $2 per sq ft
    setCost(Number(area) * 2);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); calculateCost(); }} className="space-y-2">
          <input
            type="number"
            placeholder="Area (sq ft)"
            value={area}
            onChange={e => setArea(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Calculate Cost</button>
        </form>
        {cost !== null && (
          <div className="mt-2 font-bold">Estimated Cost: ${cost}</div>
        )}
      </CardContent>
    </Card>
  );
}

// TODO: Integrate with backend for real cost calculation. 