import { useEffect } from "react";
import { useAppearanceStore } from "../../stores/useAppearanceStore";

export function AppearanceSync() {
  const {
    fontSize,
    readingFont,
    highContrast,
    accentColor,
    reduceAnimations,
    reduceTransparency,
  } = useAppearanceStore();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--font-size", `${fontSize}px`);

    root.style.setProperty("--violet", accentColor);
    root.style.setProperty("--paper-accent", accentColor);

    let fontVar = "var(--font-sans)";
    if (readingFont === "serif") fontVar = "var(--font-serif)";
    if (readingFont === "mono") fontVar = "var(--font-mono)";
    if (readingFont === "book") fontVar = '"IBM Plex Serif", Georgia, serif';
    root.style.setProperty("--font-reading-current", fontVar);

    if (highContrast) {
      root.classList.add("high-contrast");
      root.style.setProperty("--paper-bg", "#ffffff");
      root.style.setProperty("--paper-surface", "#ffffff");
      root.style.setProperty("--paper-panel", "#e0e0e0");
      root.style.setProperty("--paper-ink", "#000000");
      root.style.setProperty("--paper-ink-muted", "#333333");
      root.style.setProperty("--paper-stroke", "#000000");
      root.style.setProperty("--paper-stroke-sm", "#666666");
      root.style.setProperty("--paper-border", "#000000");
    } else {
      root.classList.remove("high-contrast");
      root.style.removeProperty("--paper-bg");
      root.style.removeProperty("--paper-surface");
      root.style.removeProperty("--paper-panel");
      root.style.removeProperty("--paper-ink");
      root.style.removeProperty("--paper-ink-muted");
      root.style.removeProperty("--paper-stroke");
      root.style.removeProperty("--paper-stroke-sm");
      root.style.removeProperty("--paper-border");
    }

    if (reduceAnimations) {
      root.classList.add("reduce-animations");
    } else {
      root.classList.remove("reduce-animations");
    }

    if (reduceTransparency) {
      root.classList.add("reduce-transparency");
    } else {
      root.classList.remove("reduce-transparency");
    }
  }, [
    fontSize,
    readingFont,
    highContrast,
    accentColor,
    reduceAnimations,
    reduceTransparency,
  ]);

  return null;
}
