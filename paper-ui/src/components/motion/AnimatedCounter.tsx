import React, { useEffect, useState } from 'react';
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "../../core/SketchBorder";

export interface AnimatedCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  title?: string;
  label?: string;
}

const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const AnimatedCounter = React.forwardRef<HTMLDivElement, AnimatedCounterProps>(
  (
    {
      value,
      duration = 1000,
      decimals = 0,
      prefix = '',
      suffix = '',
      title,
      label,
      className,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      let startTime: number;
      const startValue = displayValue;
      const endValue = value;
      const change = endValue - startValue;

      if (change === 0) return;

      const step = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const easedProgress = easeOutExpo(progress);
        const currentVal = startValue + change * easedProgress;
        
        setDisplayValue(currentVal);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setDisplayValue(endValue);
        }
      };

      window.requestAnimationFrame(step);
    }, [value, duration]);

    return (
      <div ref={ref} className={cn("relative inline-block bg-paper p-4", className)} {...props}>
        <SketchBorder shadow={4} />
        <div className="relative z-10 flex flex-col">
          {title && <span className="text-sm font-inter font-bold tracking-widest text-ink/70 uppercase mb-4">{title}</span>}
          <div className="flex items-end gap-2">
            {label && <span className="text-sm font-inter font-bold tracking-widest text-ink/70 uppercase mb-1">{label}</span>}
            <span className="text-5xl font-bold font-serif text-ink">
              {prefix}
              {displayValue.toFixed(decimals)}
              {suffix}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

AnimatedCounter.displayName = 'AnimatedCounter';
