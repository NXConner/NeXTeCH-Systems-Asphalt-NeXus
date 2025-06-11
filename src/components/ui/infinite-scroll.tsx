import { useRef, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-spinner';

interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  className?: string;
  itemClassName?: string;
  loadingClassName?: string;
  threshold?: number;
  rootMargin?: string;
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  isLoading,
  className,
  itemClassName,
  loadingClassName,
  threshold = 0.5,
  rootMargin = '100px',
}: InfiniteScrollProps<T>) {
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
  });

  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  const handleLoadMore = useCallback(async () => {
    if (inView && hasMore && !isLoading) {
      await loadMoreRef.current();
      setPage((p) => p + 1);
    }
  }, [inView, hasMore, isLoading]);

  useEffect(() => {
    handleLoadMore();
  }, [handleLoadMore]);

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn('transition-opacity duration-200', itemClassName)}
        >
          {renderItem(item, index)}
        </div>
      ))}

      {hasMore && (
        <div
          ref={ref}
          className={cn(
            'flex items-center justify-center py-4',
            loadingClassName
          )}
        >
          {isLoading && <LoadingSpinner size="sm" />}
        </div>
      )}
    </div>
  );
} 