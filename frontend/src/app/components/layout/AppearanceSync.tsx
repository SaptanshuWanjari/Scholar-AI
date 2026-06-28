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

    // Apply font size
    root.style.setProperty("--font-size", `${fontSize}px`);

    // Apply accent color
    root.style.setProperty("--violet", accentColor);

    // Apply reading font
    let fontVar = "var(--font-sans)";
    if (readingFont === "serif") fontVar = "var(--font-serif)";
    if (readingFont === "mono") fontVar = "var(--font-mono)";
    if (readingFont === "book") fontVar = '"IBM Plex Serif", Georgia, serif';
    root.style.setProperty("--font-reading-current", fontVar);

    // Apply accessibility classes
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
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
