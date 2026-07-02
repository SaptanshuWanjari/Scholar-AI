import { useAppearanceStore } from "@/app/stores/useAppearanceStore";

const ROOT_DEFAULTS: Record<string, string> = {
  "--paper-surface": "#fffdf9",
  "--paper-bg": "#f6f5f1",
  "--paper-panel": "#efece5",
  "--paper-ink": "#211f1b",
  "--paper-ink-muted": "#79736a",
  "--paper-stroke": "#222222",
  "--paper-stroke-sm": "#9c9484",
  "--paper-accent": "#4f4d7a",
  "--paper-border": "#e4e0d6",
  "--paper-success": "#3f7a4e",
  "--paper-warning": "#a3771f",
  "--paper-danger": "#9f3a36",
};

function readVar(name: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw || ROOT_DEFAULTS[name] || "";
}

// ponytail: read CSS vars at render time; next-themes triggers re-render on .dark toggle
export function usePaperTheme() {
  const fontSize = useAppearanceStore((s) => s.fontSize);
  const accentColor = useAppearanceStore((s) => s.accentColor);

  return {
    surface: readVar("--paper-surface"),
    bg: readVar("--paper-bg"),
    panel: readVar("--paper-panel"),
    ink: readVar("--paper-ink"),
    inkMuted: readVar("--paper-ink-muted"),
    stroke: readVar("--paper-stroke"),
    strokeSm: readVar("--paper-stroke-sm"),
    accent: accentColor || readVar("--paper-accent"),
    border: readVar("--paper-border"),
    success: readVar("--paper-success"),
    warning: readVar("--paper-warning"),
    danger: readVar("--paper-danger"),
    fontSize,
    fontScale: fontSize / 15,
    shadowColor: "rgba(0,0,0,0.18)",
  };
}
