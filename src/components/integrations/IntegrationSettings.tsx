import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const integrations = [
  { id: 1, name: 'QuickBooks', status: 'Connected' },
  { id: 2, name: 'ERP', status: 'Not Connected' },
  { id: 3, name: 'Weather API', status: 'Connected' },
  { id: 4, name: 'Mapping', status: 'Connected' },
];

export default function IntegrationSettings() {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const sync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setError(Math.random() > 0.8 ? 'Sync failed. Please try again.' : '');
    }, 1000);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mb-4">
          {integrations.map(i => (
            <li key={i.id}>{i.name} - {i.status}</li>
          ))}
        </ul>
        <Button onClick={sync} disabled={syncing}>{syncing ? 'Syncing...' : 'Sync Now'}</Button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </CardContent>
    </Card>
  );
} 