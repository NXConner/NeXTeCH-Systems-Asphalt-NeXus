import React from 'react';
import { Outlet } from 'react-router-dom';
import { PerformanceNavigation } from './PerformanceNavigation';
import { usePerformance } from '@/hooks/usePerformance';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

export function PerformanceLayout() {
  const { metrics } = usePerformance();

  const hasAlerts = React.useMemo(() => {
    return (
      metrics.cpu?.current > 80 ||
      metrics.memory?.current > 1024 * 1024 * 1024 ||
      metrics.responseTime?.average > 1000
    );
  }, [metrics]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <PerformanceNavigation />
        </div>
        <div className="md:col-span-3">
          {hasAlerts && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Performance Alerts</AlertTitle>
              <AlertDescription>
                There are performance issues that require attention. Please check
                the dashboard for details.
              </AlertDescription>
            </Alert>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
} 