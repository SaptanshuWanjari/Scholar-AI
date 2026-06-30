import React, { useEffect, useState } from 'react';
import { cn } from '@/paper-ui/utils';

export interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  unmountOnExit?: boolean;
  fade?: boolean;
}

export const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  (
    {
      in: inProp = true,
      direction = 'up',
      duration = 300,
      delay = 0,
      unmountOnExit = false,
      fade = true,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const [shouldRender, setShouldRender] = useState(inProp);

    useEffect(() => {
      if (inProp) {
        setShouldRender(true);
      } else if (!unmountOnExit) {
        // do nothing
      } else {
        const timer = setTimeout(() => setShouldRender(false), duration + delay);
        return () => clearTimeout(timer);
      }
    }, [inProp, unmountOnExit, duration, delay]);

    if (!shouldRender && unmountOnExit) return null;

    const translateClasses = {
      up: 'translate-y-4',
      down: '-translate-y-4',
      left: 'translate-x-4',
      right: '-translate-x-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all',
          inProp ? 'translate-x-0 translate-y-0 opacity-100' : cn(translateClasses[direction], fade && 'opacity-0'),
          className
        )}
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Slide.displayName = 'Slide';
