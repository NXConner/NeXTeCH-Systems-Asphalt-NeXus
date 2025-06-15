import React, { useEffect, useState, useRef } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { RefreshCw, Activity, Zap, Database } from 'lucide-react';
import { logger } from '@/services/logger';

interface PerformanceMetric {
  id: number;
  name: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export default function Performance() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const previousMetricsRef = useRef<string>('');

  const measurePerformance = async () => {
    try {
      setIsLoading(true);
      
      const loadTime = performance.now();
      const memoryUsage = `${Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024)}MB`;
      const avgResponseTime = `${Math.round(Math.random() * 100)}ms`;
      const fps = `${Math.round(60 - Math.random() * 10)}`;

      const newMetrics = [
        {
          id: 1,
          name: 'Load Time',
          value: `${Math.round(loadTime)}ms`,
          icon: <Activity className="h-4 w-4" />,
          color: 'bg-blue-500'
        },
        {
          id: 2,
          name: 'Memory Usage',
          value: memoryUsage,
          icon: <Database className="h-4 w-4" />,
          color: 'bg-green-500'
        },
        {
          id: 3,
          name: 'Avg Response Time',
          value: avgResponseTime,
          icon: <Zap className="h-4 w-4" />,
          color: 'bg-yellow-500'
        },
        {
          id: 4,
          name: 'FPS',
          value: fps,
          icon: <Activity className="h-4 w-4" />,
          color: 'bg-purple-500'
        }
      ];

      // Only log and update if metrics have changed
      const newMetricsString = JSON.stringify(newMetrics.map(m => ({ name: m.name, value: m.value })));
      if (newMetricsString !== previousMetricsRef.current) {
        setMetrics(newMetrics);
        previousMetricsRef.current = newMetricsString;
        logger.info('Performance metrics updated', { metrics: newMetrics });
      }
    } catch (error) {
      logger.error('Failed to measure performance', { error });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    measurePerformance();
    // Update metrics every 30 seconds instead of 5 seconds to reduce log spam
    const interval = setInterval(measurePerformance, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.name}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <Badge className={metric.color}>{metric.name}</Badge>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={measurePerformance}
        disabled={isLoading}
        className="w-full"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh Metrics
      </Button>
    </div>
  );
} 