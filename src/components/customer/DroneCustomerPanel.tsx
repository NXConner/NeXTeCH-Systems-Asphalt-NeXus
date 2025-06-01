import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const images = [
  { id: 1, url: '/drone1.jpg', label: 'Jobsite Overview' },
  { id: 2, url: '/drone2.jpg', label: 'Before/After' },
  // ...add more as needed
];

export default function DroneCustomerPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drone Imagery (Customer)</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {images.map(img => (
            <li key={img.id} className="flex items-center gap-2">
              <img src={img.url} alt={img.label} className="w-24 h-16 object-cover rounded shadow" />
              <span>{img.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 