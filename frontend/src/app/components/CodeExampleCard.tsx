import { Code2, BookOpen, Layers, Star } from "lucide-react";
import type { CodeExample } from "../lib/types";

export function CodeExampleCard({ 
  example, 
  onClick 
}: { 
  example: CodeExample; 
  onClick: (example: CodeExample) => void;
}) {
  return (
    <div 
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md cursor-pointer hover:border-violet/30"
      onClick={() => onClick(example)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-violet-soft/20 text-violet flex items-center justify-center shrink-0 group-hover:bg-violet group-hover:text-white transition-colors">
            <Code2 className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base line-clamp-1" title={example.title}>
              {example.title}
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
              {example.language}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Layers className="size-3.5" />
          <span className="line-clamp-1">{example.topic}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-3.5" />
            <span className="line-clamp-1 max-w-[120px]">{example.course}</span>
          </div>
          <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent">
            <Star className="size-3 text-amber-500 fill-amber-500" />
            <span>{example.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
