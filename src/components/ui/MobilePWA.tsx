import React from 'react';
import { Button } from './button';

const mobilePwaOptions = [
  { id: 1, name: 'Install App', action: 'install' },
  { id: 2, name: 'Enable Notifications', action: 'notifications' },
  { id: 3, name: 'Offline Mode', action: 'offline' },
];

function handleMobilePwa(action: string) {
  if (action === 'notifications') {
    if (typeof window !== 'undefined') {
      try {
        const { PushNotifications } = require('@capacitor/push-notifications');
        PushNotifications.requestPermissions().then(result => {
          if (result.receive === 'granted') {
            PushNotifications.register();
          } else {
            alert('Push notification permission not granted');
          }
        });
      } catch (e) {
        alert('PushNotifications plugin not available.');
      }
    }
  } else {
    console.log(`Mobile/PWA action: ${action}`);
  }
}

const MobilePWA = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Mobile / PWA</h2>
    <ul>
      {mobilePwaOptions.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.name}</span>
          <Button onClick={() => handleMobilePwa(option.action)} size="sm">Trigger</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default MobilePWA; 