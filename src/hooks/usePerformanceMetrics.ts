import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface MetricData {
  timestamp: string;
  value: number;
}

interface PerformanceData {
  responseTime: MetricData[];
  cpuUsage: MetricData[];
  memoryUsage: MetricData[];
  networkLatency: MetricData[];
}

export const usePerformanceMetrics = () => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = async () => {
    try {
      const { data: metrics, error: metricsError } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (metricsError) throw metricsError;

      const formattedData: PerformanceData = {
        responseTime: [],
        cpuUsage: [],
        memoryUsage: [],
        networkLatency: []
      };

      metrics.forEach((metric) => {
        formattedData.responseTime.push({
          timestamp: metric.timestamp,
          value: metric.response_time
        });
        formattedData.cpuUsage.push({
          timestamp: metric.timestamp,
          value: metric.cpu_usage
        });
        formattedData.memoryUsage.push({
          timestamp: metric.timestamp,
          value: metric.memory_usage
        });
        formattedData.networkLatency.push({
          timestamp: metric.timestamp,
          value: metric.network_latency
        });
      });

      setData(formattedData);
      logger.info('Performance metrics fetched successfully');
    } catch (err) {
      const error = err as Error;
      setError(error);
      logger.error('Error fetching performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    const subscription = supabase
      .channel('performance_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'performance_metrics'
        },
        () => {
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { data, loading, error };
}; 