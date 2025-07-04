import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class MapErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`Error in ${this.props.componentName || 'Map Component'}:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center p-6 max-w-md">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Map Error</h2>
            <p className="text-gray-600 mb-6">
              There was an issue loading the map. This could be due to network issues or missing map data.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-xs font-mono text-amber-800 text-left overflow-auto max-h-32">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={this.handleReset}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
