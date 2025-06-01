import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const checklistItems = [
  { id: 1, label: 'PPE Worn', checked: false },
  { id: 2, label: 'Equipment Inspected', checked: false },
  { id: 3, label: 'Site Secured', checked: false },
  // ...add more as needed
];

export default function SafetyChecklistPanel() {
  const [items, setItems] = useState(checklistItems);
  const handleToggle = (id: number) => {
    setItems(items => items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Safety Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="flex items-center gap-2">
              <input type="checkbox" checked={item.checked} onChange={() => handleToggle(item.id)} title={`Mark ${item.label} as complete`} />
              <span className={item.checked ? 'line-through text-green-600' : ''}>{item.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 