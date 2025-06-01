import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function RFIDScanner() {
  const [code, setCode] = useState<string|null>(null);
  const scan = () => setCode('RFID-987654321 (mock)');
  return (
    <div className="p-4 border rounded">
      <Button onClick={scan}>Scan RFID</Button>
      {code && <div className="mt-2">RFID: {code}</div>}
    </div>
  );
} 