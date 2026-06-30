import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean;
  duration?: number;
  unmountOnExit?: boolean;
}

export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      in: inProp = false,
      duration = 300,
      unmountOnExit = false,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const combinedRef = (node: HTMLDivElement | null) => {
      (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const [shouldRender, setShouldRender] = useState(inProp);
    const [height, setHeight] = useState<number | string>(inProp ? 'auto' : 0);

    useEffect(() => {
      if (inProp) {
        setShouldRender(true);
        if (internalRef.current) {
          setHeight(internalRef.current.scrollHeight);
        }
      } else {
        if (internalRef.current) {
          setHeight(internalRef.current.scrollHeight);
          // force reflow
          void internalRef.current.offsetHeight;
        }
        setHeight(0);
        
        if (unmountOnExit) {
          const timer = setTimeout(() => setShouldRender(false), duration);
          return () => clearTimeout(timer);
        }
      }
    }, [inProp, unmountOnExit, duration]);

    // Cleanup height after animation completes for true 'auto' sizing
    useEffect(() => {
      if (inProp) {
        const timer = setTimeout(() => setHeight('auto'), duration);
        return () => clearTimeout(timer);
      }
    }, [inProp, duration]);

    if (!shouldRender && unmountOnExit) return null;

    return (
      <div
        ref={combinedRef}
        className={cn(
          'transition-[height] overflow-hidden',
          className
        )}
        style={{
          height,
          transitionDuration: `${duration}ms`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Collapse.displayName = 'Collapse';
