import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useSafetyChecklists } from '@/hooks/useSafetyChecklists';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const checklistItems = [
  { id: 1, label: 'PPE Worn', checked: false },
  { id: 2, label: 'Site Secured', checked: false },
  // ...add more as needed
];

export default function SafetyChecklistCustomerPanel({ employeeId = 'emp-1' }) {
  const { checklists, isLoading, error, addChecklist } = useSafetyChecklists(employeeId);
  const [items, setItems] = useState(checklistItems);
  const handleToggle = (id: number) => {
    setItems(items => items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Safety Checklist (Customer)</CardTitle>
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
        <Button onClick={async () => {
          try {
            await addChecklist.mutateAsync({
              date: new Date().toISOString().split('T')[0],
              employee_id: employeeId,
              items,
              notes: '',
            });
            setItems([]);
            toast.success('Safety checklist saved!');
          } catch (e) {
            toast.error('Failed to save checklist');
          }
        }}>Save Checklist</Button>
      </CardContent>
    </Card>
  );
} 