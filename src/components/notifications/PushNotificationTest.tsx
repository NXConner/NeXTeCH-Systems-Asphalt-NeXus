import React, { useEffect, useState } from 'react';

// Only import on mobile
let PushNotifications: any = undefined;
if (typeof window !== 'undefined') {
  try {
    PushNotifications = require('@capacitor/push-notifications').PushNotifications;
  } catch {}
}

const PushNotificationTest = () => {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!PushNotifications) return;

    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        setError('Push notification permission not granted');
      }
    });

    PushNotifications.addListener('registration', (token: any) => {
      setToken(token.value);
    });

    PushNotifications.addListener('registrationError', (err: any) => {
      setError('Registration error: ' + JSON.stringify(err));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      setMessages(prev => [...prev, notification]);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      setMessages(prev => [...prev, notification]);
    });

    return () => {
      // No removeListener in Capacitor v5, but cleanup if needed
    };
  }, []);

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="font-bold mb-2">Push Notification Test</h2>
      {token && <div className="mb-2">Token: <code>{token}</code></div>}
      {error && <div className="mb-2 text-red-600">{error}</div>}
      <div className="mb-2">Messages:</div>
      <ul className="space-y-1">
        {messages.map((msg, idx) => (
          <li key={idx} className="text-xs bg-gray-100 p-1 rounded">
            {JSON.stringify(msg)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PushNotificationTest; 