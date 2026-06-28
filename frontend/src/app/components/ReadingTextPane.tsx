import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { type ReadingSection } from "../lib/api";
import { cn } from "./ui/utils";

export interface ReadingTextPaneProps {
  sections: ReadingSection[];
  searchQuery?: string;
  onPageVisible?: (page: number) => void;
  className?: string;
}

export interface ReadingTextPaneRef {
  scrollToPage: (page: number) => void;
}

export const ReadingTextPane = forwardRef<ReadingTextPaneRef, ReadingTextPaneProps>(
  ({ sections, searchQuery = "", onPageVisible, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    
    useImperativeHandle(ref, () => ({
      scrollToPage: (page: number) => {
        if (!containerRef.current) return;
        const target = containerRef.current.querySelector(`[data-page="${page}"]`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }));

    useEffect(() => {
      const el = containerRef.current;
      if (!el || !onPageVisible) return;
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          let mostVisiblePage = -1;
          let maxRatio = 0;
          
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              const page = Number((entry.target as HTMLElement).dataset.page);
              if (page) {
                mostVisiblePage = page;
                maxRatio = entry.intersectionRatio;
              }
            }
          }
          
          if (mostVisiblePage > 0) {
            onPageVisible(mostVisiblePage);
          }
        },
        { root: el, threshold: [0.1, 0.5, 0.9] }
      );
      
      const targets = el.querySelectorAll("[data-page]");
      targets.forEach(t => observerRef.current?.observe(t));
      
      return () => observerRef.current?.disconnect();
    }, [sections, onPageVisible]);

    const highlightText = (text: string, query: string) => {
      if (!query.trim()) return text;
      const parts = text.split(new RegExp(`(${query})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? <mark key={i} className="bg-yellow-200 text-black">{part}</mark> : part
      );
    };

    return (
      <div ref={containerRef} className={cn("flex flex-col gap-8 p-6 overflow-y-auto h-full font-reading", className)}>
        {sections.map(sec => (
          <div key={sec.id} className="space-y-4">
            {sec.title && <h2 className="text-xl font-bold text-foreground/90">{sec.title}</h2>}
            {sec.paragraphs.map((p, idx) => (
              <p 
                key={`${sec.id}-${idx}`} 
                data-page={p.page ?? undefined}
                className="text-[16px] leading-relaxed text-foreground/80"
              >
                {highlightText(p.text, searchQuery)}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }
);
