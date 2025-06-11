import { performanceService } from '@/services/performanceService';
import { performance } from 'perf_hooks';

describe('PerformanceService', () => {
  beforeEach(() => {
    performanceService.clearMetrics();
  });

  it('should record metrics', () => {
    performanceService.recordMetric('test', { value: 100 });
    const metrics = performanceService.getMetrics('test');
    expect(metrics).toHaveLength(1);
    expect(metrics[0].value).toEqual({ value: 100 });
  });

  it('should calculate stats', () => {
    performanceService.recordMetric('test', { value: 100 });
    performanceService.recordMetric('test', { value: 200 });
    performanceService.recordMetric('test', { value: 300 });

    const stats = performanceService.getStats('test');
    expect(stats).toEqual({
      count: 3,
      average: 200,
      min: 100,
      max: 300,
      p50: 200,
      p90: 300,
      p95: 300,
      p99: 300
    });
  });

  it('should set and get thresholds', () => {
    performanceService.setThreshold('test', 100);
    expect(performanceService.getThreshold('test')).toBe(100);
  });

  it('should measure performance', async () => {
    const result = await performanceService.measurePerformance('test', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return 'test';
    });

    expect(result).toBe('test');
    const metrics = performanceService.getMetrics('test');
    expect(metrics).toHaveLength(1);
    expect(metrics[0].value).toHaveProperty('duration');
    expect(metrics[0].value).toHaveProperty('memoryUsed');
  });

  it('should clear metrics', () => {
    performanceService.recordMetric('test', { value: 100 });
    performanceService.clearMetrics('test');
    expect(performanceService.getMetrics('test')).toHaveLength(0);
  });

  it('should clear all metrics', () => {
    performanceService.recordMetric('test1', { value: 100 });
    performanceService.recordMetric('test2', { value: 200 });
    performanceService.clearMetrics();
    expect(performanceService.getMetrics()).toEqual({});
  });
});

describe('Performance Hooks', () => {
  it('should use performance metrics', () => {
    const { metrics } = usePerformanceMetrics('test');
    expect(metrics).toBeDefined();
  });

  it('should use performance threshold', () => {
    const isExceeded = usePerformanceThreshold('test', 100);
    expect(isExceeded).toBeDefined();
  });

  it('should use performance alert', () => {
    const onAlert = jest.fn();
    usePerformanceAlert('test', 100, onAlert);
    expect(onAlert).toBeDefined();
  });

  it('should use performance monitor', () => {
    const onMetrics = jest.fn();
    const metrics = usePerformanceMonitor({ onMetrics });
    expect(metrics).toBeDefined();
  });

  it('should use performance optimization', () => {
    const { metrics, isExceeded } = usePerformanceOptimization({
      name: 'test',
      threshold: 100
    });
    expect(metrics).toBeDefined();
    expect(isExceeded).toBeDefined();
  });

  it('should use performance report', () => {
    const onReport = jest.fn();
    const metrics = usePerformanceReport({
      name: 'test',
      onReport
    });
    expect(metrics).toBeDefined();
  });
});

describe('Performance Components', () => {
  it('should render performance monitor', () => {
    const { container } = render(<PerformanceMonitor />);
    expect(container).toBeDefined();
  });

  it('should render performance navigation', () => {
    const { container } = render(<PerformanceNavigation />);
    expect(container).toBeDefined();
  });

  it('should render performance layout', () => {
    const { container } = render(<PerformanceLayout />);
    expect(container).toBeDefined();
  });

  it('should render performance page', () => {
    const { container } = render(<PerformancePage />);
    expect(container).toBeDefined();
  });
});

describe('Performance Routes', () => {
  it('should render performance dashboard', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/performance']}>
        <PerformanceRoutes />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('should render performance settings', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/performance/settings']}>
        <PerformanceRoutes />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('should render performance reports', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/performance/reports']}>
        <PerformanceRoutes />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });
}); 