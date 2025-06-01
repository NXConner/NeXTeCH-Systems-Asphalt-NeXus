import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BackgroundSyncTest() {
  const [msg, setMsg] = useState('');
  const sync = () => setMsg('Background sync triggered! (mock)');
  return (
    <div className="p-4 border rounded">
      <Button onClick={sync}>Trigger Background Sync</Button>
      {msg && <div className="mt-2 text-green-600">{msg}</div>}
    </div>
  );
} 