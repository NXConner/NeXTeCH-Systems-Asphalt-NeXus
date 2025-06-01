import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function PCICalculator() {
  const [area, setArea] = useState('');
  const [distress, setDistress] = useState('');
  const [pci, setPci] = useState<number | null>(null);

  const calculatePCI = () => {
    // Placeholder: PCI = 100 - distress (simple demo)
    const pciValue = 100 - Number(distress);
    setPci(pciValue > 0 ? pciValue : 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PCI Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); calculatePCI(); }} className="space-y-2">
          <input
            type="number"
            placeholder="Area (sq ft)"
            value={area}
            onChange={e => setArea(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <input
            type="number"
            placeholder="Distress Value (0-100)"
            value={distress}
            onChange={e => setDistress(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Calculate PCI</button>
        </form>
        {pci !== null && (
          <div className="mt-2 font-bold">PCI: {pci}</div>
        )}
      </CardContent>
    </Card>
  );
} 