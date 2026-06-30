import React from 'react';
import { cn } from '@/paper-ui/utils';

export interface HoverEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: boolean;
  lift?: boolean;
  glow?: boolean;
  wiggle?: boolean;
}

export const HoverEffect = React.forwardRef<HTMLDivElement, HoverEffectProps>(
  (
    {
      scale = true,
      lift = false,
      glow = false,
      wiggle = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300 ease-in-out',
          scale && 'hover:scale-105',
          lift && 'hover:-translate-y-1 hover:shadow-lg',
          glow && 'hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]',
          wiggle && 'hover:rotate-1 hover:skew-x-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

HoverEffect.displayName = 'HoverEffect';
