import React from 'react';
import { cn } from '../ui/utils';

interface SketchyProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number;
}

export function SketchyProgressBar({ progress, className, ...props }: SketchyProgressBarProps) {
  return (
    <div 
      className={cn("w-full h-3 border-2 border-slate-800 bg-transparent overflow-hidden relative", className)}
      style={{
        borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
      }}
      {...props}
    >
      <div 
        className="h-full bg-green-500/80 transition-all duration-500"
        style={{ width: `${progress}%` }}
      >
        {/* Adds a slight sketchy texture inside the progress bar */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, #000 2px, #000 4px)"
        }} />
      </div>
    </div>
  );
}
