import React, { useEffect, useRef } from 'react';
import { cn } from '@paper-ui/utils';

export interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore?: boolean;
  threshold?: number;
  loader?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function InfiniteScroll({
  onLoadMore,
  hasMore = true,
  threshold = 200,
  loader,
  className,
  children,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { rootMargin: `${threshold}px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, threshold]);

  return (
    <div className={cn('flex flex-col', className)}>
      {children}
      <div ref={sentinelRef} />
      {hasMore && (loader ?? <DefaultLoader />)}
    </div>
  );
}

function DefaultLoader() {
  return (
    <div style={{ textAlign: 'center', padding: 16, color: '#9c9484', fontSize: '0.8rem', fontFamily: "'Kalam', cursive" }}>
      loading...
    </div>
  );
}
