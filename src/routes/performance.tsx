import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PerformanceProvider, usePerformanceMetrics, usePerformanceMonitor } from '@/contexts/PerformanceContext';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePerformance } from '@/hooks/usePerformance';

function PerformanceDashboard() {
  const metrics = usePerformanceMetrics('all');
  const { loading, error, refreshMetrics, clearMetrics } = usePerformanceMonitor();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.cpu?.current || 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(metrics.memory?.current / 1024 / 1024)} MB
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.responseTime?.average || 0}ms
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.tasks?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <PerformanceMonitor />
    </div>
  );
}

function PerformanceSettings() {
  const { setThreshold, getThreshold } = usePerformance();
  const [thresholds, setThresholds] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const initialThresholds = {
      cpu: getThreshold('cpu') || 80,
      memory: getThreshold('memory') || 1024 * 1024 * 1024,
      responseTime: getThreshold('responseTime') || 1000
    };
    setThresholds(initialThresholds);
  }, [getThreshold]);

  const handleThresholdChange = (name: string, value: number) => {
    setThreshold(name, value);
    setThresholds(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="cpu-threshold" className="block text-sm font-medium mb-1">
              CPU Usage Threshold (%)
            </label>
            <input
              id="cpu-threshold"
              type="number"
              value={thresholds.cpu}
              onChange={e =>
                handleThresholdChange('cpu', parseInt(e.target.value))
              }
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label htmlFor="memory-threshold" className="block text-sm font-medium mb-1">
              Memory Usage Threshold (MB)
            </label>
            <input
              id="memory-threshold"
              type="number"
              value={Math.round(thresholds.memory / 1024 / 1024)}
              onChange={e =>
                handleThresholdChange(
                  'memory',
                  parseInt(e.target.value) * 1024 * 1024
                )
              }
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="response-time-threshold" className="block text-sm font-medium mb-1">
              Response Time Threshold (ms)
            </label>
            <input
              id="response-time-threshold"
              type="number"
              value={thresholds.responseTime}
              onChange={e =>
                handleThresholdChange('responseTime', parseInt(e.target.value))
              }
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceReports() {
  const metrics = usePerformanceMetrics('all');
  const [reports, setReports] = React.useState<any[]>([]);

  React.useEffect(() => {
    const generateReport = () => {
      const report = {
        timestamp: new Date().toISOString(),
        metrics: {
          cpu: metrics.cpu,
          memory: metrics.memory,
          responseTime: metrics.responseTime,
          tasks: metrics.tasks
        }
      };
      setReports(prev => [report, ...prev].slice(0, 10));
    };

    generateReport();
    const interval = setInterval(generateReport, 60000);
    return () => clearInterval(interval);
  }, [metrics]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  {new Date(report.timestamp).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">CPU Usage</h3>
                    <div>{report.metrics.cpu?.current || 0}%</div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Memory Usage</h3>
                    <div>
                      {Math.round(
                        report.metrics.memory?.current / 1024 / 1024
                      )}{' '}
                      MB
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Response Time</h3>
                    <div>{report.metrics.responseTime?.average || 0}ms</div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Active Tasks</h3>
                    <div>{report.metrics.tasks?.length || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceRoutes() {
  return (
    <PerformanceProvider>
      <Routes>
        <Route path="/" element={<PerformanceDashboard />} />
        <Route path="/settings" element={<PerformanceSettings />} />
        <Route path="/reports" element={<PerformanceReports />} />
      </Routes>
    </PerformanceProvider>
  );
} 