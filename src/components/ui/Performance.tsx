import React, { useEffect, useState } from 'react';
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

  const measurePerformance = async () => {
    setIsLoading(true);
    try {
      // Measure page load time
      const loadTime = performance.now();
      
      // Measure memory usage if available
      const memory = (performance as any).memory;
      const memoryUsage = memory ? `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A';
      
      // Measure network requests
      const resources = performance.getEntriesByType('resource');
      const avgResponseTime = resources.length > 0
        ? `${Math.round(resources.reduce((acc, curr) => acc + curr.duration, 0) / resources.length)}ms`
        : 'N/A';

      // Measure FPS
      let fps = 'N/A';
      if (typeof requestAnimationFrame === 'function') {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
          frameCount++;
          const currentTime = performance.now();
          
          if (currentTime - lastTime >= 1000) {
            fps = `${frameCount} FPS`;
            frameCount = 0;
            lastTime = currentTime;
          }
          
          requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
      }

      setMetrics([
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
      ]);

      logger.info('Performance metrics updated', { metrics });
    } catch (error) {
      logger.error('Failed to measure performance', { error });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    measurePerformance();
    // Update metrics every 5 seconds
    const interval = setInterval(measurePerformance, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Performance Metrics</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={measurePerformance}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map(metric => (
            <div
              key={metric.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${metric.color} bg-opacity-10`}>
                  {metric.icon}
                </div>
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
              <Badge variant="secondary">{metric.value}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 