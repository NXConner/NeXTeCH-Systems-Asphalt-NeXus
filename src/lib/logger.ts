import { config } from '@/config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;
  private logBuffer: LogEntry[] = [];
  private readonly MAX_BUFFER_SIZE = 100;

  private constructor() {
    this.isDevelopment = config.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    const formattedMessage = message.trim() || `[${level.toUpperCase()}] Log entry`;
    return {
      level,
      message: formattedMessage,
      timestamp: new Date().toISOString(),
      data: data || undefined
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry = this.formatMessage(level, message, data);
    
    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
      this.logBuffer.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      const formattedData = data ? JSON.stringify(data, null, 2) : '';
      console[consoleMethod](
        `[${entry.timestamp}] ${level.toUpperCase()}: ${entry.message}`,
        formattedData ? JSON.parse(formattedData) : ''
      );
    }

    // TODO: Implement remote logging in production
    if (!this.isDevelopment) {
      // Send to logging service
      this.sendToLoggingService(entry);
    }
  }

  private async sendToLoggingService(entry: LogEntry) {
    try {
      // TODO: Implement actual logging service integration
      // Example: await fetch('https://logging-service.com/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });
    } catch (error) {
      console.error('Failed to send log to logging service:', error);
    }
  }

  public debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  public info(message: string, data?: any) {
    this.log('info', message, data);
  }

  public warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  public error(message: string, data?: any) {
    this.log('error', message, data);
  }

  public getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  public clearLogBuffer() {
    this.logBuffer = [];
  }
}

export const logger = Logger.getInstance(); 