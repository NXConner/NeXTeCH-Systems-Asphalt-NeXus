import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Badge
} from '@/components/ui';
import {
  Activity,
  Settings,
  FileText,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { usePerformance } from '@/hooks/usePerformance';

const navigation = [
  {
    name: 'Dashboard',
    href: '/performance',
    icon: Activity
  },
  {
    name: 'Settings',
    href: '/performance/settings',
    icon: Settings
  },
  {
    name: 'Reports',
    href: '/performance/reports',
    icon: FileText
  }
];

export function PerformanceNavigation() {
  const location = useLocation();
  const { metrics, refreshMetrics } = usePerformance();

  const alerts = React.useMemo(() => {
    const alerts = [];
    if (metrics.cpu?.current > 80) {
      alerts.push({
        name: 'High CPU Usage',
        value: metrics.cpu.current,
        threshold: 80
      });
    }
    if (metrics.memory?.current > 1024 * 1024 * 1024) {
      alerts.push({
        name: 'High Memory Usage',
        value: Math.round(metrics.memory.current / 1024 / 1024),
        threshold: 1024
      });
    }
    if (metrics.responseTime?.average > 1000) {
      alerts.push({
        name: 'Slow Response Time',
        value: metrics.responseTime.average,
        threshold: 1000
      });
    }
    return alerts;
  }, [metrics]);

  return (
    <Card>
      <CardContent className="p-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="mt-2 space-y-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={refreshMetrics}
            >
              <RefreshCw className="mr-3 h-4 w-4" />
              Refresh Metrics
            </Button>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Alerts
            </h3>
            <div className="mt-2 space-y-1">
              {alerts.map((alert) => (
                <div
                  key={alert.name}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-red-100 text-red-800"
                >
                  <AlertTriangle className="mr-3 h-4 w-4" />
                  <div className="flex-1">
                    <div>{alert.name}</div>
                    <div className="text-xs">
                      Current: {alert.value} (Threshold: {alert.threshold})
                    </div>
                  </div>
                  <Badge variant="destructive">Alert</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 