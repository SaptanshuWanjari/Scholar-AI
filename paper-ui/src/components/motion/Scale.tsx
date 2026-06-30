import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

export interface ScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean;
  duration?: number;
  delay?: number;
  unmountOnExit?: boolean;
  fade?: boolean;
  initialScale?: number;
}

export const Scale = React.forwardRef<HTMLDivElement, ScaleProps>(
  (
    {
      in: inProp = true,
      duration = 300,
      delay = 0,
      unmountOnExit = false,
      fade = true,
      initialScale = 0.9,
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

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all',
          inProp ? 'scale-100 opacity-100' : cn(fade && 'opacity-0'),
          className
        )}
        style={{
          transform: !inProp ? `scale(${initialScale})` : 'scale(1)',
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

Scale.displayName = 'Scale';
