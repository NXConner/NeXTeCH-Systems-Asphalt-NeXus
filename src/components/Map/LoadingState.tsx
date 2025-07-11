import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

export const MapLoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading map...',
  size = 'md',
  overlay = true
}) => {
  // Size mapping for the loader
  const sizeMap = {
    sm: { icon: 'h-5 w-5', text: 'text-sm' },
    md: { icon: 'h-8 w-8', text: 'text-base' },
    lg: { icon: 'h-10 w-10', text: 'text-lg' }
  };

  // Component styling
  const sizeStyles = sizeMap[size];
  const containerClasses = overlay
    ? 'absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex flex-col items-center justify-center h-full w-full';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`${sizeStyles.icon} animate-spin text-primary`} />
        {message && <p className={`${sizeStyles.text} text-muted-foreground`}>{message}</p>}
      </div>
    </div>
  );
};
