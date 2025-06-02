import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  const [pwaEnabled, setPwaEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [localization, setLocalization] = useState('en-US');
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Localization</CardTitle>
        </CardHeader>
        <CardContent>
          <select value={localization} onChange={e => setLocalization(e.target.value)}>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español (ES)</option>
            {/* Add more locales */}
          </select>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>PWA & Offline Support</CardTitle>
        </CardHeader>
        <CardContent>
          <Switch checked={pwaEnabled} onCheckedChange={setPwaEnabled} /> Enable PWA/Offline
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} /> Enable Notifications
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>CI/CD & Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div>CI/CD and automated testing are enabled via GitHub Actions and Jest.</div>
        </CardContent>
      </Card>
    </div>
  );
}
