import React from 'react';
import { cn } from '../ui/utils';

interface SketchyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tape?: 'top-left' | 'top-right' | 'top-center' | 'none';
  spiral?: boolean;
  folded?: boolean;
}

export function SketchyCard({ children, className, tape = 'none', spiral = false, folded = false, ...props }: SketchyCardProps) {
  return (
    <div
      className={cn(
        "relative bg-[#fdfaf6] border-2 border-slate-800 p-6 font-kalam text-slate-800 transition-all",
        className
      )}
      style={{
        borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
        boxShadow: "2px 5px 15px 0px rgba(0,0,0,0.05)"
      }}
      {...props}
    >
      {/* Tape effect */}
      {tape !== 'none' && (
        <div
          className={cn(
            "absolute w-12 h-4 bg-yellow-100 border border-yellow-200/50 opacity-80 z-10 shadow-sm",
            tape === 'top-left' && "-top-2 -left-2 -rotate-12",
            tape === 'top-right' && "-top-2 -right-2 rotate-12",
            tape === 'top-center' && "-top-2 left-1/2 -translate-x-1/2 rotate-3"
          )}
        />
      )}

      {/* Spiral effect */}
      {spiral && (
        <div className="absolute -top-3 left-0 w-full flex justify-around px-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-1.5 h-6 rounded-full border-2 border-slate-800 bg-transparent -mb-2 z-20 shadow-sm" />
              <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-800 bg-white z-10" />
            </div>
          ))}
        </div>
      )}

      {/* Folded corner */}
      {folded && (
        <div 
          className="absolute bottom-0 right-0 w-8 h-8 bg-slate-200/50 border-l-2 border-t-2 border-slate-800 rounded-tl-xl transition-all"
          style={{
            borderBottomRightRadius: "15px",
            boxShadow: "-2px -2px 5px rgba(0,0,0,0.05)"
          }}
        />
      )}

      {children}
    </div>
  );
}
