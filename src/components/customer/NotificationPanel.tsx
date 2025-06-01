import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { apiService } from '../../services/apiService';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiService.getNotifications()
      .then(setNotifications)
      .catch(err => setError(err.message || 'Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <ul className="space-y-2">
            {notifications.map(n => (
              <li key={n.id} className="flex justify-between items-center">
                <span>{n.message}</span>
                <span className={n.type === 'alert' ? 'text-red-600' : n.type === 'reminder' ? 'text-yellow-600' : 'text-green-600'}>{n.type}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
} 