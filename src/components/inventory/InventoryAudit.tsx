import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const initialAudit = [
  { id: 1, item: 'Sealant Drum', code: '123456', status: 'Scanned' },
  { id: 2, item: 'Asphalt Bag', code: '654321', status: 'Pending' },
];

export function InventoryAudit() {
  const [audit, setAudit] = useState(initialAudit);
  const scan = () => {
    // Simulate scan
    setAudit(audit.map(a => a.status === 'Pending' ? { ...a, status: 'Scanned' } : a));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Audit</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={scan}>Scan Barcode/RFID</Button>
        <ul className="mt-4">
          {audit.map(a => (
            <li key={a.id}>{a.item} ({a.code}) - {a.status}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default InventoryAudit; 