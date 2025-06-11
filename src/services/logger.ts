/**
 * Log levels supported by the logger
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Structure of a log entry
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  error?: Error;
  stack?: string;
}

/**
 * A singleton logger service that provides structured logging with different log levels.
 * In development, logs are output to the console.
 * In production, logs are sent to a logging service.
 */
class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly isDevelopment = process.env.NODE_ENV === 'development';
  private readonly isProduction = process.env.NODE_ENV === 'production';

  private constructor() {}

  /**
   * Gets the singleton instance of the logger
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Internal method to handle logging
   * @param level - The log level
   * @param message - The log message
   * @param data - Optional data to log
   * @param error - Optional error to log
   */
  private log(level: LogLevel, message: string, data?: unknown, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      error,
      stack: error?.stack
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (this.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data || '', error || '');
    }

    if (this.isProduction) {
      // In production, send logs to your logging service
      this.sendToLoggingService(entry);
    }
  }

  /**
   * Sends logs to the logging service in production
   * @param entry - The log entry to send
   */
  private async sendToLoggingService(entry: LogEntry) {
    try {
      // TODO: Implement your production logging service here
      // Example: await fetch('https://your-logging-service.com/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });
    } catch (error) {
      console.error('Failed to send log to logging service:', error);
    }
  }

  /**
   * Logs a debug message
   * @param message - The message to log
   * @param data - Optional data to log
   */
  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  /**
   * Logs an info message
   * @param message - The message to log
   * @param data - Optional data to log
   */
  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  /**
   * Logs a warning message
   * @param message - The message to log
   * @param data - Optional data to log
   * @param error - Optional error to log
   */
  warn(message: string, data?: unknown, error?: Error) {
    this.log('warn', message, data, error);
  }

  /**
   * Logs an error message
   * @param message - The message to log
   * @param data - Optional data to log
   * @param error - Optional error to log
   */
  error(message: string, data?: unknown, error?: Error) {
    this.log('error', message, data, error);
  }

  /**
   * Gets all logs
   * @returns Array of log entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clears all logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 