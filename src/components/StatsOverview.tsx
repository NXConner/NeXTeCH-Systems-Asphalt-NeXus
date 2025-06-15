import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Truck, 
  Wrench, 
  Package, 
  AlertTriangle 
} from 'lucide-react';

interface Stats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  totalVehicles: number;
  activeVehicles: number;
  maintenanceDue: number;
  totalInventory: number;
  lowStock: number;
  reorderNeeded: number;
}

interface StatsOverviewProps {
  stats: Stats;
  loading: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Projects',
      icon: Briefcase,
      stats: [
        { label: 'Total', value: stats.totalProjects },
        { label: 'Active', value: stats.activeProjects },
        { label: 'Completed', value: stats.completedProjects }
      ]
    },
    {
      title: 'Tasks',
      icon: CheckCircle,
      stats: [
        { label: 'Total', value: stats.totalTasks },
        { label: 'Pending', value: stats.pendingTasks },
        { label: 'Completed', value: stats.completedTasks }
      ]
    },
    {
      title: 'Fleet',
      icon: Truck,
      stats: [
        { label: 'Total', value: stats.totalVehicles },
        { label: 'Active', value: stats.activeVehicles },
        { label: 'Maintenance Due', value: stats.maintenanceDue }
      ]
    },
    {
      title: 'Inventory',
      icon: Package,
      stats: [
        { label: 'Total Items', value: stats.totalInventory },
        { label: 'Low Stock', value: stats.lowStock },
        { label: 'Reorder Needed', value: stats.reorderNeeded }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {card.stats.map((stat, statIndex) => (
                <div key={statIndex} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className="text-sm font-medium">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 