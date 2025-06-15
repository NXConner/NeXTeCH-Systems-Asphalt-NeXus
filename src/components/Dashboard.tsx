import React from 'react';
import { StatsOverview } from './StatsOverview';
import { ActivityList } from './ActivityList';
import { QuickActions } from './QuickActions';
import { PerformanceMetrics } from './PerformanceMetrics';
import { useStats } from '../hooks/useStats';
import { useRecentActivities } from '../hooks/useRecentActivities';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

export const Dashboard: React.FC = () => {
  const { stats, loading: statsLoading } = useStats();
  const { activities, loading: activitiesLoading } = useRecentActivities();
  const { data: performanceData, loading: metricsLoading } = usePerformanceMetrics();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <StatsOverview stats={stats} loading={statsLoading} />
          <QuickActions />
        </div>
        <div className="space-y-6">
          <ActivityList activities={activities} loading={activitiesLoading} />
          <PerformanceMetrics data={performanceData} />
        </div>
      </div>
    </div>
  );
}; 