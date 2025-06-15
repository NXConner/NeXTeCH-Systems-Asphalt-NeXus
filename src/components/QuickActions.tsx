import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileText, 
  Truck, 
  Package, 
  Settings, 
  Users 
} from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      label: 'New Project',
      icon: Plus,
      onClick: () => console.log('New project'),
      variant: 'default' as const
    },
    {
      label: 'Create Report',
      icon: FileText,
      onClick: () => console.log('Create report'),
      variant: 'outline' as const
    },
    {
      label: 'Add Vehicle',
      icon: Truck,
      onClick: () => console.log('Add vehicle'),
      variant: 'outline' as const
    },
    {
      label: 'Update Inventory',
      icon: Package,
      onClick: () => console.log('Update inventory'),
      variant: 'outline' as const
    },
    {
      label: 'Manage Users',
      icon: Users,
      onClick: () => console.log('Manage users'),
      variant: 'outline' as const
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => console.log('Settings'),
      variant: 'outline' as const
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant}
          onClick={action.onClick}
          className="w-full justify-start"
        >
          <action.icon className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}; 