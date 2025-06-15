import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface MetricData {
  timestamp: string;
  value: number;
}

interface PerformanceMetricsProps {
  data?: {
    responseTime: MetricData[];
    cpuUsage: MetricData[];
    memoryUsage: MetricData[];
    networkLatency: MetricData[];
  };
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  const metrics = [
    {
      name: 'Response Time',
      data: data?.responseTime || [],
      color: '#8884d8',
      unit: 'ms'
    },
    {
      name: 'CPU Usage',
      data: data?.cpuUsage || [],
      color: '#82ca9d',
      unit: '%'
    },
    {
      name: 'Memory Usage',
      data: data?.memoryUsage || [],
      color: '#ffc658',
      unit: 'MB'
    },
    {
      name: 'Network Latency',
      data: data?.networkLatency || [],
      color: '#ff8042',
      unit: 'ms'
    }
  ];

  return (
    <Tabs defaultValue="responseTime" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {metrics.map((metric) => (
          <TabsTrigger key={metric.name} value={metric.name.toLowerCase().replace(' ', '')}>
            {metric.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {metrics.map((metric) => (
        <TabsContent key={metric.name} value={metric.name.toLowerCase().replace(' ', '')}>
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value}${metric.unit}`}
                    />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value) => [`${value}${metric.unit}`, metric.name]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}; 