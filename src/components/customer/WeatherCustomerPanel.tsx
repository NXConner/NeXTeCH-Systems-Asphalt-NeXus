import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const weather = [
  { id: 1, date: '2024-07-10', forecast: 'Sunny', alert: null },
  { id: 2, date: '2024-07-11', forecast: 'Rain', alert: 'Rain Delay' },
  // ...add more as needed
];

export default function WeatherCustomerPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather & Delays</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {weather.map(w => (
            <li key={w.id} className="flex justify-between items-center">
              <span>{w.date}</span>
              <span className="text-xs text-muted-foreground">{w.forecast}</span>
              {w.alert && <span className="text-xs text-red-600 font-bold ml-2">{w.alert}</span>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 