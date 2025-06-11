const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  outputDir: path.join(__dirname, '../reports/performance'),
  metrics: {
    cpu: true,
    memory: true,
    network: true,
    errors: true
  },
  thresholds: {
    cpu: 80,
    memory: 1024 * 1024 * 1024,
    responseTime: 1000
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Performance metrics
const metrics = {
  startTime: performance.now(),
  cpu: [],
  memory: [],
  network: [],
  errors: []
};

// Record CPU usage
function recordCPU() {
  if (!config.metrics.cpu) return;

  const cpuUsage = process.cpuUsage();
  metrics.cpu.push({
    timestamp: Date.now(),
    user: cpuUsage.user,
    system: cpuUsage.system
  });
}

// Record memory usage
function recordMemory() {
  if (!config.metrics.memory) return;

  const memoryUsage = process.memoryUsage();
  metrics.memory.push({
    timestamp: Date.now(),
    heapUsed: memoryUsage.heapUsed,
    heapTotal: memoryUsage.heapTotal,
    external: memoryUsage.external,
    rss: memoryUsage.rss
  });
}

// Record network usage
function recordNetwork() {
  if (!config.metrics.network) return;

  try {
    const networkStats = execSync('netstat -s').toString();
    metrics.network.push({
      timestamp: Date.now(),
      stats: networkStats
    });
  } catch (error) {
    console.error('Failed to record network stats:', error);
  }
}

// Record errors
function recordError(error) {
  if (!config.metrics.errors) return;

  metrics.errors.push({
    timestamp: Date.now(),
    error: error.message,
    stack: error.stack
  });
}

// Generate report
function generateReport() {
  const endTime = performance.now();
  const duration = endTime - metrics.startTime;

  const report = {
    timestamp: new Date().toISOString(),
    duration,
    metrics: {
      cpu: {
        count: metrics.cpu.length,
        average: metrics.cpu.reduce((sum, m) => sum + m.user + m.system, 0) / metrics.cpu.length,
        max: Math.max(...metrics.cpu.map(m => m.user + m.system))
      },
      memory: {
        count: metrics.memory.length,
        average: metrics.memory.reduce((sum, m) => sum + m.heapUsed, 0) / metrics.memory.length,
        max: Math.max(...metrics.memory.map(m => m.heapUsed))
      },
      network: {
        count: metrics.network.length
      },
      errors: {
        count: metrics.errors.length,
        errors: metrics.errors
      }
    },
    thresholds: {
      exceeded: {
        cpu: metrics.cpu.some(m => m.user + m.system > config.thresholds.cpu),
        memory: metrics.memory.some(m => m.heapUsed > config.thresholds.memory),
        responseTime: duration > config.thresholds.responseTime
      }
    }
  };

  const reportPath = path.join(
    config.outputDir,
    `performance-report-${Date.now()}.json`
  );

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Performance report generated: ${reportPath}`);

  return report;
}

// Start monitoring
function startMonitoring() {
  console.log('Starting performance monitoring...');

  // Record initial metrics
  recordCPU();
  recordMemory();
  recordNetwork();

  // Set up intervals
  const cpuInterval = setInterval(recordCPU, 1000);
  const memoryInterval = setInterval(recordMemory, 1000);
  const networkInterval = setInterval(recordNetwork, 5000);

  // Handle process events
  process.on('uncaughtException', (error) => {
    recordError(error);
    generateReport();
    process.exit(1);
  });

  process.on('unhandledRejection', (error) => {
    recordError(error);
    generateReport();
    process.exit(1);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    clearInterval(cpuInterval);
    clearInterval(memoryInterval);
    clearInterval(networkInterval);
    generateReport();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    clearInterval(cpuInterval);
    clearInterval(memoryInterval);
    clearInterval(networkInterval);
    generateReport();
    process.exit(0);
  });
}

// Run script
if (require.main === module) {
  startMonitoring();
}

module.exports = {
  startMonitoring,
  generateReport,
  metrics
}; 