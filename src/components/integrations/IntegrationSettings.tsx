import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const integrations = [
  { id: 1, name: 'QuickBooks', status: 'Connected' },
  { id: 2, name: 'ERP', status: 'Not Connected' },
  { id: 3, name: 'Weather API', status: 'Connected' },
  { id: 4, name: 'Mapping', status: 'Connected' },
  // TODO: Add more integrations and make them functional
];

export default function IntegrationSettings() {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase.from('integrations').select('*');
      if (data) {
        const statusMap: Record<string, string> = {};
        data.forEach((i: any) => { statusMap[i.type] = i.status; });
        setIntegrationStatus(statusMap);
      }
    };
    fetchStatus();
  }, []);

  const connectIntegration = async (type: string) => {
    await supabase.from('integrations').upsert({ type, status: 'Connected' });
    setIntegrationStatus((prev) => ({ ...prev, [type]: 'Connected' }));
  };
  const disconnectIntegration = async (type: string) => {
    await supabase.from('integrations').upsert({ type, status: 'Not Connected' });
    setIntegrationStatus((prev) => ({ ...prev, [type]: 'Not Connected' }));
  };

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
        <CardTitle>Integration Settings (more integrations pending)</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mb-4">
          {integrations.map(i => (
            <li key={i.id}>
              {i.name} - {integrationStatus[i.name] || i.status}
              {integrationStatus[i.name] !== 'Connected' ? (
                <Button onClick={() => connectIntegration(i.name)} className="ml-2">Connect</Button>
              ) : (
                <Button onClick={() => disconnectIntegration(i.name)} className="ml-2">Disconnect</Button>
              )}
            </li>
          ))}
        </ul>
        <Button onClick={sync} disabled={syncing}>{syncing ? 'Syncing...' : 'Sync Now'}</Button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </CardContent>
    </Card>
  );
} 