import { useEffect } from "react";
import { useAppearanceStore } from "../../stores/useAppearanceStore";

export function AppearanceSync() {
  const { fontSize, readingFont } = useAppearanceStore();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--font-size", `${fontSize}px`);

    let fontVar = "var(--font-sans)";
    if (readingFont === "serif") fontVar = "var(--font-serif)";
    if (readingFont === "mono") fontVar = "var(--font-mono)";
    if (readingFont === "book") fontVar = '"IBM Plex Serif", Georgia, serif';
    root.style.setProperty("--font-reading-current", fontVar);

  }, [fontSize, readingFont]);

  return null;
}
