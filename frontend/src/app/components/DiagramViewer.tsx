import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loader2, AlertCircle, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    background: "#fffefb",
    primaryColor: "#fffefb",
    primaryTextColor: "#211f1b",
    primaryBorderColor: "#4f4d7a",
    lineColor: "#a39e93",
    secondaryColor: "#efece5",
    tertiaryColor: "#f6f5f1",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
  },
  securityLevel: "loose",
});

let counter = 0;

export function DiagramViewer({ code, flush }: { code: string; flush?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      if (!ref.current) return;
      
      setLoading(true);
      setError(null);
      ref.current.innerHTML = "";
      
      const id = `mermaid-svg-${counter++}`;
      
      try {
        // Clear any previous content
        ref.current.innerHTML = "";
        // Validate syntax first so it throws instead of rendering an error SVG
        await mermaid.parse(code);
        const { svg } = await mermaid.render(id, code);
        
        if (isMounted && ref.current) {
          ref.current.innerHTML = svg;
          setLoading(false);
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
          setLoading(false);
        }
      }
    };

    renderDiagram();
    
    return () => {
      isMounted = false;
    };
  }, [code]);

  return (
    <div className={`relative flex w-full items-center justify-center overflow-hidden ${flush ? "h-full" : "min-h-[400px] rounded-lg border border-border bg-card p-8 paper"}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground font-medium">Rendering diagram...</p>
        </div>
      )}
      
      {error ? (
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Diagram Error</h3>
            <p className="mt-1 text-xs text-muted-foreground">The mermaid syntax might be invalid or there was a rendering issue.</p>
          </div>
          <pre className="mt-2 w-full overflow-x-auto rounded-lg border border-border bg-secondary p-3 text-left text-[11px] font-mono text-danger">
            {code}
          </pre>
        </div>
      ) : (
        <TransformWrapper initialScale={1} minScale={0.1} maxScale={8} centerOnInit>
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
                  className="flex h-full w-full items-center justify-center transition-opacity duration-300 [&_svg]:max-w-full [&_svg]:h-auto"
                  style={{ opacity: loading ? 0 : 1 }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
    </div>
  );
}
