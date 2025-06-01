import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const devices = [
  { id: 1, name: 'Temperature Sensor', status: 'Online' },
  { id: 2, name: 'Pressure Gauge', status: 'Offline' },
  // ...add more as needed
];

export default function IoTPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IoT Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {devices.map(device => (
            <li key={device.id} className="flex justify-between items-center">
              <span>{device.name}</span>
              <span className={device.status === 'Online' ? 'text-green-600' : 'text-gray-400'}>{device.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 