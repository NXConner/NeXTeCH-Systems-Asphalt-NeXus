import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [src]);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    onError?.();
  };

  const sizeClass = width && height ? `w-[${width}px] h-[${height}px]` : '';

  if (error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted',
          sizeClass,
          className
        )}
      >
        <span className="text-sm text-muted-foreground">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', sizeClass, className)}>
      {isLoading && (
        <div
          className={cn('absolute inset-0 bg-muted animate-pulse', sizeClass)}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          sizeClass
        )}
        priority={priority}
        quality={quality}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  );
}
