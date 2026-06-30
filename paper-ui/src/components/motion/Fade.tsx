import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

export interface FadeProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean;
  duration?: number;
  delay?: number;
  unmountOnExit?: boolean;
}

export const Fade = React.forwardRef<HTMLDivElement, FadeProps>(
  ({ in: inProp = true, duration = 300, delay = 0, unmountOnExit = false, className, children, style, ...props }, ref) => {
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
          'transition-opacity',
          inProp ? 'opacity-100' : 'opacity-0',
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

Fade.displayName = 'Fade';
