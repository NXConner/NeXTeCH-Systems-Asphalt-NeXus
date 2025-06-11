import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useModuleContext } from '@/contexts/ModuleContext';
import { Module, ModuleAnalytics, ModuleMetrics } from '@/types/module';
import { logger } from '@/services/logger';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  Download,
  Star,
  GitFork,
  AlertCircle,
  Clock,
  Package,
  Zap,
  Shield,
  FileText,
  Users
} from 'lucide-react';

interface ModuleStatsProps {
  module: Module;
  analytics?: ModuleAnalytics;
  metrics?: ModuleMetrics;
}

const ModuleStats = memo(function ModuleStats({ module, analytics, metrics }: ModuleStatsProps) {
  const chartData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: 'Daily', value: analytics.downloads.daily },
      { name: 'Weekly', value: analytics.downloads.weekly },
      { name: 'Monthly', value: analytics.downloads.monthly }
    ];
  }, [analytics]);

  const versionData = useMemo(() => {
    if (!analytics) return [];
    return Object.entries(analytics.usage.byVersion).map(([version, count]) => ({
      version,
      count
    }));
  }, [analytics]);

  if (!analytics || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.downloads.total.toLocaleString()}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Download className="h-4 w-4 mr-1" />
              {analytics.downloads.daily} today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.usage.active.toLocaleString()}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Users className="h-4 w-4 mr-1" />
              {((analytics.usage.active / analytics.usage.total) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.performance.loadTime}ms</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Zap className="h-4 w-4 mr-1" />
              {analytics.performance.size} size
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.performance.dependencies}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Package className="h-4 w-4 mr-1" />
              {analytics.performance.dependencies} total
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Download Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Version Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={versionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="version" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quality Score</span>
                  <Badge variant="secondary">{metrics.quality}/100</Badge>
                </div>
                <Progress value={metrics.quality} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Popularity</span>
                  <Badge variant="secondary">{metrics.popularity}/100</Badge>
                </div>
                <Progress value={metrics.popularity} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Maintenance</span>
                  <Badge variant="secondary">{metrics.maintenance}/100</Badge>
                </div>
                <Progress value={metrics.maintenance} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Security</span>
                  <Badge variant="secondary">{metrics.security}/100</Badge>
                </div>
                <Progress value={metrics.security} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Performance</span>
                  <Badge variant="secondary">{metrics.performance}/100</Badge>
                </div>
                <Progress value={metrics.performance} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Documentation</span>
                  <Badge variant="secondary">{metrics.documentation}/100</Badge>
                </div>
                <Progress value={metrics.documentation} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Support</span>
                  <Badge variant="secondary">{metrics.support}/100</Badge>
                </div>
                <Progress value={metrics.support} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default ModuleStats; 