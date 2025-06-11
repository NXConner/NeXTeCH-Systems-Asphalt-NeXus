import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  height?: number;
  itemHeight?: number;
  className?: string;
  overscan?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  height = 400,
  itemHeight = 35,
  className,
  overscan = 5,
  onEndReached,
  onEndReachedThreshold = 0.8,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  const handleScroll = useCallback(() => {
    if (!onEndReached) return;

    const { scrollTop, scrollHeight, clientHeight } = parentRef.current!;
    const threshold = scrollHeight * onEndReachedThreshold;

    if (scrollTop + clientHeight >= threshold) {
      onEndReached();
    }
  }, [onEndReached, onEndReachedThreshold]);

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        className="h-[${rowVirtualizer.getTotalSize()}px] w-full relative"
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            {renderItem(items[virtualRow.index], virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
} 