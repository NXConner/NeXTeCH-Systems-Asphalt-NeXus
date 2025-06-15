import React from 'react';
import { EnhancedModule } from '../ui/enhanced-module';
import { BookOpen } from 'lucide-react';

const modules = [
  { id: 1, name: 'Safety Basics', status: 'Completed' },
  { id: 2, name: 'PPE Training', status: 'In Progress' },
  // ...add more as needed
];

export default function TrainingCustomerPanel() {
  return (
    <EnhancedModule
      title="Training Modules (Customer)"
      icon={<BookOpen className="h-6 w-6 text-primary" />}
      status="active"
      description="Customer-facing required and optional training modules."
      hover
    >
      <ul className="space-y-2">
        {modules.map(m => (
          <li key={m.id} className="flex justify-between items-center">
            <span>{m.name}</span>
            <span className={m.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}>{m.status}</span>
          </li>
        ))}
      </ul>
    </EnhancedModule>
  );
} 