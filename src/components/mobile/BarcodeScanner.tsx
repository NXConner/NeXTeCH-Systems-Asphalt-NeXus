import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BarcodeScanner() {
  const [code, setCode] = useState<string|null>(null);
  const scan = () => setCode('1234567890 (mock)');
  return (
    <div className="p-4 border rounded">
      <Button onClick={scan}>Scan Barcode</Button>
      {code && <div className="mt-2">Barcode: {code}</div>}
    </div>
  );
} 