import React from 'react';
import { cn } from '../ui/utils';

interface SketchyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export function SketchyButton({ children, className, variant = 'primary', ...props }: SketchyButtonProps) {
  const baseClasses = "relative px-4 py-2 font-kalam transition-transform hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-slate-800 text-white border-2 border-slate-800",
    secondary: "bg-yellow-50 text-slate-800 border-2 border-slate-800",
    outline: "bg-transparent text-slate-800 border-2 border-slate-800 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-800 hover:bg-slate-100",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], className)}
      style={variant !== 'ghost' ? {
        borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
      } : {}}
      {...props}
    >
      {children}
    </button>
  );
}
