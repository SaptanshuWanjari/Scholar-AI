import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface VirtualGridProps<T = any> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  gap?: number;
  overscan?: number;
}

export function VirtualGrid<T = any>({
  items,
  itemWidth,
  itemHeight,
  height,
  renderItem,
  gap = 8,
  overscan = 2,
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const columns = containerWidth > 0
    ? Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)))
    : 1;

  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * rowHeight - gap;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleRows = Math.ceil(height / rowHeight);
  const endRow = Math.min(totalRows - 1, startRow + visibleRows + overscan * 2);

  const visibleItems: { index: number; row: number; col: number }[] = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      if (index < items.length) {
        visibleItems.push({ index, row, col });
      }
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ height, overflowY: 'auto', position: 'relative' }}
      onScroll={useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop((e.target as HTMLDivElement).scrollTop);
      }, [])}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, row, col }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: row * rowHeight,
              left: col * (itemWidth + gap),
              width: itemWidth,
              height: itemHeight,
            }}
          >
            {renderItem(items[index], index)}
          </div>
        ))}
      </div>
    </div>
  );
}
