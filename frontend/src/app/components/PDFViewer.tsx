import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

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
}

interface PDFViewerProps {
  pdfUrl: string;
  highlights: HighlightItem[];
  scale?: number;
  onTextSelect: (text: string, page: number, rects: HighlightRect[]) => void;
}

export default function PDFViewer({
  pdfUrl,
  highlights,
  scale = 1.0,
  onTextSelect,
}: PDFViewerProps) {
  const containerDivRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Native page dimensions (at scale=1) recorded on first load of each page.
  // Used to compute exact placeholder heights for any zoom level.
  const [nativeDims, setNativeDims] = useState<Map<number, { w: number; h: number }>>(new Map());

  const [numPages, setNumPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1, 2]));
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageWrapperRefs = useRef<Map<number, HTMLDivElement>>(new Map());

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
        setVisiblePages((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const page = Number((entry.target as HTMLElement).dataset.pageNumber);
            if (entry.isIntersecting) {
              next.add(page);
              next.add(page + 1);
            }
          }
          return next;
        });
      },
      { rootMargin: "200px 0px" }
    );
    for (const [, el] of pageWrapperRefs.current) {
      observerRef.current.observe(el);
    }
  }, []);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  function registerPageRef(page: number, el: HTMLDivElement | null) {
    if (el) {
      pageWrapperRefs.current.set(page, el);
      observerRef.current?.observe(el);
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
                    {/* Highlight overlays – fractional coords scale automatically with page width */}
                    {pageHighlights.flatMap((hl) =>
                      hl.rects.map((rect, ri) => (
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
                      ))
                    )}
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
}
