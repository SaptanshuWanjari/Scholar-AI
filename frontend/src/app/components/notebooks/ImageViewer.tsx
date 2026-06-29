import { useState } from "react";
import { Maximize2, X } from "lucide-react";

interface ImageViewerProps {
  url: string;
  alt?: string;
}

export function ImageViewer({ url, alt = "Notebook image" }: ImageViewerProps) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl border bg-muted/20">
        <img
          src={url}
          alt={alt}
          className="max-h-[600px] w-full object-contain"
          loading="lazy"
        />
        <button
          onClick={() => setFullscreen(true)}
          className="absolute right-2 top-2 rounded-md bg-background/80 p-1.5 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-background group-hover:opacity-100"
          title="View fullscreen"
        >
          <Maximize2 className="size-4" />
        </button>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 sm:p-8">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-4 top-4 rounded-full bg-background/50 p-2 text-foreground hover:bg-background/80 transition-colors z-50"
          >
            <X className="size-6" />
          </button>
          <img
            src={url}
            alt={alt}
            className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
