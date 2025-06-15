import { logger } from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public data?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Set<(error: AppError) => void> = new Set();

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      this.handleError(error);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      this.handleError(reason instanceof Error ? reason : new Error(String(reason)));
    });

    // Handle window errors in browser
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleError(event.error || new Error(event.message));
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
      });
    }
  }

  public handleError(error: Error | AppError) {
    const appError = error instanceof AppError ? error : new AppError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      { originalError: error }
    );

    // Log the error
    logger.error(`Error occurred: ${appError.message}`, {
      code: appError.code,
      status: appError.status,
      data: appError.data,
      stack: appError.stack
    });

    // Notify listeners
    this.errorListeners.forEach(listener => {
      try {
        listener(appError);
      } catch (listenerError) {
        logger.error('Error in error listener', { error: listenerError });
      }
    });

    // In development, show error in console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        message: appError.message,
        code: appError.code,
        status: appError.status,
        data: appError.data,
        stack: appError.stack
      });
    }

    return appError;
  }

  public addErrorListener(listener: (error: AppError) => void) {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  public removeErrorListener(listener: (error: AppError) => void) {
    this.errorListeners.delete(listener);
  }
}

export const errorHandler = ErrorHandler.getInstance();

// React error boundary component
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorHandler.handleError(error);
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Utility function to wrap async functions with error handling
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw errorHandler.handleError(error as Error);
    }
  };
};

// Utility function to create error objects
export const createError = (
  message: string,
  code: string,
  status: number = 500,
  data?: any
): AppError => {
  return new AppError(message, code, status, data);
}; 