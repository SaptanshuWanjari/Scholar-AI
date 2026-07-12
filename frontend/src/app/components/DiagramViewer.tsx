import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/app/lib/toast";
import mermaid from "mermaid";
import { Loader2, AlertCircle, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { PaperCard } from "@paper-ui/core";
import { EmptyState } from "@paper-ui/components/feedback";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  look: "handDrawn",
  themeVariables: {
    background: "#fffefb",
    primaryColor: "#fffefb",
    primaryTextColor: "#211f1b",
    primaryBorderColor: "#4f4d7a",
    lineColor: "#a39e93",
    secondaryColor: "#efece5",
    tertiaryColor: "#f6f5f1",
    fontFamily: "Kalam, 'Architects Daughter', cursive",
    fontSize: "15px",
  },
  securityLevel: "loose",
});

let counter = 0;

export function DiagramViewer({ code, flush, title = "diagram", kind }: { code: string; flush?: boolean; title?: string; kind?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPlantUML = kind === "PlantUML";

  /** Measure the outer container and stamp pixel dimensions onto the SVG. */
  const fitSvg = useCallback(() => {
    if (!ref.current || !outerRef.current) return;
    const svgEl = ref.current.querySelector("svg");
    if (!svgEl) return;
    const w = outerRef.current.offsetWidth;
    const h = outerRef.current.offsetHeight;
    if (w > 0 && h > 0) {
      svgEl.removeAttribute("width");
      svgEl.removeAttribute("height");
      svgEl.style.cssText = `width:${w}px;height:${h}px;max-width:none;max-height:none;display:block;`;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let observer: ResizeObserver | null = null;

    const renderDiagram = async () => {
      if (!ref.current) return;

      setLoading(true);
      setError(null);
      ref.current.innerHTML = "";

      if (isPlantUML) {
        try {
          const res = await fetch("/api/plugins/plantuml/render", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plantuml_syntax: code }),
          });
          const data = await res.json();
          if (!isMounted) return;
          if (data.error) {
            setError(data.error);
          } else if (ref.current) {
            ref.current.innerHTML = data.svg;
            requestAnimationFrame(fitSvg);
          }
        } catch (err) {
          if (isMounted) setError(err instanceof Error ? err.message : "Failed to render PlantUML");
        } finally {
          if (isMounted) setLoading(false);
        }
        return;
      }

      const id = `mermaid-svg-${counter++}`;

      try {
        ref.current.innerHTML = "";
        
        // Clean AI generated code
        let cleanCode = code;
        cleanCode = cleanCode.replace(/^```mermaid\n?/, "").replace(/```$/, "").trim();
        // Quote labels with parens or commas to prevent syntax errors
        const quoteLabel = (text: string) => {
          if (!text) return "";
          let clean = text;
          if (clean.startsWith('"') && clean.endsWith('"')) {
            clean = clean.slice(1, -1);
          }
          clean = clean.replace(/"/g, "'");
          return `"${clean}"`;
        };
        cleanCode = cleanCode.replace(/(\w+)\s*\[([^\]]*)\]/g, (match, id, text) => {
          const next = quoteLabel(text);
          return next ? `${id}[${next}]` : match;
        });
        cleanCode = cleanCode.replace(/(\w+)\s*\(([^)]*)\)/g, (match, id, text) => {
          const next = quoteLabel(text);
          return next ? `${id}(${next})` : match;
        });

        // Validate syntax first so it throws instead of rendering an error SVG
        await mermaid.parse(cleanCode);
        let { svg } = await mermaid.render(id, cleanCode);

        // Strip mermaid-injected max-width rules from internal <style> blocks
        // (mermaid often emits `#id { max-width: 300px; }` inside the SVG)
        svg = svg.replace(
          /(<style[^>]*>)([\s\S]*?)(<\/style>)/g,
          (_, open, body, close) =>
            open + body.replace(/max-width\s*:[^;}"]+;?/g, "max-width:none;") + close
        );

        // Strip width/height/style from the root <svg> element — we'll set them via JS
        svg = svg.replace(/<svg([^>]*)>/, (_match, attrs) => {
          const cleaned = attrs
            .replace(/\bwidth="[^"]*"/g, "")
            .replace(/\bheight="[^"]*"/g, "")
            .replace(/\bstyle="[^"]*"/g, "");
          return `<svg${cleaned} preserveAspectRatio="xMidYMid meet">`;
        });

        if (isMounted && ref.current) {
          ref.current.innerHTML = svg;
          // Stamp px dimensions after the browser has laid out the outer container
          requestAnimationFrame(() => {
            if (isMounted) {
              fitSvg();
              setLoading(false);
            }
          });
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to render diagram");
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
          setLoading(false);
        }
      }
    };

    renderDiagram();

    // Keep SVG sized on resize
    if (outerRef.current) {
      observer = new ResizeObserver(fitSvg);
      observer.observe(outerRef.current);
    }

    return () => {
      isMounted = false;
      observer?.disconnect();
    };
  }, [code, isPlantUML, fitSvg]);

  return (
    <div
      ref={outerRef}
      className={`relative w-full overflow-hidden ${flush ? "h-full" : "h-[560px]"}`}
    >
      {/* PaperCard fills the measured outer div */}
      {flush ? (
        <div className="relative flex w-full h-full items-center justify-center overflow-hidden">
          {renderContent()}
        </div>
      ) : (
        <PaperCard className="relative flex w-full h-full items-center justify-center overflow-hidden">
          {renderContent()}
        </PaperCard>
      )}
    </div>
  );

  function renderContent() {
    return (
      <>
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground font-medium">Rendering diagram...</p>
          </div>
        )}

        {error ? (
          <div className="flex w-full items-center justify-center p-6">
            <EmptyState
              icon={<AlertCircle className="size-8 text-danger" />}
              title="Diagram Error"
              description={isPlantUML ? "The PlantUML syntax might be invalid or the server is unavailable." : "The Mermaid syntax might be invalid or there was a rendering issue."}
              action={
                <pre className="mt-2 w-full max-w-lg overflow-x-auto rounded-lg border border-border bg-danger-soft/20 p-3 text-left text-[11px] font-mono text-danger">
                  {code}
                </pre>
              }
            />
          </div>
        ) : (
          <TransformWrapper initialScale={1} minScale={0.1} maxScale={8} centerOnInit style={{ width: "100%", height: "100%" }}>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute bottom-4 right-4 z-10 flex gap-2 rounded-lg border border-border bg-card/80 p-1.5 backdrop-blur shadow-sm">
                  <button
                    onClick={() => zoomOut()}
                    className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="size-4" />
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Reset Zoom"
                  >
                    <Maximize className="size-4" />
                  </button>
                  <button
                    onClick={() => zoomIn()}
                    className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="size-4" />
                  </button>
                </div>
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div
                    ref={ref}
                    className="w-full h-full"
                    style={{ opacity: loading ? 0 : 1, transition: "opacity 0.3s" }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        )}
      </>
    );
  }
}
