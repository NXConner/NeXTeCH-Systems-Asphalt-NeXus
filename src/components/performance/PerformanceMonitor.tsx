import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Progress,
  Badge,
  ScrollArea
} from '@/components/ui';
import { performanceService } from '@/services/performanceService';
import { logger } from '@/services/logger';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const data = performanceService.getMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch performance metrics');
      logger.error('Failed to fetch performance metrics', { error: err });
    } finally {
      setLoading(false);
    }
  };

  const clearMetrics = () => {
    performanceService.clearMetrics();
    setMetrics({});
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Monitor</CardTitle>
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
          <CardTitle>Performance Monitor</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle>Performance Monitor</CardTitle>
        <div className="flex space-x-2">
          <Button onClick={fetchMetrics} variant="outline" size="sm">
            Refresh
          </Button>
          <Button onClick={clearMetrics} variant="outline" size="sm">
            Clear Metrics
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CPU Usage */}
            <Card>
              <CardHeader>
                <CardTitle>CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current</span>
                    <Badge variant="outline">
                      {metrics.cpu?.current || 0}%
                    </Badge>
                  </div>
                  <Progress value={metrics.cpu?.current || 0} />
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current</span>
                    <Badge variant="outline">
                      {Math.round(metrics.memory?.current / 1024 / 1024)} MB
                    </Badge>
                  </div>
                  <Progress value={metrics.memory?.percentage || 0} />
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.responseTime || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="duration"
                        stroke="#8884d8"
                        name="Duration (ms)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Active Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics.tasks?.map((task: any) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-secondary rounded"
                    >
                      <span>{task.name}</span>
                      <Badge variant="outline">
                        {task.duration}ms
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.performance || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="fps"
                        stroke="#82ca9d"
                        name="FPS"
                      />
                      <Line
                        type="monotone"
                        dataKey="jank"
                        stroke="#ffc658"
                        name="Jank"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Threshold Alerts */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Threshold Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics.alerts?.map((alert: any) => (
                    <div
                      key={alert.id}
                      className={`p-2 rounded ${
                        alert.severity === 'high'
                          ? 'bg-red-100'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{alert.message}</span>
                        <Badge
                          variant={
                            alert.severity === 'high'
                              ? 'destructive'
                              : alert.severity === 'medium'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 