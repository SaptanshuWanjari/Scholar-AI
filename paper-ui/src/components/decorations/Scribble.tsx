import { cn } from "@paper-ui/utils";

export interface ScribbleProps {
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export function Scribble({ className, color = "currentColor", strokeWidth = 2 }: ScribbleProps) {
  return (
    <svg 
      viewBox="0 0 100 20" 
      className={cn("w-full h-full", className)} 
      preserveAspectRatio="none"
      aria-hidden
    >
      <path 
        d="M 2,10 Q 15,0 25,12 T 45,6 T 65,14 T 85,8 T 98,12" 
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
