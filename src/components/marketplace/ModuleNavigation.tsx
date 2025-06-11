import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  Package,
  Download,
  Settings,
  History,
  Star,
  AlertCircle
} from 'lucide-react';

const navigation = [
  {
    name: 'All Modules',
    href: '/marketplace',
    icon: Package
  },
  {
    name: 'Installed',
    href: '/marketplace/installed',
    icon: Download
  },
  {
    name: 'Updates',
    href: '/marketplace/updates',
    icon: History
  },
  {
    name: 'Featured',
    href: '/marketplace/featured',
    icon: Star
  },
  {
    name: 'Settings',
    href: '/marketplace/settings',
    icon: Settings
  }
];

export default function ModuleNavigation() {
  const location = useLocation();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon
              className={cn(
                'mr-3 h-5 w-5',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            />
            {item.name}
            {item.name === 'Updates' && (
              <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                3
              </span>
            )}
          </Link>
        );
      })}

      <div className="pt-4 mt-4 border-t">
        <div className="px-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </h3>
        </div>
        <div className="mt-2 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              // TODO: Implement refresh modules
            }}
          >
            <Package className="mr-3 h-5 w-5" />
            Refresh Modules
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              // TODO: Implement check for updates
            }}
          >
            <AlertCircle className="mr-3 h-5 w-5" />
            Check for Updates
          </Button>
        </div>
      </div>
    </nav>
  );
} 