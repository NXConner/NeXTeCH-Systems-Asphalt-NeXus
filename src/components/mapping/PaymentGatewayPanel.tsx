import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const gateways = [
  { id: 1, name: 'Stripe', status: 'Connected' },
  { id: 2, name: 'PayPal', status: 'Not Connected' },
  // ...add more as needed
];

export default function PaymentGatewayPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateways</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {gateways.map(gw => (
            <li key={gw.id} className="flex justify-between items-center">
              <span>{gw.name}</span>
              <span className={gw.status === 'Connected' ? 'text-green-600' : 'text-red-600'}>{gw.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 