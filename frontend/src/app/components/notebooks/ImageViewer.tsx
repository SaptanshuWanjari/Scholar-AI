import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { PaperCard } from "@/paper-ui/core";
import { PaperModal } from "@/paper-ui/components/dialogs";

interface ImageViewerProps {
  url: string;
  alt?: string;
}

export function ImageViewer({ url, alt = "Notebook image" }: ImageViewerProps) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <PaperCard shadow="sm" lift surface="#fffdf9" border={{ strokeWidth: 1.2, roughness: 0.9 }}>
        <div className="group relative overflow-hidden">
          <img
            src={url}
            alt={alt}
            className="max-h-[600px] w-full object-contain"
            loading="lazy"
          />
          <button
            onClick={() => setFullscreen(true)}
            className="absolute right-2 top-2 rounded-md bg-ink/5 p-1.5 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-ink/10 group-hover:opacity-100"
            title="View fullscreen"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </PaperCard>

      <PaperModal
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        width={Math.min(window.innerWidth * 0.95, 1400)}
      >
        <div className="flex items-center justify-center">
          <img
            src={url}
            alt={alt}
            className="max-h-[85vh] max-w-full rounded-md object-contain"
          />
        </div>
      </PaperModal>
    </>
  );
}
