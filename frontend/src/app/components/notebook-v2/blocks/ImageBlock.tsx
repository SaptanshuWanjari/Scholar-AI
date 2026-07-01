// @ts-nocheck
import { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { cn } from "../../ui/utils";
import type { V2Block } from "../../../lib/notebook-v2.types";
import { useNotebookV2Store } from "../../../stores/useNotebookV2Store";

interface ImageBlockProps {
  block: V2Block<"image">;
  pageId: string;
}

export function ImageBlock({ block, pageId }: ImageBlockProps) {
  const { url, alt, width } = block.content;
  const updateBlockContent = useNotebookV2Store((s) => s.updateBlockContent);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        const max = 1920;
        if (w > max || h > max) {
          const ratio = Math.min(max / w, max / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        
        updateBlockContent(pageId, block.id, {
          url: dataUrl,
          width: w,
          height: h,
          alt: file.name,
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  if (!url) {
    return (
      <div 
        className="my-2 flex min-h-[150px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-tape/40 bg-paper/50 transition-colors hover:border-violet/40 hover:bg-violet-soft/20"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="rounded-full bg-violet/10 p-3 text-violet">
          <UploadCloud className="size-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-ink">Upload an image</p>
          <p className="text-xs text-pencil/60">JPEG, PNG, WebP up to 5MB</p>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>
    );
  }

  return (
    <figure 
      className="my-2 relative group/image"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={url}
        alt={alt ?? ""}
        loading="lazy"
        style={width ? { maxWidth: width } : undefined}
        className={cn(
          "mx-auto max-h-[28rem] rounded-lg border border-tape object-contain",
          "transition-opacity group-hover/image:opacity-90",
        )}
      />
      {isHovering && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-2 top-2 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/80"
        >
          Change Image
        </button>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      
      {/* We can also add an inline alt-text editor later, for now just show it */}
      {alt && (
        <figcaption className="mt-2 text-center text-xs italic text-pencil/50">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
