import { useCallback, useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Bookmark } from "lucide-react";
import type { StickyNote, NoteRect } from "../lib/types";
import { NOTE_CATEGORIES } from "../stores/useReadingNotesStore";
import { cn } from "./ui/utils";

export interface HighlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HighlightItem {
  id: string;
  text: string;
  page_number: number;
  rects: HighlightRect[];
  annotation?: string;
}

interface PDFViewerProps {
  pdfUrl: string;
  highlights: HighlightItem[];
  bookmarks?: { id: string; section: string; note: string }[];
  notes?: StickyNote[];
  onNoteClick?: (note: StickyNote) => void;
  scale?: number;
  onTextSelect: (text: string, page: number, rects: HighlightRect[]) => void;
  onPageVisible?: (page: number) => void;
  initialPage?: number;
}

export interface PDFViewerRef {
  scrollToPage: (page: number) => void;
  scrollToRegion: (page: number, bbox: NoteRect) => void;
}

const PDFViewer = forwardRef<PDFViewerRef, PDFViewerProps>(({
  pdfUrl,
  highlights,
  bookmarks = [],
  notes = [],
  onNoteClick,
  scale = 1.0,
  onTextSelect,
  onPageVisible,
  initialPage = 1,
}, ref) => {
  const containerDivRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Native page dimensions (at scale=1) recorded on first load of each page.
  // Used to compute exact placeholder heights for any zoom level.
  const [nativeDims, setNativeDims] = useState<Map<number, { w: number; h: number }>>(new Map());

  const [numPages, setNumPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1, 2]));
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageWrapperRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useImperativeHandle(ref, () => ({
    scrollToPage: (page: number) => {
      const el = pageWrapperRefs.current.get(page);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    scrollToRegion: (page: number, bbox: NoteRect) => {
      const el = pageWrapperRefs.current.get(page);
      if (!el) return;
      
      let parent = el.parentElement;
      while (parent && parent.scrollHeight <= parent.clientHeight) {
        parent = parent.parentElement;
      }
      
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const currentRelTop = elRect.top - parentRect.top;
        const targetOffsetInsidePage = bbox.y * el.clientHeight - el.clientHeight * 0.15;
        const targetScrollTop = parent.scrollTop + currentRelTop + targetOffsetInsidePage;
        
        parent.scrollTo({ top: targetScrollTop, behavior: "smooth" });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  }));

  // Measure container width so pages fill it exactly (handles resize / panel collapse).
  useEffect(() => {
    const el = containerDivRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pageWidth = containerWidth > 0 ? Math.round(containerWidth * scale) : 0;

  function getPageHeight(page: number): number {
    const dims = nativeDims.get(page);
    if (!dims || pageWidth === 0) {
      // Fallback: use A4 portrait ratio until the real height is known
      return pageWidth > 0 ? Math.round(pageWidth * 1.414) : 900;
    }
    return Math.round((pageWidth / dims.w) * dims.h);
  }

  const setupObserver = useCallback(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let mostVisible = -1;
        setVisiblePages((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const page = Number((entry.target as HTMLElement).dataset.pageNumber);
            if (entry.isIntersecting) {
              next.add(page);
              next.add(page + 1);
              if (entry.intersectionRatio > maxRatio) {
                maxRatio = entry.intersectionRatio;
                mostVisible = page;
              }
            }
          }
          return next;
        });
        if (mostVisible > 0 && onPageVisible) {
          onPageVisible(mostVisible);
        }
      },
      { rootMargin: "200px 0px", threshold: [0.1, 0.5, 0.9] }
    );
    for (const [, el] of pageWrapperRefs.current) {
      observerRef.current.observe(el);
    }
  }, []);

  const hasScrolledToInitial = useRef(false);

  useEffect(() => {
    hasScrolledToInitial.current = false;
  }, [pdfUrl, initialPage]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  function registerPageRef(page: number, el: HTMLDivElement | null) {
    if (el) {
      pageWrapperRefs.current.set(page, el);
      observerRef.current?.observe(el);

      if (page === initialPage && !hasScrolledToInitial.current) {
        hasScrolledToInitial.current = true;
        setTimeout(() => {
          el.scrollIntoView({ block: "start" });
        }, 100);
      }
    } else {
      const prev = pageWrapperRefs.current.get(page);
      if (prev) {
        observerRef.current?.unobserve(prev);
        pageWrapperRefs.current.delete(page);
      }
    }
  }

  function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
    setNumPages(n);
    setVisiblePages(new Set([1, 2]));
    requestAnimationFrame(setupObserver);
  }

  // Capture selection on mouseup anywhere inside the viewer.
  function handleMouseUp(e: React.MouseEvent<HTMLDivElement>) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;

    const text = sel.toString().trim();
    if (text.length < 2) return;

    // Walk up from anchor node to find the page wrapper.
    let node: Node | null = sel.anchorNode;
    let pageEl: HTMLElement | null = null;
    while (node) {
      const el = node instanceof HTMLElement ? node : node.parentElement;
      if (el?.dataset.pageNumber) { pageEl = el; break; }
      node = node.parentNode;
    }
    const pageNumber = pageEl ? Number(pageEl.dataset.pageNumber) : 1;

    const range = sel.getRangeAt(0);
    const clientRects = Array.from(range.getClientRects());
    const pageContainer = pageEl || e.currentTarget;
    const containerRect = pageContainer.getBoundingClientRect();

    const rects: HighlightRect[] = clientRects
      .filter((r) => r.width > 0 && r.height > 0)
      .map((r) => ({
        x: (r.left - containerRect.left) / containerRect.width,
        y: (r.top - containerRect.top) / containerRect.height,
        width: r.width / containerRect.width,
        height: r.height / containerRect.height,
      }));

    if (rects.length > 0) onTextSelect(text, pageNumber, rects);
  }

  return (
    <div ref={containerDivRef} className="w-full overflow-x-auto" onMouseUp={handleMouseUp}>
      {containerWidth > 0 && (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              Loading PDF…
            </div>
          }
          error={
            <div className="flex items-center justify-center h-64 text-destructive text-sm">
              Failed to load PDF.
            </div>
          }
        >
          {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => {
            const pageHighlights = highlights.filter((h) => h.page_number === page);
            const pageNotes = notes.filter((n) => n.page_number === page && n.bounding_box);
            const renderedHeight = getPageHeight(page);

            return (
              <div
                key={page}
                data-page-number={page}
                ref={(el) => registerPageRef(page, el)}
                style={{
                  width: pageWidth,
                  minHeight: renderedHeight,
                  position: "relative",
                  marginBottom: 12,
                }}
                className="shadow-sm"
              >
                {visiblePages.has(page) ? (
                  <>
                    <Page
                      pageNumber={page}
                      width={pageWidth}
                      renderTextLayer
                      renderAnnotationLayer={false}
                      onLoadSuccess={(pageProxy) => {
                        const vp = pageProxy.getViewport({ scale: 1 });
                        setNativeDims((prev) => new Map(prev).set(page, { w: vp.width, h: vp.height }));
                      }}
                    />
                    {bookmarks.some(b => b.section === `Page ${page}`) && (
                      <div className="absolute top-0 right-8 z-20 w-8 h-12 bg-primary/90 rounded-b-md shadow-md flex items-center justify-center pointer-events-none transition-all">
                        <Bookmark className="size-4 text-primary-foreground fill-primary-foreground" />
                      </div>
                    )}
                    {/* Bookmark overlays */}
                    {bookmarks.filter(b => b.section === `Page ${page}`).flatMap((bm) => {
                      if (!bm.rects) return [];
                      return bm.rects.map((rect, ri) => (
                        <div
                          key={`bm-${bm.id}-${ri}`}
                          style={{
                            position: "absolute",
                            left: `${rect.x * 100}%`,
                            top: `${rect.y * 100}%`,
                            width: `${rect.width * 100}%`,
                            height: `${rect.height * 100}%`,
                            background: "coral",
                            opacity: 0.35,
                            pointerEvents: "none",
                          }}
                        />
                      ));
                    })}
                    {/* Highlight overlays and margin notes */}
                    {pageHighlights.flatMap((hl) => {
                      const rects = hl.rects.map((rect, ri) => (
                        <div
                          key={`${hl.id}-${ri}`}
                          style={{
                            position: "absolute",
                            left: `${rect.x * 100}%`,
                            top: `${rect.y * 100}%`,
                            width: `${rect.width * 100}%`,
                            height: `${rect.height * 100}%`,
                            background: "yellow",
                            opacity: 0.4,
                            pointerEvents: "none",
                          }}
                        />
                      ));

                      if (hl.annotation && hl.rects.length > 0) {
                        const firstRect = hl.rects[0];
                        rects.push(
                          <div
                            key={`${hl.id}-note`}
                            className="absolute left-full ml-6 z-10 w-64 bg-card shadow-md rounded-lg border border-violet/25 bg-violet-soft/50 p-3 text-[13px] text-foreground/90 leading-relaxed font-reading"
                            style={{ top: `${firstRect.y * 100}%` }}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet mb-2">
                              ScholarAI Note
                            </div>
                            {hl.annotation}
                          </div>
                        );
                      }
                      
                      return rects;
                    })}

                    {/* Sticky-note margin badges (reading-annotations plugin) */}
                    {pageNotes.map((n) => {
                      const meta = NOTE_CATEGORIES[n.category];
                      const Icon = meta.icon;
                      return (
                        <button
                          key={`note-${n.id}`}
                          onClick={() => onNoteClick?.(n)}
                          title={n.content}
                          className={cn(
                            "absolute z-10 flex size-6 items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-110",
                            meta.chip,
                          )}
                          style={{ left: 2, top: `${n.bounding_box!.y * 100}%` }}
                        >
                          <Icon className="size-3.5" />
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <div
                    style={{ height: renderedHeight, background: "hsl(var(--muted) / 0.3)" }}
                  />
                )}
              </div>
            );
          })}
        </Document>
      )}
    </div>
  );
});

export default PDFViewer;
