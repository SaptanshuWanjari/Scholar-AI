# Frontend Context

This file contains all the context for the frontend codebase.

## File: index.html
```html

  <!DOCTYPE html>
  <html lang="en">
    <head>
      
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Scholar AI</title>
      <meta name="description" content="Streamline project management with an intuitive platform that enhances team collaboration, task tracking, and productivity for businesses of all sizes." />
      <meta name="robots" content="noindex, nofollow" />
      <style>html, body { height: 100%; margin: 0; } #root { height: 100%; }</style>
      
    </head>

    <body>
      
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
      
    </body>
  </html>
  
```

## File: README.md
```md
# Scholar AI

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
```

## File: postcss.config.mjs
```javascript
/**
 * PostCSS Configuration
 *
 * Tailwind CSS v4 (via @tailwindcss/vite) automatically sets up all required
 * PostCSS plugins — you do NOT need to include `tailwindcss` or `autoprefixer` here.
 *
 * This file only exists for adding additional PostCSS plugins, if needed.
 * For example:
 *
 * import postcssNested from 'postcss-nested'
 * export default { plugins: [postcssNested()] }
 *
 * Otherwise, you can leave this file empty.
 */
export default {}
```

## File: package.json
```json
{
  "name": "@figma/my-make-file",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  },
  "dependencies": {
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.1",
    "@mui/icons-material": "7.3.5",
    "@mui/material": "7.3.5",
    "@popperjs/core": "2.11.8",
    "@radix-ui/react-accordion": "1.2.3",
    "@radix-ui/react-alert-dialog": "1.1.6",
    "@radix-ui/react-aspect-ratio": "1.1.2",
    "@radix-ui/react-avatar": "1.1.3",
    "@radix-ui/react-checkbox": "1.1.4",
    "@radix-ui/react-collapsible": "1.1.3",
    "@radix-ui/react-context-menu": "2.2.6",
    "@radix-ui/react-dialog": "1.1.6",
    "@radix-ui/react-dropdown-menu": "2.1.6",
    "@radix-ui/react-hover-card": "1.1.6",
    "@radix-ui/react-label": "2.1.2",
    "@radix-ui/react-menubar": "1.1.6",
    "@radix-ui/react-navigation-menu": "1.2.5",
    "@radix-ui/react-popover": "1.1.6",
    "@radix-ui/react-progress": "1.1.2",
    "@radix-ui/react-radio-group": "1.2.3",
    "@radix-ui/react-scroll-area": "1.2.3",
    "@radix-ui/react-select": "2.1.6",
    "@radix-ui/react-separator": "1.1.2",
    "@radix-ui/react-slider": "1.2.3",
    "@radix-ui/react-slot": "1.1.2",
    "@radix-ui/react-switch": "1.1.3",
    "@radix-ui/react-tabs": "1.1.3",
    "@radix-ui/react-toggle": "1.1.2",
    "@radix-ui/react-toggle-group": "1.1.2",
    "@radix-ui/react-tooltip": "1.1.8",
    "@xyflow/react": "^12.11.1",
    "canvas-confetti": "1.9.4",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cmdk": "1.1.1",
    "date-fns": "3.6.0",
    "embla-carousel-react": "8.6.0",
    "input-otp": "1.4.2",
    "lucide-react": "0.487.0",
    "mermaid": "^11.15.0",
    "motion": "12.23.24",
    "next-themes": "0.4.6",
    "react-day-picker": "8.10.1",
    "react-dnd": "16.0.1",
    "react-dnd-html5-backend": "16.0.1",
    "react-hook-form": "7.55.0",
    "react-markdown": "^10.1.0",
    "react-popper": "2.3.0",
    "react-resizable-panels": "2.1.7",
    "react-responsive-masonry": "2.7.1",
    "react-router": "7.13.0",
    "react-slick": "0.31.0",
    "react-zoom-pan-pinch": "^4.0.3",
    "recharts": "2.15.2",
    "remark-gfm": "^4.0.1",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0",
    "tw-animate-css": "1.3.8",
    "vaul": "1.1.2",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "vite": "6.3.5"
  },
  "peerDependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    }
  },
  "pnpm": {
    "overrides": {
      "vite": "6.3.5"
    }
  }
}
```

## File: default_shadcn_theme.css
```css
/* KEEP_IN_SYNC(fullscreen/resources/figmake/shadcn/globals.css) */

:root {
  --font-size: 16px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --switch-background: #cbced4;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: #030213;
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
```

## File: pnpm-workspace.yaml
```yaml
packages:
  - '.'
allowBuilds:
  '@tailwindcss/oxide': set this to true or false
  esbuild: set this to true or false
supportedArchitectures:
  os:
    - linux
  cpu:
    - x64
    - arm64
  libc:
    - glibc
```

## File: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Proxy API calls to the FastAPI backend during development so the frontend
  // can call `/api/*` same-origin (no CORS juggling). Override the target with
  // the VITE_PROXY_TARGET env var if the backend runs elsewhere.
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
```

## File: src/main.tsx
```typescript

  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  
```

## File: src/app/App.tsx
```typescript
import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Toaster } from "./components/ui/sonner";
import { Dashboard } from "./pages/Dashboard";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { Documents } from "./pages/Documents";
import { AskAI } from "./pages/AskAI";
import { Notebooks } from "./pages/Notebooks";
import { Reading } from "./pages/Reading";
import { Exam } from "./pages/Exam";
import { PyqAnalysis } from "./pages/PyqAnalysis";
import { Revision } from "./pages/Revision";
import { Flashcards } from "./pages/Flashcards";
import { QuizPage } from "./pages/Quiz";
import { Diagrams } from "./pages/Diagrams";
import { MindMaps } from "./pages/MindMaps";
import { Teach } from "./pages/Teach";
import { SearchPage } from "./pages/Search";
import { SettingsPage } from "./pages/Settings";
import { Trace } from "./pages/Trace";
import { Courses } from "./pages/Courses";
import { Differences } from "./pages/Differences";
import { PromptLibrary } from "./pages/PromptLibrary";
import { OnboardingHero } from "./pages/onboarding/OnboardingHero";
import { OnboardingImport } from "./pages/onboarding/OnboardingImport";
import { OnboardingAnalyzing } from "./pages/onboarding/OnboardingAnalyzing";
import { OnboardingReady } from "./pages/onboarding/OnboardingReady";
import { OnboardingProvider } from "./context/OnboardingContext";
import { api } from "./lib/api";

function FirstLaunchGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("scholar_onboarding_done")) return;
    api.listDocuments().then((docs) => {
      if (docs.length === 0) navigate("/onboarding", { replace: true });
    }).catch(() => {});
  }, [navigate]);

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <OnboardingProvider>
        <Routes>
          {/* Onboarding flow — full-page, no sidebar */}
          <Route path="/onboarding" element={<OnboardingHero />} />
          <Route path="/onboarding/import" element={<OnboardingImport />} />
          <Route path="/onboarding/analyzing" element={<OnboardingAnalyzing />} />
          <Route path="/onboarding/ready" element={<OnboardingReady />} />

          {/* Main workspace — guarded by first-launch check */}
          <Route element={<FirstLaunchGuard><AppLayout /></FirstLaunchGuard>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teach" element={<Teach />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/ask" element={<AskAI />} />
            <Route path="/notebooks" element={<Notebooks />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/exam-analysis" element={<PyqAnalysis />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/diagrams" element={<Diagrams />} />
            <Route path="/mindmaps" element={<MindMaps />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/trace" element={<Trace />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/differences" element={<Differences />} />
            <Route path="/prompts" element={<PromptLibrary />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" theme="light" />
      </OnboardingProvider>
    </BrowserRouter>
  );
}
```

## File: src/app/components/AnswerViewer.tsx
```typescript
import { useState } from "react";
import { Check, Copy, Sparkles, User, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type { ChatMessage } from "../lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Button } from "./ui/button";

interface AnswerViewerProps {
  message: ChatMessage;
  onCitationClick?: (index: number) => void;
}

export function AnswerViewer({ message, onCitationClick }: AnswerViewerProps) {
  const [copied, setCopied] = useState(false);

  if (message.role === "user") {
    return (
      <div className="flex justify-end gap-3 py-2">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm border border-border bg-secondary px-4 py-2.5 text-sm">
          {message.content}
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card">
          <User className="size-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  const copy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 py-2"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        {message.content ? (
          <MarkdownRenderer
            content={message.content}
            onCitationClick={onCitationClick}
          />
        ) : (
          <div className="flex flex-col gap-3 py-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              Searching your knowledge base…
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        )}
        {message.streaming && message.content && (
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-primary align-middle" />
        )}
        {!message.streaming && message.content && (
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={copy}>
              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy answer"}
            </Button>
            <span className="text-xs text-muted-foreground">
              {message.sources?.length ?? 0} sources cited
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

## File: src/app/components/CitationBadge.tsx
```typescript
import { cn } from "./ui/utils";

interface CitationBadgeProps {
  index: number;
  onClick?: (index: number) => void;
  className?: string;
}

export function CitationBadge({ index, onClick, className }: CitationBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(index)}
      className={cn(
        "mx-0.5 inline-flex h-[18px] min-w-[18px] translate-y-[-1px] items-center justify-center rounded border border-violet/40 bg-violet-soft px-1 align-baseline font-mono text-[10px] font-medium text-violet transition-colors hover:bg-violet hover:text-white",
        className,
      )}
      aria-label={`Jump to source ${index}`}
    >
      {index}
    </button>
  );
}
```

## File: src/app/components/CommandMenu.tsx
```typescript
import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { navItems } from "../lib/nav";
import { courses, documents } from "../lib/mock-data";
import { useUIStore } from "../stores/useUIStore";
import { FileText, GraduationCap } from "lucide-react";

export function CommandMenu() {
  const open = useUIStore((s) => s.commandOpen);
  const setOpen = useUIStore((s) => s.setCommandOpen);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, documents, courses…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem key={item.to} onSelect={() => go(item.to)}>
              <item.icon className="size-4 text-muted-foreground" />
              <span>{item.label}</span>
              {item.shortcut && (
                <kbd className="ml-auto rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                  {item.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Documents">
          {documents.slice(0, 4).map((d) => (
            <CommandItem key={d.id} onSelect={() => go("/documents")}>
              <FileText className="size-4 text-muted-foreground" />
              <span className="truncate">{d.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Courses">
          {courses.map((c) => (
            <CommandItem key={c.id} onSelect={() => go("/knowledge")}>
              <GraduationCap className="size-4" style={{ color: c.color }} />
              <span>{c.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{c.code}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

## File: src/app/components/DiagramViewer.tsx
```typescript
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
```

## File: src/app/components/FlashcardCard.tsx
```typescript
import { useState } from "react";
import { motion } from "motion/react";
import { RotateCw } from "lucide-react";
import type { Flashcard } from "../lib/types";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

const easeMeta: Record<Flashcard["ease"], string> = {
  new: "border-cyan/40 bg-cyan-soft text-cyan",
  learning: "border-warning/40 bg-warning-soft text-warning",
  mastered: "border-success/40 bg-success-soft text-success",
};

export function FlashcardCard({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="group relative h-44 w-full cursor-pointer text-left [perspective:1000px]"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="relative size-full [transform-style:preserve-3d]"
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col rounded-xl border border-border bg-card p-4 [backface-visibility:hidden] [transform:rotateY(0deg)]"
          style={{ zIndex: flipped ? 0 : 1 }}
        >
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="text-[10px] font-medium uppercase tracking-wider"
            >
              {card.type}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-[10px] font-medium", easeMeta[card.ease])}
            >
              {card.ease}
            </Badge>
          </div>
          <p className="mt-4 flex-1 font-serif text-base leading-snug text-foreground/90">
            {card.front}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-muted-foreground uppercase tracking-tight">
            <span>{card.deck}</span>
            <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <RotateCw className="size-3" /> Flip
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col rounded-xl border border-violet/30 bg-[#fdfcfa] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ zIndex: flipped ? 1 : 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-violet">
              Definition
            </div>
            <div className="text-[10px] font-medium text-muted-foreground italic">
              Due {card.due}
            </div>
          </div>
          <p className="flex-1 font-serif text-base leading-snug text-foreground">
            {card.back}
          </p>
        </div>
      </motion.div>
    </button>
  );
}
```

## File: src/app/components/MetricCard.tsx
```typescript
import { type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "./ui/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
  delta?: number;
  hint?: string;
}

export function MetricCard({ label, value, icon: Icon, accent, delta, hint }: MetricCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/20"
    >
      <div className="flex items-center justify-between">
        <div
          className="flex size-9 items-center justify-center rounded-md"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          <Icon className="size-[18px]" />
        </div>
        {delta !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              positive ? "text-success" : "text-danger",
            )}
          >
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-4 font-display text-[2rem] leading-none tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground/70">{hint}</div>}
    </motion.div>
  );
}
```

## File: src/app/components/MindMapViewer.tsx
```typescript
import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  BackgroundVariant,
} from "@xyflow/react";

// Explicitly import styles
import "@xyflow/react/dist/style.css";

const nodeBase = {
  borderRadius: 8,
  border: "1px solid #e4e0d6",
  background: "#fffefb",
  color: "#211f1b",
  fontSize: 13,
  fontWeight: 500,
  padding: "10px 16px",
};

const initialNodes: Node[] = [
  { id: "root", position: { x: 380, y: 20 }, data: { label: "Neural Networks" }, style: { ...nodeBase, background: "#211f1b", border: "1px solid #211f1b", color: "#f6f5f1", fontWeight: 600 } },
  { id: "n1", position: { x: 120, y: 140 }, data: { label: "Architecture" }, style: { ...nodeBase, borderColor: "#4f4d7a" } },
  { id: "n2", position: { x: 380, y: 140 }, data: { label: "Training" }, style: { ...nodeBase, borderColor: "#4f4d7a" } },
  { id: "n3", position: { x: 640, y: 140 }, data: { label: "Regularization" }, style: { ...nodeBase, borderColor: "#4f4d7a" } },
  { id: "n1a", position: { x: 20, y: 260 }, data: { label: "Layers" }, style: nodeBase },
  { id: "n1b", position: { x: 180, y: 260 }, data: { label: "Activations" }, style: nodeBase },
  { id: "n2a", position: { x: 340, y: 260 }, data: { label: "Backpropagation" }, style: { ...nodeBase, borderColor: "#3f7a4e" } },
  { id: "n2b", position: { x: 520, y: 260 }, data: { label: "Optimizers" }, style: nodeBase },
  { id: "n3a", position: { x: 700, y: 260 }, data: { label: "Dropout" }, style: nodeBase },
  { id: "n2a1", position: { x: 300, y: 370 }, data: { label: "Chain Rule" }, style: nodeBase },
  { id: "n2a2", position: { x: 470, y: 370 }, data: { label: "Gradients" }, style: nodeBase },
];

const edgeStyle = { stroke: "#c8c2b5", strokeWidth: 1.5 };

const initialEdges: Edge[] = [
  { id: "e-r-1", source: "root", target: "n1", style: edgeStyle, animated: true },
  { id: "e-r-2", source: "root", target: "n2", style: edgeStyle, animated: true },
  { id: "e-r-3", source: "root", target: "n3", style: edgeStyle, animated: true },
  { id: "e-1-1a", source: "n1", target: "n1a", style: edgeStyle },
  { id: "e-1-1b", source: "n1", target: "n1b", style: edgeStyle },
  { id: "e-2-2a", source: "n2", target: "n2a", style: { stroke: "#4f4d7a", strokeWidth: 1.5 } },
  { id: "e-2-2b", source: "n2", target: "n2b", style: edgeStyle },
  { id: "e-3-3a", source: "n3", target: "n3a", style: edgeStyle },
  { id: "e-2a-1", source: "n2a", target: "n2a1", style: edgeStyle },
  { id: "e-2a-2", source: "n2a", target: "n2a2", style: edgeStyle },
];

export function MindMapViewer() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onInit = useCallback(() => {
    console.log("ReactFlow initialized");
  }, []);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-background"
        minZoom={0.2}
        maxZoom={4}
        defaultEdgeOptions={{
          style: edgeStyle,
          animated: true,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#d8d3c7" />
        <Controls className="!border-border !bg-card [&_button]:!border-border [&_button]:!bg-card [&_button]:!fill-foreground [&_button:hover]:!bg-accent" />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => (n.style?.background as string) || "#211f1b"}
          maskColor="rgba(246,245,241,0.7)"
          className="!border !border-border !bg-card"
        />
      </ReactFlow>
    </div>
  );
}
```

## File: src/app/components/Page.tsx
```typescript
import type { ReactNode } from "react";
import { cn } from "./ui/utils";

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="h-full w-full overflow-y-auto scroll-smooth">
      <div className={cn("mx-auto w-full max-w-7xl px-6 py-6", className)}>
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider text-[11px]">{title}</h3>
      {action}
    </div>
  );
}
```

## File: src/app/components/SelectionToolbar.tsx
```typescript
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

export interface SelectionAction {
  label: string;
  icon: LucideIcon;
  onSelect: (text: string) => void;
}

interface SelectionState {
  text: string;
  x: number;
  y: number;
}

export function useTextSelection(containerRef: RefObject<HTMLElement | null>) {
  const [selection, setSelection] = useState<SelectionState | null>(null);

  const clear = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    const handle = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        setSelection(null);
        return;
      }
      const text = sel.toString().trim();
      const anchor = sel.anchorNode;
      if (!text || text.length < 2 || !anchor) {
        setSelection(null);
        return;
      }
      if (containerRef.current && !containerRef.current.contains(anchor)) {
        setSelection(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      setSelection({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    };
    document.addEventListener("mouseup", handle);
    document.addEventListener("keyup", handle);
    return () => {
      document.removeEventListener("mouseup", handle);
      document.removeEventListener("keyup", handle);
    };
  }, [containerRef]);

  return { selection, clear };
}

export function SelectionToolbar({
  containerRef,
  actions,
}: {
  containerRef: RefObject<HTMLElement | null>;
  actions: SelectionAction[];
}) {
  const { selection, clear } = useTextSelection(containerRef);
  const barRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {selection && (
        <motion.div
          ref={barRef}
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.96 }}
          transition={{ duration: 0.14 }}
          style={{
            position: "fixed",
            left: selection.x,
            top: selection.y - 12,
            transform: "translate(-50%, -100%)",
            zIndex: 60,
          }}
          className="flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-lg shadow-foreground/5"
        >
          {actions.map((a, i) => (
            <button
              key={a.label}
              onClick={() => {
                a.onSelect(selection.text);
                clear();
              }}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              style={{ borderLeft: i > 0 ? "1px solid var(--border)" : undefined }}
            >
              <a.icon className="size-3.5 text-violet" />
              {a.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## File: src/app/components/ConceptNode.tsx
```typescript
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ConceptData } from "../lib/graph-data";
import { cn } from "./ui/utils";

const handleStyle: React.CSSProperties = {
  opacity: 0,
  width: 8,
  height: 8,
  pointerEvents: "none",
};

const positions = [Position.Top, Position.Right, Position.Bottom, Position.Left];

const sizeMap = {
  large: {
    wrapper: "min-w-[136px] px-4 py-3",
    label: "text-[15px] font-semibold leading-snug",
    meta: "text-[10px]",
  },
  medium: {
    wrapper: "min-w-[108px] px-3.5 py-2.5",
    label: "text-[13px] font-medium leading-snug",
    meta: "text-[10px]",
  },
  small: {
    wrapper: "min-w-[88px] px-3 py-2",
    label: "text-[12px] font-medium leading-snug",
    meta: "text-[10px]",
  },
};

export const ConceptNode = memo(function ConceptNode({
  data,
  selected,
}: NodeProps & { data: ConceptData }) {
  const s = sizeMap[data.size];
  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-xl border bg-card text-center transition-all duration-150",
        s.wrapper,
        selected
          ? "border-violet bg-violet-soft/30 shadow-md shadow-violet/10"
          : "border-border shadow-sm hover:border-foreground/25 hover:shadow-md",
      )}
    >
      {/* Handles on all sides for flexible edge routing */}
      {positions.map((pos) => (
        <span key={pos}>
          <Handle type="target" position={pos} style={handleStyle} />
          <Handle type="source" position={pos} style={handleStyle} />
        </span>
      ))}

      <div className={cn("text-foreground", s.label, selected && "text-violet")}>
        {data.label}
      </div>
      <div className={cn("mt-0.5 text-muted-foreground", s.meta)}>
        {data.refCount} refs · {data.sourceCount} src
      </div>
    </div>
  );
});
```

## File: src/app/components/RelationshipInspector.tsx
```typescript
import React from "react";
import { 
  ArrowRightLeft, 
  FileText, 
  CheckCircle, 
  BarChart, 
  BookOpen,
  X,
  Library,
  GitCompare,
  AlignLeft,
  Network,
  BookmarkPlus
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

interface RelationshipInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RelationshipInspector({ isOpen, onClose }: RelationshipInspectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-[420px] flex-col border-l border-neutral-200 bg-white text-neutral-900 shadow-2xl transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex flex-col border-b border-neutral-200 p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Relationship</span>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-xl font-serif font-medium tracking-tight">Tool Calling</h2>
          <ArrowRightLeft size={18} className="text-neutral-400" />
          <h2 className="text-xl font-serif font-medium tracking-tight">Agent Memory</h2>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <Badge variant="outline" className="rounded-sm border-neutral-300 font-mono text-xs font-normal text-neutral-700 flex items-center space-x-1">
            <CheckCircle size={12} className="mr-1" />
            87% Confidence
          </Badge>
          <Badge variant="secondary" className="rounded-sm bg-neutral-100 text-neutral-700 font-medium text-xs">
            Type: Uses
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-6">
        {/* Relationship Summary */}
        <section className="mb-8">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">Summary</h3>
          <p className="text-sm leading-relaxed text-neutral-700 font-serif">
            <span className="font-semibold text-neutral-900">Tool Calling</span> is frequently referenced alongside <span className="font-semibold text-neutral-900">Agent Memory</span> in agent architecture documents. The relationship appears in multiple sources discussing tool-enabled reasoning and memory persistence.
          </p>
        </section>

        <Separator className="mb-8 bg-neutral-100" />

        {/* Evidence Section */}
        <section className="mb-8">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Found Together In</h3>
          <div className="space-y-3">
            {[
              { name: "Agent Design Patterns.pdf", section: "Architecture", page: 12, conf: "92%" },
              { name: "LangGraph Notes", section: "State Management", page: 4, conf: "88%" },
              { name: "Tool Calling Guide", section: "Memory Interception", page: 1, conf: "85%" },
              { name: "Agent Memory Research", section: "Persistence layer", page: 7, conf: "81%" },
            ].map((source, i) => (
              <Card key={i} className="border border-neutral-200 rounded-md shadow-none hover:bg-neutral-50 transition-colors cursor-pointer">
                <CardContent className="p-3 flex justify-between items-start">
                  <div className="flex space-x-3">
                    <FileText size={16} className="text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{source.name}</p>
                      <p className="text-xs text-neutral-500 mt-1 font-serif">Sec: {source.section} • Pg: {source.page}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{source.conf}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="mb-8 bg-neutral-100" />

        {/* Supporting Chunks */}
        <section className="mb-8">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Supporting Chunks</h3>
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm font-serif leading-relaxed text-neutral-700">
            <p className="mb-2">
              "...when an agent executes <span className="bg-neutral-200 px-1 rounded-sm font-medium">Tool Calling</span> operations, it frequently needs to store the intermediate execution results into <span className="bg-neutral-200 px-1 rounded-sm font-medium">Agent Memory</span> to maintain context over long-running iterative tasks."
            </p>
            <div className="text-xs text-neutral-400 font-sans text-right mt-2">— Agent Design Patterns.pdf, Pg 12</div>
          </div>
        </section>

        <Separator className="mb-8 bg-neutral-100" />

        {/* Graph Statistics */}
        <section className="mb-8">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Graph Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col border border-neutral-200 rounded-md p-3 items-center text-center">
              <span className="text-2xl font-light font-serif text-neutral-900 mb-1">14</span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">Co-occurrences</span>
            </div>
            <div className="flex flex-col border border-neutral-200 rounded-md p-3 items-center text-center">
              <span className="text-2xl font-light font-serif text-neutral-900 mb-1">4</span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">Shared Sources</span>
            </div>
            <div className="flex flex-col border border-neutral-200 rounded-md p-3 items-center text-center">
              <span className="text-2xl font-light font-serif text-neutral-900 mb-1">7</span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">Shared Artifacts</span>
            </div>
          </div>
        </section>
      </ScrollArea>

      {/* Actions */}
      <div className="border-t border-neutral-200 bg-neutral-50 p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => toast.success("Opening sources")} className="w-full text-xs font-medium justify-start border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100">
            <Library className="mr-2 h-4 w-4 text-neutral-500" />
            Open Sources
          </Button>
          <Button variant="outline" onClick={() => toast.success("Comparing concepts")} className="w-full text-xs font-medium justify-start border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100">
            <GitCompare className="mr-2 h-4 w-4 text-neutral-500" />
            Compare Concepts
          </Button>
          <Button variant="outline" onClick={() => toast.success("Generating summary")} className="w-full text-xs font-medium justify-start border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100">
            <AlignLeft className="mr-2 h-4 w-4 text-neutral-500" />
            Generate Summary
          </Button>
          <Button variant="outline" onClick={() => toast.success("Creating diagram")} className="w-full text-xs font-medium justify-start border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100">
            <Network className="mr-2 h-4 w-4 text-neutral-500" />
            Create Diagram
          </Button>
          <Button variant="default" onClick={() => toast.success("Added to Notebook")} className="w-full col-span-2 text-xs font-medium mt-1 bg-neutral-900 text-white hover:bg-neutral-800">
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Add To Notebook
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## File: src/app/components/EvidenceViewer.tsx
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText as FileTextIcon, 
  MessageSquare as MessageSquareIcon, 
  StickyNote as StickyNoteIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  ExternalLink as ExternalLinkIcon,
  Eye as EyeIcon,
  Copy as CopyIcon,
  BookOpen as BookOpenIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface Chunk {
  id: string;
  text: string;
  highlights: string[];
}

interface Source {
  id: string;
  sourceName: string;
  documentType: 'Document' | 'Note' | 'Answer';
  pageNumber?: number;
  sectionName?: string;
  similarityScore: number; // 0 to 100
  evidenceScore: 'Strong' | 'Moderate' | 'Weak';
  chunks: Chunk[];
}

const mockSources: Source[] = [
  {
    id: '1',
    sourceName: 'Neural Networks and Deep Learning.pdf',
    documentType: 'Document',
    pageNumber: 142,
    sectionName: 'Backpropagation Algorithm',
    similarityScore: 94,
    evidenceScore: 'Strong',
    chunks: [
      {
        id: 'c1',
        text: 'The backpropagation algorithm calculates the gradient of the error function with respect to the neural network\'s weights. It does this by applying the chain rule for derivatives iteratively from the final layer to the initial layer.',
        highlights: ['calculates the gradient of the error function', 'applying the chain rule for derivatives']
      }
    ]
  },
  {
    id: '2',
    sourceName: 'Lecture Notes - Week 5',
    documentType: 'Note',
    sectionName: 'Optimization Techniques',
    similarityScore: 82,
    evidenceScore: 'Moderate',
    chunks: [
      {
        id: 'c2',
        text: 'While backpropagation gives us the gradient, we still need an optimization algorithm like SGD or Adam to actually update the weights and minimize the loss.',
        highlights: ['optimization algorithm like SGD or Adam']
      }
    ]
  },
  {
    id: '3',
    sourceName: 'Q: How does gradient descent work?',
    documentType: 'Answer',
    similarityScore: 65,
    evidenceScore: 'Weak',
    chunks: [
      {
        id: 'c3',
        text: 'Gradient descent steps in the opposite direction of the gradient to find the local minimum. Learning rate controls the step size.',
        highlights: ['opposite direction of the gradient']
      }
    ]
  }
];

const EvidenceViewer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Document': return <FileTextIcon className="w-4 h-4" />;
      case 'Note': return <StickyNoteIcon className="w-4 h-4" />;
      case 'Answer': return <MessageSquareIcon className="w-4 h-4" />;
      default: return <FileTextIcon className="w-4 h-4" />;
    }
  };

  const getEvidenceColor = (score: string) => {
    switch(score) {
      case 'Strong': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Weak': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getEvidenceIcon = (score: string) => {
    switch(score) {
      case 'Strong': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Moderate': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'Weak': return <AlertCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const highlightText = (text: string, highlights: string[]) => {
    let result = text;
    // Simple replacement for demo purposes. In production, use a more robust parsing approach.
    highlights.forEach(h => {
      const regex = new RegExp(`(${h})`, 'gi');
      result = result.replace(regex, '<span class="bg-indigo-500/20 text-indigo-200 font-medium px-1 rounded-sm">$1</span>');
    });
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 border border-slate-800 rounded-xl bg-slate-950/50 backdrop-blur-xl overflow-hidden font-sans">
      
      {/* Header Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-900/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              Source Evidence
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">
                {mockSources.length} Sources
              </span>
            </span>
            <span className="text-xs text-slate-500 mt-0.5">
              Verified against knowledge base
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5"><FileTextIcon className="w-3.5 h-3.5"/> 4 Docs</div>
            <div className="flex items-center gap-1.5"><StickyNoteIcon className="w-3.5 h-3.5"/> 2 Notes</div>
            <div className="flex items-center gap-1.5"><MessageSquareIcon className="w-3.5 h-3.5"/> 3 Answers</div>
          </div>
          <div className="p-1.5 rounded-full group-hover:bg-slate-800 transition-colors text-slate-400">
            {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-slate-800"
          >
            <div className="p-4 space-y-4 bg-slate-950">
              {mockSources.map((source) => (
                <div key={source.id} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/40">
                  
                  {/* Source Card Header */}
                  <div className="p-3 border-b border-slate-800/60 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-slate-800 text-slate-300">
                        {getTypeIcon(source.documentType)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-200 line-clamp-1" title={source.sourceName}>
                          {source.sourceName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                          <span className="text-slate-300 font-medium">{source.documentType}</span>
                          {source.pageNumber && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-700" />
                              <span>Page {source.pageNumber}</span>
                            </>
                          )}
                          {source.sectionName && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-700" />
                              <span className="truncate max-w-[150px]">{source.sectionName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-1">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getEvidenceColor(source.evidenceScore)}`}>
                          {getEvidenceIcon(source.evidenceScore)}
                          {source.evidenceScore}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {source.similarityScore}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chunks */}
                  <div className="p-4 space-y-3">
                    {source.chunks.map(chunk => (
                      <div key={chunk.id} className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-700 group-hover:bg-indigo-500 transition-colors rounded-full" />
                        <div className="pl-4 text-sm leading-relaxed text-slate-300">
                          <p className="before:content-['\201C'] after:content-['\201D'] text-slate-300">
                            {highlightText(chunk.text, chunk.highlights)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions Footer */}
                  <div className="px-4 py-2.5 bg-slate-900/50 border-t border-slate-800/60 flex items-center justify-end gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors">
                      <ExternalLinkIcon className="w-3.5 h-3.5" />
                      Open
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors">
                      <EyeIcon className="w-3.5 h-3.5" />
                      Context
                    </button>
                    <button 
                      onClick={() => handleCopy(`Citation: ${source.sourceName}, ${source.pageNumber ? 'p. ' + source.pageNumber : ''}`, source.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                    >
                      {copiedId === source.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <CopyIcon className="w-3.5 h-3.5" />}
                      {copiedId === source.id ? 'Copied' : 'Cite'}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded transition-colors ml-2">
                      <BookOpenIcon className="w-3.5 h-3.5" />
                      Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EvidenceViewer;
```

## File: src/app/components/ConceptPlayground.tsx
```typescript
import React, { useState } from "react";
import { 
  X, BookOpen, FileText, Network, CheckCircle, Save, 
  BrainCircuit, ListChecks, Sparkles, CornerDownRight, 
  Library, GitCompare, MessageSquareText, Search, Link2, Send
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "./ui/select";
import { toast } from "sonner";

interface ConceptPlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
  conceptName?: string;
}

export function ConceptPlayground({ isOpen, onClose, conceptName = "Tool Calling" }: ConceptPlaygroundProps) {
  const [scope, setScope] = useState("only_this");
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-[600px] flex-col border-l border-neutral-200 bg-neutral-50/50 text-neutral-900 shadow-2xl transition-transform duration-300 ease-in-out">
      
      {/* Header */}
      <div className="flex flex-col border-b border-neutral-200 bg-white p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Ask About This Concept</span>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <h2 className="text-2xl font-serif font-medium tracking-tight mb-4 flex items-center space-x-2">
          <BrainCircuit className="text-neutral-700 mr-2" size={24} />
          {conceptName}
        </h2>

        <div className="flex items-center space-x-3 mb-4">
          <Badge variant="outline" className="rounded-sm border-neutral-300 font-mono text-xs font-normal text-neutral-700">
            <Link2 size={12} className="mr-1 inline-block" />
            4 Connected Sources
          </Badge>
          <Badge variant="outline" className="rounded-sm border-neutral-300 font-mono text-xs font-normal text-neutral-700">
            <Network size={12} className="mr-1 inline-block" />
            12 Related Concepts
          </Badge>
        </div>

        {/* Scope Selector */}
        <div className="flex items-center space-x-2 bg-neutral-50 p-2 rounded-md border border-neutral-200">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider ml-2">Context Scope:</span>
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-[200px] h-8 text-xs bg-white border-neutral-200 focus:ring-0 focus:ring-offset-0 shadow-none">
              <SelectValue placeholder="Select Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="only_this" className="text-xs">Only This Concept</SelectItem>
              <SelectItem value="connected_concepts" className="text-xs">Connected Concepts</SelectItem>
              <SelectItem value="connected_sources" className="text-xs">Connected Sources</SelectItem>
              <SelectItem value="entire_kb" className="text-xs">Entire Knowledge Base</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-6 bg-white">
        
        {/* Research Note View (Editorial Reading Style) */}
        <div className="space-y-8 pb-10">
          
          <div className="prose prose-neutral prose-sm max-w-none">
            <h3 className="text-xl font-serif font-medium border-b border-neutral-100 pb-2 flex items-center">
              <MessageSquareText size={18} className="mr-2 text-neutral-400" />
              How does Tool Calling differ from MCP?
            </h3>
            
            <p className="leading-relaxed text-neutral-700 font-serif mt-4">
              <strong className="text-neutral-900 font-semibold">Tool Calling</strong> is the mechanism by which an LLM emits a structured JSON object representing a function invocation, whereas the <strong className="text-neutral-900 font-semibold">Model Context Protocol (MCP)</strong> is a broader standardization for how tools, prompts, and resources are discovered and exposed to models.
            </p>
            
            <p className="leading-relaxed text-neutral-700 font-serif mt-3">
              While Tool Calling focuses entirely on the output format (e.g., matching a JSON schema to a Python function), MCP defines a client-server architecture. An MCP Server can expose multiple tools that the model can then call using standard Tool Calling.
            </p>
          </div>

          {/* Source Grounding */}
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Source Grounding</span>
              <Badge variant="outline" className="rounded-sm border-emerald-200 bg-emerald-50 text-emerald-700 font-mono text-[10px] uppercase font-semibold">
                <CheckCircle size={10} className="mr-1 inline-block" />
                94% Confidence
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-neutral-700">
                <FileText size={14} className="text-neutral-400" />
                <span className="font-medium">MCP Specification.md</span>
                <span className="text-xs text-neutral-400 font-serif">— Architecture Section</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-700">
                <FileText size={14} className="text-neutral-400" />
                <span className="font-medium">Agent Design Patterns.pdf</span>
                <span className="text-xs text-neutral-400 font-serif">— Pg 14</span>
              </div>
            </div>

            <div className="border-l-2 border-neutral-300 pl-3 py-1 text-sm font-serif leading-relaxed text-neutral-600 bg-white rounded-r-md">
              <CornerDownRight size={12} className="inline mr-2 text-neutral-400 -mt-1" />
              "The Model Context Protocol standardizes the transport layer, allowing tools to be served over stdio or SSE. The underlying model still relies on native Tool Calling features to execute these endpoints."
            </div>
          </div>
          
        </div>

        <Separator className="my-6 bg-neutral-100" />

        {/* Suggested Questions */}
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500 flex items-center">
            <Sparkles size={14} className="mr-2 text-neutral-400" />
            Continue Exploring
          </h3>
          <div className="flex flex-col space-y-2">
            {[
              "What are the prerequisites?",
              "Show real-world examples.",
              "Compare with Agent Memory.",
              "How is this implemented in LangGraph?"
            ].map((q, i) => (
              <button key={i} onClick={() => toast.success(`Asking: ${q}`)} className="text-left text-sm font-serif text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-3 py-2 rounded-md transition-colors flex items-center group border border-transparent hover:border-neutral-200">
                <Search size={14} className="mr-3 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                {q}
              </button>
            ))}
          </div>
        </div>

      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t border-neutral-200 p-4 pb-0">
        <div className="relative">
          <textarea 
            className="w-full min-h-[80px] rounded-md border border-neutral-300 bg-neutral-50 px-3 py-3 text-sm font-serif placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:bg-white transition-colors resize-none"
            placeholder="Ask about Tool Calling..."
          />
          <Button size="icon" onClick={() => toast.success("Question submitted")} className="absolute bottom-3 right-3 h-8 w-8 rounded-sm bg-neutral-900 text-white hover:bg-neutral-800">
            <Send size={14} />
          </Button>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="bg-white p-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Saved to Notebook")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <Save className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Save to Notebook
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Flashcards generated")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <Library className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Generate Flashcards
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Quiz generated")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <ListChecks className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Generate Quiz
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Diagram generated")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <Network className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Generate Diagram
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Mind Map generated")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <GitCompare className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Generate Mind Map
          </Button>
        </div>
      </div>

    </div>
  );
}
```

## File: src/app/components/SemanticNeighborhood.tsx
```typescript
import React, { useState } from "react";
import { 
  Network, 
  BookOpen, 
  FileText, 
  GitCompare, 
  BookmarkPlus, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Maximize2
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import * as HoverCard from "@radix-ui/react-hover-card";
import { toast } from "sonner";

interface Concept {
  id: string;
  name: string;
  similarity: number;
  definition: string;
  refCount: number;
  sourceCount: number;
}

const concepts: Concept[] = [
  {
    id: "c1",
    name: "Function Calling",
    similarity: 0.93,
    definition: "The ability of a language model to execute predefined functions based on user intent.",
    refCount: 24,
    sourceCount: 8
  },
  {
    id: "c2",
    name: "Agent Tools",
    similarity: 0.91,
    definition: "External utilities and APIs provided to an autonomous agent to interact with its environment.",
    refCount: 31,
    sourceCount: 12
  },
  {
    id: "c3",
    name: "MCP",
    similarity: 0.88,
    definition: "Model Context Protocol; a standardized interface for providing context and tools to language models.",
    refCount: 18,
    sourceCount: 5
  },
  {
    id: "c4",
    name: "LangGraph Tools",
    similarity: 0.86,
    definition: "Stateful, graph-based execution nodes representing tools in the LangChain ecosystem.",
    refCount: 15,
    sourceCount: 6
  },
  {
    id: "c5",
    name: "Tool Execution",
    similarity: 0.82,
    definition: "The process by which an AI agent runs an invoked tool and parses the resulting output.",
    refCount: 42,
    sourceCount: 14
  }
];

export function SemanticNeighborhood({ isOpen = true, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="flex w-[420px] flex-col border border-neutral-200/80 bg-white text-neutral-900 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
        <div className="flex items-center gap-2.5 text-neutral-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
            <Network className="h-4 w-4" />
          </div>
          <h2 className="text-base font-semibold tracking-tight">Nearest Concepts</h2>
        </div>
      </div>
      
      {/* Target Concept */}
      <div className="px-6 py-6 bg-gradient-to-b from-neutral-50/50 to-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="relative z-10">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Selected Concept</div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-extrabold tracking-tight text-neutral-900">Tool Calling</h3>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100/50 shadow-sm">
              Core Node
            </Badge>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            The mechanism enabling language models to interface with external systems by predicting structured arguments for predefined functions.
          </p>
        </div>
      </div>

      {/* Neighborhood List */}
      <div className="flex-1 bg-neutral-50/40 border-t border-neutral-100">
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Semantic Neighborhood</div>
            <div className="text-[11px] font-medium text-neutral-400">Cosine Sim</div>
          </div>

          <div className="space-y-2.5">
            {concepts.map((concept, idx) => (
              <HoverCard.Root key={concept.id} openDelay={150}>
                <HoverCard.Trigger asChild>
                  <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-200/60 bg-white p-3 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5">
                    {/* Similarity Bar Background */}
                    <div 
                      className="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-indigo-50/80 to-purple-50/40 transition-all duration-500 ease-out group-hover:from-indigo-100/80 group-hover:to-purple-100/40"
                      style={{ width: `${Math.max(15, (concept.similarity - 0.7) * 333)}%` }} 
                    />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 border border-neutral-100 shadow-sm text-[11px] font-bold text-neutral-500 group-hover:text-indigo-600 transition-colors backdrop-blur-sm">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-neutral-700 group-hover:text-indigo-700 transition-colors">
                          {concept.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-mono font-semibold text-indigo-600/90">
                          {concept.similarity.toFixed(2)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </HoverCard.Trigger>
                
                <HoverCard.Portal>
                  <HoverCard.Content 
                    className="z-50 w-80 rounded-xl border border-neutral-200/80 bg-white/95 backdrop-blur-xl p-4 shadow-2xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ring-1 ring-black/5"
                    sideOffset={10}
                    side="right"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-600">
                            <Sparkles className="h-3.5 w-3.5" />
                          </div>
                          <h4 className="font-bold text-neutral-900">{concept.name}</h4>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono bg-white">{concept.similarity} Sim</Badge>
                      </div>
                      
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {concept.definition}
                      </p>
                      
                      <div className="flex gap-4 pt-3 border-t border-neutral-100/80 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <FileText className="h-3.5 w-3.5 text-blue-500" />
                          <span className="font-semibold text-neutral-700">{concept.refCount}</span> References
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-semibold text-neutral-700">{concept.sourceCount}</span> Sources
                        </div>
                      </div>
                    </div>
                  </HoverCard.Content>
                </HoverCard.Portal>
              </HoverCard.Root>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-neutral-100" />

      {/* Action Footer */}
      <div className="bg-white p-5">
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="outline" onClick={() => toast.success("Concept opened")} className="w-full justify-start gap-2 h-9 text-[13px] font-medium shadow-sm hover:bg-neutral-50 transition-colors border-neutral-200">
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
            Open Concept
          </Button>
          <Button variant="outline" onClick={() => toast.success("Comparing concepts")} className="w-full justify-start gap-2 h-9 text-[13px] font-medium shadow-sm hover:bg-neutral-50 transition-colors border-neutral-200">
            <GitCompare className="h-3.5 w-3.5 text-neutral-500" />
            Compare
          </Button>
          <Button variant="outline" onClick={() => toast.success("Expanded")} className="w-full justify-start gap-2 h-9 text-[13px] font-medium shadow-sm hover:bg-neutral-50 transition-colors border-neutral-200">
            <Maximize2 className="h-3.5 w-3.5 text-neutral-500" />
            Expand
          </Button>
          <Button onClick={() => toast.success("Added to Notebook")} className="w-full justify-start gap-2 h-9 text-[13px] font-medium shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
            <BookmarkPlus className="h-3.5 w-3.5 text-indigo-200" />
            Add to Notebook
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## File: src/app/components/RetrievalTracePanel.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  ArrowDown,
  Database,
  FileText,
  Search,
  Layers,
  ArrowRight,
  Eye,
  GitCompare,
  RefreshCw,
  ExternalLink,
  BrainCircuit,
  Box,
  Hash
} from 'lucide-react';
import { toast } from "sonner";
import { api, type TraceData } from "../lib/api";

interface MetricProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
}

const MetricItem = ({ label, value, icon: Icon }: MetricProps) => (
  <div className="flex flex-col bg-muted/50 p-3 rounded-lg border border-border/50">
    <div className="flex items-center space-x-2 text-muted-foreground mb-1">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-lg font-semibold">{value}</span>
  </div>
);

const FlowStep = ({ title, icon: Icon, isLast = false }: { title: string, icon: React.ElementType, isLast?: boolean }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary border border-primary/20">
      <Icon className="h-5 w-5" />
    </div>
    <span className="text-xs font-medium mt-2 text-center">{title}</span>
    {!isLast && (
      <div className="h-6 w-px bg-border my-1" />
    )}
  </div>
);

export const RetrievalTracePanel = () => {
  const [trace, setTrace] = useState<TraceData | null>(null);
  const [selectedChunk, setSelectedChunk] = useState<string | null>(null);

  const load = () => {
    api
      .getTrace()
      .then((t) => {
        setTrace(t);
        setSelectedChunk(t.chunks[0]?.id ?? null);
      })
      .catch(() => toast.error("Could not load trace"));
  };

  useEffect(load, []);

  const chunks = trace?.chunks ?? [];
  const selected = chunks.find((c) => c.id === selectedChunk) ?? null;

  return (
    <Card className="w-full h-full flex flex-col rounded-none border-0 shadow-none bg-background">
      <CardHeader className="border-b pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center space-x-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <span>Retrieval Trace</span>
            </CardTitle>
            <CardDescription className="mt-1">
              Internal RAG execution metrics and flow
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          
          {/* Metrics Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center">
              <Database className="h-4 w-4 mr-2 text-muted-foreground" />
              System Metrics
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <MetricItem label="Retrieved Chunks" value={trace?.retrievedChunks ?? 0} icon={Box} />
              <MetricItem label="Documents" value={trace?.documents ?? 0} icon={FileText} />
              <MetricItem label="Avg Similarity" value={(trace?.avgSimilarity ?? 0).toFixed(2)} icon={Hash} />
              <MetricItem label="Embedding Model" value={trace?.embeddingModel || "—"} icon={BrainCircuit} />
              <MetricItem label="Vector Store" value={trace?.vectorStore || "LanceDB"} icon={Database} />
              <MetricItem label="Top K" value={trace?.topK ?? 0} icon={Layers} />
            </div>
          </div>

          {/* Retrieval Flow */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center">
              <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
              Execution Pipeline
            </h3>
            <div className="bg-muted/30 border rounded-lg p-4 flex flex-wrap justify-between items-start">
              <FlowStep title="Query" icon={Search} />
              <FlowStep title="Embedding" icon={BrainCircuit} />
              <FlowStep title="Vector Search" icon={Database} />
              <FlowStep title="Top K" icon={Box} />
              <FlowStep title="Reranking" icon={Layers} />
              <FlowStep title="Context" icon={FileText} isLast={true} />
            </div>
          </div>

          {/* Chunks Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center">
              <Box className="h-4 w-4 mr-2 text-muted-foreground" />
              Top Retrieved Chunks
            </h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chunk ID</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Sim</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                    <TableHead className="text-right">Page</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chunks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                        No retrieval yet — ask a question to populate the trace.
                      </TableCell>
                    </TableRow>
                  )}
                  {chunks.map((chunk) => (
                    <TableRow
                      key={chunk.id}
                      className={`cursor-pointer transition-colors ${selectedChunk === chunk.id ? 'bg-muted/50' : ''}`}
                      onClick={() => setSelectedChunk(chunk.id)}
                    >
                      <TableCell className="font-mono text-xs">{chunk.id}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={chunk.source}>
                        {chunk.source}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={chunk.similarity > 0.9 ? "default" : "secondary"} className="font-mono">
                          {chunk.similarity.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{chunk.tokens}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{chunk.page}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Chunk Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                Chunk Preview
                {selected && (
                  <Badge variant="outline" className="ml-2 font-mono text-xs bg-muted/50">
                    {selected.id}
                  </Badge>
                )}
              </div>
            </h3>
            <div className="bg-muted/30 border rounded-lg p-4 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap">
              <p>{selected?.text ?? "Select a chunk to preview its retrieved text."}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast.success("Chunk opened")}>
                <Box className="h-4 w-4 mr-2" />
                Open Chunk
              </Button>
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast.success("Source viewed")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Source
              </Button>
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast.success("Comparing chunk")}>
                <GitCompare className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>

        </div>
      </ScrollArea>
    </Card>
  );
};

export default RetrievalTracePanel;
```

## File: src/app/components/GenerationSteps.tsx
```typescript
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./ui/utils";

interface Props {
  steps: string[];
  loading: boolean;
  /** ms between step advances while loading. Defaults to 1800. */
  interval?: number;
  className?: string;
}

type StepState = "pending" | "active" | "done";

/**
 * Animated step-progress for AI generation flows.
 * Steps advance on a timer while `loading` is true, then all snap to done.
 */
export function GenerationSteps({ steps, loading, interval = 1800, className }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrent(steps.length);
      return;
    }
    setCurrent(0);
    let idx = 0;
    const tick = setInterval(() => {
      idx += 1;
      // Stop one before the last step — last step completes when loading finishes
      if (idx < steps.length - 1) {
        setCurrent(idx);
      } else {
        clearInterval(tick);
      }
    }, interval);
    return () => clearInterval(tick);
  }, [loading, steps.length, interval]);

  const stateOf = (i: number): StepState => {
    if (!loading) return "done";
    if (i < current) return "done";
    if (i === current) return "active";
    return "pending";
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className={cn("overflow-hidden", className)}
        >
          <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
            <div className="space-y-2">
              {steps.map((label, i) => {
                const state = stateOf(i);
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2.5"
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
                        state === "done" && "text-success",
                        state === "active" && "text-primary",
                        state === "pending" && "text-muted-foreground/30",
                      )}
                    >
                      {state === "done" ? (
                        <CheckCircle2 className="size-4" />
                      ) : state === "active" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-sm transition-colors",
                        state === "done" && "text-foreground",
                        state === "active" && "font-medium text-foreground",
                        state === "pending" && "text-muted-foreground/40",
                      )}
                    >
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## File: src/app/components/MindMapTree.tsx
```typescript
// Renders an indented-text mind map (as produced by the "mindmap" route) into
// a nested tree. Extracted from the Mind Maps page so the Teach Me workspace
// can reuse the exact same rendering.

interface TreeNode {
  id: string;
  label: string;
  depth: number;
  children: TreeNode[];
}

export function parseMindmapText(text: string): TreeNode[] {
  const roots: TreeNode[] = [];
  const stack: TreeNode[] = [];
  let counter = 0;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  for (const raw of lines) {
    if (!raw.trim()) continue;

    const match = raw.match(/^([\s│|]*)(?:[├└+`]?[-─]{2,}\s*)?(.*)$/u);
    const indentRaw = match ? match[1] : "";
    let label = (match ? match[2] : raw).trim();
    label = label.replace(/^[├└│|+`\-─\s]+/u, "").trim();
    if (!label) continue;

    const indentWidth = indentRaw.replace(/\t/g, "    ").length;
    const depth = Math.floor(indentWidth / 4);

    const node: TreeNode = { id: `n${counter++}`, label, depth, children: [] };

    while (stack.length && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }
    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }

  return roots;
}

export function countNodes(nodes: TreeNode[]): number {
  return nodes.reduce((acc, n) => acc + 1 + countNodes(n.children), 0);
}

function TreeBranch({ node }: { node: TreeNode }) {
  const accent =
    node.depth === 0
      ? "border-foreground bg-foreground text-background font-semibold"
      : node.depth === 1
        ? "border-cyan/40 bg-cyan-soft text-cyan"
        : "border-border bg-card text-foreground";

  return (
    <li className="relative">
      <span
        className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[13px] leading-tight ${accent}`}
      >
        {node.label}
      </span>
      {node.children.length > 0 && (
        <ul className="ml-5 mt-1.5 flex flex-col gap-1.5 border-l border-border pl-4">
          {node.children.map((child) => (
            <TreeBranch key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Render an indented-text mind map as a nested tree. */
export function MindMapTree({ text }: { text: string }) {
  const tree = parseMindmapText(text);
  return (
    <ul className="flex flex-col gap-1.5">
      {tree.map((root) => (
        <TreeBranch key={root.id} node={root} />
      ))}
    </ul>
  );
}
```

## File: src/app/components/SourcePanel.tsx
```typescript
import { FileText, ScanLine, Table, Image as ImageIcon, Workflow, Type } from "lucide-react";
import { motion } from "motion/react";
import type { Source, SourceType } from "../lib/types";
import { cn } from "./ui/utils";
import { ScrollArea } from "./ui/scroll-area";

interface SourcePanelProps {
  sources: Source[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}

function scoreColor(score: number) {
  if (score >= 0.9) return "var(--success)";
  if (score >= 0.8) return "var(--cyan)";
  if (score >= 0.7) return "var(--warning)";
  return "var(--muted-foreground)";
}

const TYPE_META: Record<SourceType, { label: string; Icon: typeof Type }> = {
  text: { label: "Text", Icon: Type },
  ocr: { label: "OCR", Icon: ScanLine },
  table: { label: "Table", Icon: Table },
  image: { label: "Image", Icon: ImageIcon },
  diagram: { label: "Diagram", Icon: Workflow },
};

function SourceTypeBadge({ type }: { type: SourceType }) {
  const { label, Icon } = TYPE_META[type] ?? TYPE_META.text;
  return (
    <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Icon className="size-3" />
      {label}
    </span>
  );
}

export function SourcePanel({ sources, activeId, onSelect }: SourcePanelProps) {
  return (
    <div className="flex h-full flex-col border-r border-border bg-card/40">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Sources</span>
        </div>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {sources.length}
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-3">
          {sources.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              Retrieved sources will appear here once you ask a question.
            </p>
          )}
          {sources.map((s, i) => (
            <motion.button
              key={s.id}
              id={`source-${i + 1}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect?.(s.id)}
              className={cn(
                "w-full scroll-mt-4 rounded-lg border p-3 text-left transition-colors",
                activeId === s.id
                  ? "border-primary/60 bg-violet-soft"
                  : "border-border bg-card hover:border-ring/40 hover:bg-accent/40",
              )}
            >
              <div className="flex items-start gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-violet-soft font-mono text-[10px] font-medium text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.title}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <SourceTypeBadge type={s.sourceType ?? "text"} />
                    <span>
                      {s.course} · p.{s.page}
                    </span>
                  </div>
                </div>
              </div>
              {s.imageUrl && (s.sourceType === "image" || s.sourceType === "diagram") && (
                <img
                  src={s.imageUrl}
                  alt={s.snippet}
                  loading="lazy"
                  className="mt-2 max-h-32 w-full rounded-md border border-border object-contain bg-muted/40"
                />
              )}
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {s.snippet}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.similarity * 100}%`,
                      backgroundColor: scoreColor(s.similarity),
                    }}
                  />
                </div>
                <span
                  className="font-mono text-[11px] font-medium"
                  style={{ color: scoreColor(s.similarity) }}
                >
                  {(s.similarity * 100).toFixed(0)}%
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
```

## File: src/app/components/MarkdownRenderer.tsx
```typescript
import { Children, isValidElement, type ReactNode, cloneElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CitationBadge } from "./CitationBadge";
import { DiagramViewer } from "./DiagramViewer";
import { cn } from "./ui/utils";

interface MarkdownRendererProps {
  content: string;
  onCitationClick?: (index: number) => void;
  className?: string;
}

/** 
 * Recursive function to replace [n] tokens inside a React tree with citation badges.
 * This handles nested structures like **text [1]** or *text [2]*.
 */
function withCitations(
  children: ReactNode,
  onCitationClick?: (index: number) => void,
): ReactNode {
  return Children.map(children, (child) => {
    // If it's a string, we perform the regex replacement
    if (typeof child === "string") {
      const parts = child.split(/(\[\d+\])/g);
      return parts.map((part, i) => {
        const m = part.match(/^\[(\d+)\]$/);
        if (m) {
          return (
            <CitationBadge
              key={i}
              index={Number(m[1])}
              onClick={onCitationClick}
            />
          );
        }
        return part;
      });
    }
    
    // If it's a React element, we recurse into its children
    if (isValidElement(child)) {
      const { children: elementChildren } = child.props as { children?: ReactNode };
      if (elementChildren) {
        return cloneElement(child, {
          ...child.props,
          children: withCitations(elementChildren, onCitationClick),
        } as any);
      }
      return child;
    }
    
    return child;
  });
}

export function MarkdownRenderer({
  content,
  onCitationClick,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "markdown-content max-w-none font-reading text-[16.5px] leading-[1.75] text-foreground/90",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-7 first:mt-0 text-xl">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-6 first:mt-0 text-lg">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7">
              {withCitations(children, onCitationClick)}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-1 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-1 list-none space-y-2 [counter-reset:item]">
              {children}
            </ol>
          ),
          li: ({ children }) => {
            return (
              <li className="relative flex gap-3 pl-1 mb-2">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <span className="flex-1">
                  {withCitations(children, onCitationClick)}
                </span>
              </li>
            );
          },
          img: ({ src, alt }) => (
            <figure className="my-4">
              <img
                src={typeof src === "string" ? src : ""}
                alt={alt ?? ""}
                loading="lazy"
                className="mx-auto max-h-[28rem] rounded-lg border border-border object-contain"
              />
              {alt && alt !== "Image" && (
                <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-cyan underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-r-lg border-l-2 border-primary bg-violet-soft/40 py-2 pl-4 pr-3 italic text-foreground/80">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          code: ({ className: cls, children }) => {
            const isBlock = /language-/.test(cls ?? "");
            const language = cls?.replace("language-", "") || "";
            
            if (language === "mermaid") {
              return <DiagramViewer code={String(children).replace(/\n$/, "")} />;
            }

            if (!isBlock) {
              return (
                <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[13px] text-cyan">
                  {children}
                </code>
              );
            }
            
            return (
              <div className="group relative my-4">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground">
                    {language}
                  </div>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4">
                  <code className="font-mono text-[13px] leading-relaxed text-foreground/90">
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          pre: ({ children }) => <>{children}</>, // Handled in code component
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/60">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border px-4 py-2.5 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/60 px-4 py-2.5 text-foreground/80">
              {withCitations(children, onCitationClick)}
            </td>
          ),
          hr: () => <hr className="my-6 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

## File: src/app/components/figma/ImageWithFallback.tsx
```typescript
import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
```

## File: src/app/components/ui/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## File: src/app/components/ui/use-mobile.ts
```typescript
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

## File: src/app/components/ui/toggle.tsx
```typescript
"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
```

## File: src/app/components/ui/textarea.tsx
```typescript
import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
```

## File: src/app/components/ui/tabs.tsx
```typescript
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
```

## File: src/app/components/ui/switch.tsx
```typescript
"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
```

## File: src/app/components/ui/skeleton.tsx
```typescript
import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
```

## File: src/app/components/ui/sheet.tsx
```typescript
"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
```

## File: src/app/components/ui/select.tsx
```typescript
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import { cn } from "./utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
```

## File: src/app/components/ui/resizable.tsx
```typescript
"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "./utils";

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
```

## File: src/app/components/ui/tooltip.tsx
```typescript
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
```

## File: src/app/components/ui/popover.tsx
```typescript
"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "./utils";

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
```

## File: src/app/components/ui/pagination.tsx
```typescript
import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "./utils";
import { Button, buttonVariants } from "./button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
```

## File: src/app/components/ui/navigation-menu.tsx
```typescript
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1",
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
```

## File: src/app/components/ui/radio-group.tsx
```typescript
"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "./utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
```

## File: src/app/components/ui/hover-card.tsx
```typescript
"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "./utils";

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
```

## File: src/app/components/ui/form.tsx
```typescript
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "./utils";
import { Label } from "./label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
```

## File: src/app/components/ui/label.tsx
```typescript
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
```

## File: src/app/components/ui/dialog.tsx
```typescript
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
```

## File: src/app/components/ui/command.tsx
```typescript
"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { cn } from "./utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
```

## File: src/app/components/ui/collapsible.tsx
```typescript
"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
```

## File: src/app/components/ui/drawer.tsx
```typescript
"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "./utils";

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className,
        )}
        {...props}
      >
        <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
```

## File: src/app/components/ui/checkbox.tsx
```typescript
"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
```

## File: src/app/components/ui/table.tsx
```typescript
"use client";

import * as React from "react";

import { cn } from "./utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
```

## File: src/app/components/ui/card.tsx
```typescript
import * as React from "react";

import { cn } from "./utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
```

## File: src/app/components/ui/scroll-area.tsx
```typescript
"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "./utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
```

## File: src/app/components/ui/calendar.tsx
```typescript
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
```

## File: src/app/components/ui/context-menu.tsx
```typescript
"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "./utils";

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
```

## File: src/app/components/ui/separator.tsx
```typescript
"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "./utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
```

## File: src/app/components/ui/input.tsx
```typescript
import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
```

## File: src/app/components/ui/sidebar.tsx
```typescript
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { useIsMobile } from "./use-mobile";
import { cn } from "./utils";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
```

## File: src/app/components/ui/dropdown-menu.tsx
```typescript
"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "./utils";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
```

## File: src/app/components/ui/button.tsx
```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

## File: src/app/components/ui/chart.tsx
```typescript
"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "./utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  }) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div
              key={item.dataKey}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center",
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          },
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center",
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
  }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3",
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
```

## File: src/app/components/ui/breadcrumb.tsx
```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "./utils";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
```

## File: src/app/components/ui/aspect-ratio.tsx
```typescript
"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
```

## File: src/app/components/ui/avatar.tsx
```typescript
"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "./utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
```

## File: src/app/components/ui/alert-dialog.tsx
```typescript
"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
```

## File: src/app/components/ui/menubar.tsx
```typescript
"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "./utils";

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md",
          className,
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
```

## File: src/app/components/ui/accordion.tsx
```typescript
"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
```

## File: src/app/components/ui/input-otp.tsx
```typescript
"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "./utils";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm bg-input-background transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
```

## File: src/app/components/ui/slider.tsx
```typescript
"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
```

## File: src/app/components/ui/carousel.tsx
```typescript
"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
```

## File: src/app/components/ui/toggle-group.tsx
```typescript
"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { toggleVariants } from "./toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
```

## File: src/app/components/ui/progress.tsx
```typescript
"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
```

## File: src/app/components/ui/alert.tsx
```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
```

## File: src/app/components/ui/badge.tsx
```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
```

## File: src/app/components/ui/sonner.tsx
```typescript
"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
```

## File: src/app/components/layout/AppLayout.tsx
```typescript
import { Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "../CommandMenu";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
      <CommandMenu />
    </div>
  );
}
```

## File: src/app/components/layout/AppSidebar.tsx
```typescript
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { GraduationCap, PanelLeftClose, PanelLeft, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { navItems } from "../../lib/nav";
// Removed mock courses import
import { useUIStore } from "../../stores/useUIStore";
import { cn } from "../ui/utils";
import { api } from "../../lib/api";
import type { Course } from "../../lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";

const groupLabels: Record<string, string> = {
  main: "Library",
  workspace: "Workspace",
  study: "Study Tools",
  system: "System",
};

export function AppSidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => {
        if (!cancelled) setCourses(cs);
      })
      .catch(() => { });
    return () => { cancelled = true; };
  }, []);

  const groups = ["main", "workspace", "study", "system"] as const;

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 280 }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className="relative z-20 flex h-full flex-col border-r border-sidebar-border bg-sidebar"
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate font-display text-[17px] font-medium tracking-tight text-foreground">
              ScholarAI
            </div>
            <div className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
              Study Library
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {groups.map((group) => (
          <div key={group} className="mb-5">
            {!collapsed && (
              <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {groupLabels[group]}
              </div>
            )}
            <div className="space-y-1">
              {navItems
                .filter((i) => i.group === group)
                .map((item) => {
                  const link = (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          collapsed && "justify-center px-0",
                          isActive
                            ? "bg-sidebar-accent text-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="active-pill"
                              className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-violet"
                            />
                          )}
                          <item.icon
                            className={cn(
                              "size-[18px] shrink-0",
                              isActive ? "text-violet" : "text-muted-foreground group-hover:text-foreground",
                            )}
                          />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                          {!collapsed && item.shortcut && (
                            <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground group-hover:inline-block">
                              {item.shortcut}
                            </kbd>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                  return collapsed ? (
                    <Tooltip key={item.to} delayDuration={0}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  );
                })}
            </div>
          </div>
        ))}

      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="mb-3 rounded-lg border border-border bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-3.5 text-violet" /> Quick tip
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Press <kbd className="rounded border border-border bg-card px-1 font-mono">⌘K</kbd> to
              search anything instantly.
            </p>
          </div>
        )}
        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? <PanelLeft className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
```

## File: src/app/components/layout/Topbar.tsx
```typescript
import { useLocation } from "react-router";
import { Bell, Command, Plus } from "lucide-react";
import { navItems } from "../../lib/nav";
import { useUIStore } from "../../stores/useUIStore";
import { Button } from "../ui/button";
import { toast } from "sonner";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Your learning at a glance" },
  "/knowledge": {
    title: "Knowledge Explorer",
    subtitle: "Navigate your personal knowledge graph",
  },
  "/documents": {
    title: "Documents",
    subtitle: "Upload and manage source material",
  },
  "/ask": {
    title: "Ask AI",
    subtitle: "Source-grounded answers from your materials",
  },
  "/notebooks": {
    title: "Notebooks",
    subtitle: "Build your personal textbook",
  },
  "/reading": { title: "Reading", subtitle: "Deep reading, enhanced with AI" },
  "/exam": {
    title: "Exam",
    subtitle: "Simulate real exams from your materials",
  },
  "/revision": {
    title: "Revision Mode",
    subtitle: "Generate exam-ready study sheets",
  },
  "/flashcards": { title: "Flashcards", subtitle: "Spaced-repetition review" },
  "/quiz": { title: "Quizzes", subtitle: "Test your understanding" },
  "/diagrams": { title: "Diagrams", subtitle: "Generated visual explanations" },
  "/mindmaps": { title: "Mind Maps", subtitle: "Explore knowledge as a graph" },
  "/search": { title: "Search", subtitle: "Semantic search across everything" },
  "/settings": {
    title: "Settings",
    subtitle: "Configure models and preferences",
  },
};

export function Topbar() {
  const { pathname } = useLocation();
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const meta = titles[pathname] ?? { title: "ScholarAI", subtitle: "" };
  const current = navItems.find((n) => n.to === pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-6 backdrop-blur-xl">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {current && <current.icon className="size-4 text-muted-foreground" />}
          <h2 className="truncate font-sans text-[15px] font-semibold tracking-tight">
            {meta.title}
          </h2>
        </div>
        {meta.subtitle && (
          <p className="truncate text-xs text-muted-foreground">
            {meta.subtitle}
          </p>
        )}
      </div>

      <button
        onClick={() => setCommandOpen(true)}
        className="ml-auto hidden h-9 w-72 items-center gap-2 rounded-lg border border-border bg-input-background px-3 text-sm text-muted-foreground transition-colors hover:border-ring/50 md:flex"
      >
        <Command className="size-4" />
        <span>Search or jump to…</span>
        <kbd className="ml-auto rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <Button variant="ghost" size="icon" className="relative shrink-0">
        <Bell className="size-[18px]" />
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
      </Button>

      <Button
        onClick={() => toast.success("New item created")}
        className="shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="size-4" /> New
      </Button>
    </header>
  );
}
```

## File: src/app/lib/mock-data.ts
```typescript
import type {
  ActivityItem,
  Course,
  Deck,
  DiagramItem,
  DocumentItem,
  Flashcard,
  Quiz,
  Source,
  TopicNode,
} from "./types";

export const courses: Course[] = [
  { id: "c1", name: "Machine Learning", code: "CS 4780", color: "#4f4d7a", documents: 14, flashcards: 212, progress: 72 },
  { id: "c2", name: "Organic Chemistry", code: "CHEM 251", color: "#3f6b6f", documents: 9, flashcards: 168, progress: 54 },
  { id: "c3", name: "Macroeconomics", code: "ECON 202", color: "#3f7a4e", documents: 7, flashcards: 96, progress: 38 },
  { id: "c4", name: "Linear Algebra", code: "MATH 221", color: "#a3771f", documents: 11, flashcards: 140, progress: 61 },
];

export const documents: DocumentItem[] = [
  { id: "d1", title: "Backpropagation & Gradient Descent.pdf", type: "pdf", course: "Machine Learning", sizeKb: 2480, pages: 42, addedAt: "2026-06-21", status: "indexed" },
  { id: "d2", title: "Support Vector Machines — Lecture 9.pdf", type: "pdf", course: "Machine Learning", sizeKb: 1920, pages: 28, addedAt: "2026-06-20", status: "indexed" },
  { id: "d3", title: "Reaction Mechanisms (SN1 / SN2).docx", type: "docx", course: "Organic Chemistry", sizeKb: 880, pages: 16, addedAt: "2026-06-19", status: "indexed" },
  { id: "d4", title: "IS-LM Model Notes.md", type: "markdown", course: "Macroeconomics", sizeKb: 64, pages: 8, addedAt: "2026-06-18", status: "processing" },
  { id: "d5", title: "Eigenvalues & Eigenvectors.pdf", type: "pdf", course: "Linear Algebra", sizeKb: 1340, pages: 22, addedAt: "2026-06-17", status: "indexed" },
  { id: "d6", title: "Transformers Architecture.pdf", type: "pdf", course: "Machine Learning", sizeKb: 3120, pages: 51, addedAt: "2026-06-16", status: "indexed" },
  { id: "d7", title: "Aldol Condensation Summary.txt", type: "text", course: "Organic Chemistry", sizeKb: 22, pages: 4, addedAt: "2026-06-15", status: "failed" },
  { id: "d8", title: "Fiscal vs Monetary Policy.pdf", type: "pdf", course: "Macroeconomics", sizeKb: 980, pages: 14, addedAt: "2026-06-14", status: "indexed" },
];

export const sources: Source[] = [
  { id: "s1", title: "Backpropagation & Gradient Descent.pdf", page: 12, course: "Machine Learning", snippet: "The chain rule lets us decompose the gradient of the loss with respect to each weight by propagating errors backward through the network layers.", similarity: 0.94 },
  { id: "s2", title: "Backpropagation & Gradient Descent.pdf", page: 18, course: "Machine Learning", snippet: "Stochastic gradient descent updates parameters using a noisy estimate of the gradient computed on a mini-batch, trading variance for speed.", similarity: 0.89 },
  { id: "s3", title: "Transformers Architecture.pdf", page: 7, course: "Machine Learning", snippet: "Each weight update is scaled by the learning rate η; too large a value causes divergence while too small slows convergence dramatically.", similarity: 0.81 },
  { id: "s4", title: "SVM — Lecture 9.pdf", page: 3, course: "Machine Learning", snippet: "Optimization seeks the parameters that minimize the objective by following the negative gradient direction iteratively.", similarity: 0.76 },
];

export const sampleAnswer = `Backpropagation is the algorithm used to efficiently compute the **gradient of the loss function** with respect to every weight in a neural network. It is the engine that makes gradient-based training feasible.

## How it works

It applies the **chain rule** of calculus layer by layer, moving *backward* from the output:

1. **Forward pass** — inputs flow through the network producing a prediction and a loss [1].
2. **Backward pass** — the error is propagated backward, computing local gradients at each layer [1].
3. **Update** — weights are nudged in the direction that reduces loss, scaled by the learning rate η [3].

> Intuitively, each weight learns *how much it contributed to the error* and adjusts proportionally.

## The update rule

The core parameter update for gradient descent is:

\`\`\`python
# w: weights, lr: learning rate, grad: dL/dw
w = w - lr * grad
\`\`\`

| Variant | Batch size | Trade-off |
| --- | --- | --- |
| Batch GD | Full dataset | Stable, slow |
| Mini-batch | 32–512 | Best balance [2] |
| SGD | 1 | Noisy, fast |

A learning rate that is **too large** causes divergence, while one that is **too small** slows convergence dramatically [3].`;

export const flashcards: Flashcard[] = [
  { id: "f1", type: "basic", front: "What does backpropagation compute?", back: "The gradient of the loss function with respect to every weight, using the chain rule.", deck: "Neural Networks", due: "Today", ease: "learning" },
  { id: "f2", type: "cloze", front: "Gradient descent updates weights via w = w − {{η}} · ∇L.", back: "η is the learning rate controlling step size.", deck: "Neural Networks", due: "Today", ease: "new" },
  { id: "f3", type: "basic", front: "Difference between SN1 and SN2 reactions?", back: "SN1 is unimolecular (carbocation intermediate, 2 steps); SN2 is bimolecular (concerted backside attack, 1 step).", deck: "Reaction Mechanisms", due: "Tomorrow", ease: "mastered" },
  { id: "f4", type: "basic", front: "What is an eigenvalue?", back: "A scalar λ such that Av = λv for some non-zero vector v.", deck: "Linear Algebra", due: "Today", ease: "learning" },
  { id: "f5", type: "cloze", front: "The {{IS}} curve shows combinations of interest rate and output where the goods market clears.", back: "IS = Investment-Savings equilibrium.", deck: "Macro Models", due: "In 3 days", ease: "new" },
  { id: "f6", type: "basic", front: "What does the softmax function output?", back: "A probability distribution over classes that sums to 1.", deck: "Neural Networks", due: "Today", ease: "mastered" },
];

export const decks: Deck[] = [
  { id: "dk1", name: "Neural Networks", course: "Machine Learning", cards: 64, mastered: 41, color: "#4f4d7a" },
  { id: "dk2", name: "Reaction Mechanisms", course: "Organic Chemistry", cards: 48, mastered: 22, color: "#3f6b6f" },
  { id: "dk3", name: "Linear Algebra", course: "Linear Algebra", cards: 52, mastered: 38, color: "#a3771f" },
  { id: "dk4", name: "Macro Models", course: "Macroeconomics", cards: 30, mastered: 9, color: "#3f7a4e" },
];

export const quizzes: Quiz[] = [
  {
    id: "q1",
    title: "Neural Network Fundamentals",
    course: "Machine Learning",
    difficulty: "Medium",
    questions: [
      { id: "qq1", type: "mcq", prompt: "Which algorithm computes gradients in a neural network?", options: ["Forward propagation", "Backpropagation", "K-means", "PCA"], answer: "Backpropagation", explanation: "Backpropagation applies the chain rule backward through layers to compute gradients." },
      { id: "qq2", type: "truefalse", prompt: "A larger learning rate always speeds up convergence.", options: ["True", "False"], answer: "False", explanation: "Too large a learning rate causes the optimization to diverge." },
      { id: "qq3", type: "mcq", prompt: "What does the softmax function produce?", options: ["A single scalar", "A probability distribution", "A gradient", "A loss value"], answer: "A probability distribution", explanation: "Softmax normalizes logits into probabilities that sum to 1." },
      { id: "qq4", type: "short", prompt: "Name the calculus rule that underpins backpropagation.", answer: "Chain rule", explanation: "The chain rule decomposes gradients across composed functions." },
    ],
  },
  {
    id: "q2",
    title: "Reaction Mechanisms",
    course: "Organic Chemistry",
    difficulty: "Hard",
    questions: [
      { id: "qq5", type: "mcq", prompt: "SN2 reactions proceed via:", options: ["Carbocation intermediate", "Concerted backside attack", "Radical chain", "Electrophilic addition"], answer: "Concerted backside attack", explanation: "SN2 is a one-step bimolecular reaction with backside attack causing inversion." },
      { id: "qq6", type: "truefalse", prompt: "SN1 reactions are favored by tertiary substrates.", options: ["True", "False"], answer: "True", explanation: "Tertiary carbocations are stabilized, favoring the SN1 pathway." },
    ],
  },
];

export const diagrams: DiagramItem[] = [
  {
    id: "dg1",
    title: "Neural Network Training Loop",
    course: "Machine Learning",
    kind: "Flowchart",
    mermaid: `graph TD
  A[Input Batch] --> B[Forward Pass]
  B --> C[Compute Loss]
  C --> D[Backward Pass]
  D --> E[Update Weights]
  E --> F{Converged?}
  F -- No --> A
  F -- Yes --> G[Trained Model]`,
  },
  {
    id: "dg2",
    title: "SN1 vs SN2 Decision",
    course: "Organic Chemistry",
    kind: "Decision Tree",
    mermaid: `graph TD
  A[Substrate] --> B{Degree?}
  B -- Primary --> C[SN2 favored]
  B -- Tertiary --> D[SN1 favored]
  B -- Secondary --> E{Nucleophile strength?}
  E -- Strong --> C
  E -- Weak --> D`,
  },
  {
    id: "dg3",
    title: "IS-LM Equilibrium",
    course: "Macroeconomics",
    kind: "Concept Map",
    mermaid: `graph LR
  A[Interest Rate] --> B[Investment]
  B --> C[Output]
  C --> D[Money Demand]
  D --> A`,
  },
];

export const topicTree: TopicNode[] = [
  {
    id: "t1",
    label: "Machine Learning",
    children: [
      {
        id: "t1a",
        label: "Neural Networks",
        children: [
          { id: "t1a1", label: "Backpropagation", docId: "d1" },
          { id: "t1a2", label: "Activation Functions" },
          { id: "t1a3", label: "Transformers", docId: "d6" },
        ],
      },
      {
        id: "t1b",
        label: "Classical ML",
        children: [
          { id: "t1b1", label: "Support Vector Machines", docId: "d2" },
          { id: "t1b2", label: "Decision Trees" },
        ],
      },
    ],
  },
  {
    id: "t2",
    label: "Organic Chemistry",
    children: [
      {
        id: "t2a",
        label: "Reaction Mechanisms",
        children: [
          { id: "t2a1", label: "SN1 / SN2", docId: "d3" },
          { id: "t2a2", label: "Aldol Condensation", docId: "d7" },
        ],
      },
    ],
  },
  {
    id: "t3",
    label: "Linear Algebra",
    children: [
      { id: "t3a", label: "Eigenvalues & Eigenvectors", docId: "d5" },
      { id: "t3b", label: "Vector Spaces" },
    ],
  },
];

export const activity: ActivityItem[] = [
  { id: "a1", kind: "ask", text: "Asked about backpropagation and the chain rule", time: "12m ago" },
  { id: "a2", kind: "flashcard", text: "Reviewed 24 cards in Neural Networks deck", time: "1h ago" },
  { id: "a3", kind: "quiz", text: "Scored 8/10 on Reaction Mechanisms quiz", time: "3h ago" },
  { id: "a4", kind: "document", text: "Indexed Transformers Architecture.pdf", time: "Yesterday" },
  { id: "a5", kind: "diagram", text: "Generated Neural Network Training Loop diagram", time: "Yesterday" },
];

export const weakTopics = [
  { id: "w1", topic: "Aldol Condensation", course: "Organic Chemistry", mastery: 28 },
  { id: "w2", topic: "IS-LM Model", course: "Macroeconomics", mastery: 35 },
  { id: "w3", topic: "Eigendecomposition", course: "Linear Algebra", mastery: 44 },
  { id: "w4", topic: "Regularization", course: "Machine Learning", mastery: 51 },
];

export const suggestedRevision = [
  { id: "r1", topic: "Backpropagation", reason: "Due for review today", course: "Machine Learning" },
  { id: "r2", topic: "SN1 vs SN2", reason: "Quiz performance dropped 12%", course: "Organic Chemistry" },
  { id: "r3", topic: "Eigenvalues", reason: "8 cards due", course: "Linear Algebra" },
];

export const studyActivityData = [
  { day: "Mon", minutes: 45, cards: 32 },
  { day: "Tue", minutes: 62, cards: 41 },
  { day: "Wed", minutes: 38, cards: 28 },
  { day: "Thu", minutes: 75, cards: 54 },
  { day: "Fri", minutes: 90, cards: 67 },
  { day: "Sat", minutes: 52, cards: 38 },
  { day: "Sun", minutes: 68, cards: 49 },
];

export const recentSessions = [
  { id: "ss1", title: "Deep dive: Attention mechanisms", course: "Machine Learning", duration: "42m", date: "Today" },
  { id: "ss2", title: "Flashcard sprint", course: "Organic Chemistry", duration: "18m", date: "Today" },
  { id: "ss3", title: "Quiz: Macro policy", course: "Macroeconomics", duration: "25m", date: "Yesterday" },
];

export const searchResults = [
  { id: "sr1", group: "Documents", title: "Backpropagation & Gradient Descent.pdf", snippet: "...the <mark>chain rule</mark> lets us decompose the gradient of the loss...", course: "Machine Learning" },
  { id: "sr2", group: "Documents", title: "Transformers Architecture.pdf", snippet: "...self-attention computes weighted sums where the <mark>gradient</mark> flows...", course: "Machine Learning" },
  { id: "sr3", group: "Flashcards", title: "What does backpropagation compute?", snippet: "The <mark>gradient</mark> of the loss function with respect to every weight...", course: "Machine Learning" },
  { id: "sr4", group: "Quizzes", title: "Neural Network Fundamentals", snippet: "Which algorithm computes <mark>gradients</mark> in a neural network?", course: "Machine Learning" },
  { id: "sr5", group: "Diagrams", title: "Neural Network Training Loop", snippet: "Forward pass → Compute loss → Backward pass → Update weights", course: "Machine Learning" },
];
```

## File: src/app/lib/exam-data.ts
```typescript
export interface ExamQuestion {
  id: string;
  type: "mcq" | "truefalse" | "short" | "long";
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  options?: string[];
  answer?: string;
}

export const examQuestions: ExamQuestion[] = [
  { id: "e1", type: "mcq", topic: "Backpropagation", difficulty: "Medium", prompt: "Which rule of calculus underpins the backpropagation algorithm?", options: ["Product rule", "Chain rule", "Quotient rule", "L'Hôpital's rule"], answer: "Chain rule" },
  { id: "e2", type: "truefalse", topic: "Optimization", difficulty: "Easy", prompt: "A larger learning rate always guarantees faster convergence.", options: ["True", "False"], answer: "False" },
  { id: "e3", type: "mcq", topic: "Transformers", difficulty: "Hard", prompt: "Why is the attention score scaled by √dₖ?", options: ["To normalize the output", "To stabilize gradients for large dimensions", "To reduce computation", "To enforce sparsity"], answer: "To stabilize gradients for large dimensions" },
  { id: "e4", type: "short", topic: "Activation Functions", difficulty: "Medium", prompt: "Name one advantage of ReLU over the sigmoid activation." },
  { id: "e5", type: "long", topic: "Transformers", difficulty: "Hard", prompt: "Explain the purpose of self-attention in Transformer architectures and how it differs from recurrence." },
  { id: "e6", type: "mcq", topic: "Backpropagation", difficulty: "Medium", prompt: "What does backpropagation compute?", options: ["The forward pass", "The loss value", "Gradients of the loss w.r.t. weights", "The learning rate"], answer: "Gradients of the loss w.r.t. weights" },
  { id: "e7", type: "truefalse", topic: "Activation Functions", difficulty: "Easy", prompt: "Softmax outputs a probability distribution that sums to 1.", options: ["True", "False"], answer: "True" },
  { id: "e8", type: "mcq", topic: "Optimization", difficulty: "Medium", prompt: "Which optimizer combines momentum with adaptive per-parameter learning rates?", options: ["SGD", "Adam", "RMSProp", "Adagrad"], answer: "Adam" },
];

export const topicPerformance = [
  { topic: "Transformers", score: 95 },
  { topic: "Backpropagation", score: 82 },
  { topic: "Optimization", score: 61 },
  { topic: "Activation Functions", score: 58 },
];

export const difficultyAnalysis = [
  { level: "Easy", correct: 4, total: 4 },
  { level: "Medium", correct: 3, total: 4 },
  { level: "Hard", correct: 1, total: 3 },
];

export const sourceMaterials = [
  "Machine Learning (CS 4780)",
  "Transformers Architecture.pdf",
  "Backpropagation & Gradient Descent.pdf",
  "Lecture Notes — Optimization",
];

export const formulaSheet = [
  { name: "Weight update", formula: "w ← w − η · ∂L/∂w" },
  { name: "Softmax", formula: "σ(z)ᵢ = e^{zᵢ} / Σⱼ e^{zⱼ}" },
  { name: "Cross-entropy", formula: "L = −Σᵢ yᵢ · log(ŷᵢ)" },
  { name: "Attention", formula: "softmax(QKᵀ / √dₖ) · V" },
];
```

## File: src/app/lib/notebook-data.ts
```typescript
import { Brain, FlaskConical, Monitor, Lightbulb, Target } from "lucide-react";

export interface NotebookMeta {
  id: string;
  name: string;
  icon: any;
  notes: number;
  lastEdited: string;
  color: string;
}

export const notebooks: NotebookMeta[] = [
  { id: "nb1", name: "Machine Learning", icon: Brain, notes: 18, lastEdited: "2h ago", color: "#4f4d7a" },
  { id: "nb2", name: "Organic Chemistry", icon: FlaskConical, notes: 12, lastEdited: "Yesterday", color: "#3f6b6f" },
  { id: "nb3", name: "Operating Systems", icon: Monitor, notes: 9, lastEdited: "3d ago", color: "#a3771f" },
  { id: "nb4", name: "Research Ideas", icon: Lightbulb, notes: 24, lastEdited: "1w ago", color: "#3f7a4e" },
  { id: "nb5", name: "Exam Prep", icon: Target, notes: 7, lastEdited: "1w ago", color: "#9f3a36" },
];

export const collections = [
  { id: "col1", name: "Deep Learning", count: 6 },
  { id: "col2", name: "Reaction Kinetics", count: 4 },
  { id: "col3", name: "Concurrency", count: 3 },
];

export const tags = [
  "attention",
  "gradients",
  "backprop",
  "thermodynamics",
  "deadlock",
  "exam-critical",
];

export const recentNotes = [
  { id: "rn1", title: "Transformers", notebook: "Machine Learning" },
  { id: "rn2", title: "SN1 vs SN2 Pathways", notebook: "Organic Chemistry" },
  { id: "rn3", title: "Process Scheduling", notebook: "Operating Systems" },
];

export type NotebookBlock =
  | { type: "heading"; level: 1 | 2; text: string }
  | { type: "text"; text: string }
  | { type: "callout"; tone: "note" | "warning" | "insight"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "ai-answer"; question: string; answer: string; confidence: number; sources: number }
  | { type: "mermaid"; code: string }
  | { type: "flashdeck"; name: string; count: number; cards: { front: string; back: string }[] }
  | { type: "quiz-results"; title: string; score: number; total: number }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface NotebookPage {
  notebookId: string;
  title: string;
  subtitle: string;
  updated: string;
  blocks: NotebookBlock[];
}

export const activeNotebookPage: NotebookPage = {
  notebookId: "nb1",
  title: "Transformers",
  subtitle: "Understanding self-attention and sequence modeling.",
  updated: "Edited 2 hours ago",
  blocks: [
    {
      type: "text",
      text: "Transformers replaced recurrence with **self-attention**, allowing every token to attend to every other token in a sequence in parallel. This is the architecture behind modern large language models.",
    },
    {
      type: "callout",
      tone: "insight",
      text: "Key idea: attention is a learned, content-based weighting over the entire sequence — no fixed window, no recurrence.",
    },
    { type: "heading", level: 2, text: "Self-Attention" },
    {
      type: "text",
      text: "Each token is projected into a Query, Key and Value vector. Attention scores are the scaled dot-products of queries with keys, passed through a softmax, then used to weight the values.",
    },
    {
      type: "code",
      lang: "python",
      code: "scores = (Q @ K.T) / sqrt(d_k)\nweights = softmax(scores, axis=-1)\noutput = weights @ V",
    },
    {
      type: "ai-answer",
      question: "Why do Transformers scale attention by √dₖ?",
      answer:
        "Scaling by **√dₖ** keeps the dot-product magnitudes stable as dimensionality grows. Without it, large dot products push softmax into regions with vanishing gradients, slowing learning [1].",
      confidence: 0.93,
      sources: 3,
    },
    { type: "heading", level: 2, text: "Architecture Overview" },
    {
      type: "mermaid",
      code: `graph TD
  A[Input Embedding] --> B[Positional Encoding]
  B --> C[Multi-Head Attention]
  C --> D[Add & Norm]
  D --> E[Feed Forward]
  E --> F[Add & Norm]
  F --> G[Output]`,
    },
    {
      type: "table",
      headers: ["Component", "Purpose"],
      rows: [
        ["Multi-Head Attention", "Attend to multiple representation subspaces"],
        ["Positional Encoding", "Inject token order information"],
        ["Feed Forward", "Per-token non-linear transformation"],
        ["Residual + LayerNorm", "Stabilize deep training"],
      ],
    },
    {
      type: "flashdeck",
      name: "Transformer Essentials",
      count: 8,
      cards: [
        { front: "What does the Query vector represent?", back: "What a token is looking for in other tokens." },
        { front: "Why multi-head attention?", back: "To capture different relationship types in parallel subspaces." },
        { front: "Role of positional encoding?", back: "Restores sequence order lost by parallel attention." },
      ],
    },
    {
      type: "quiz-results",
      title: "Transformer Fundamentals Quiz",
      score: 9,
      total: 10,
    },
  ],
};

export const inspector = {
  details: { created: "Jun 14, 2026", type: "Concept Note", notebook: "Machine Learning" },
  wordCount: 642,
  readingTime: "3 min",
  linkedSources: [
    "Attention Is All You Need (2017)",
    "Transformers Architecture.pdf",
    "Lecture 11 — Sequence Models",
  ],
  generatedAssets: [
    { label: "AI Answers", count: 1 },
    { label: "Diagrams", count: 1 },
    { label: "Flashcards", count: 8 },
    { label: "Quizzes", count: 1 },
  ],
  citations: 3,
  relatedTopics: ["Attention", "RNNs", "BERT", "Positional Encoding", "Tokenization"],
  revisionStatus: "In progress",
};
```

## File: src/app/lib/reading-data.ts
```typescript
export interface ReadingSection {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
}

export const readingDoc = {
  title: "Deep Learning: Foundations",
  author: "I. Goodfellow, Y. Bengio, A. Courville",
  kind: "Textbook · Chapter 6",
  pages: 42,
  sections: [
    {
      id: "sec1",
      number: "1",
      title: "Introduction",
      paragraphs: [
        "Deep learning is a form of machine learning that enables computers to learn from experience and understand the world in terms of a hierarchy of concepts. Because the computer gathers knowledge from experience, there is no need for a human operator to formally specify all the knowledge the computer needs.",
        "The hierarchy of concepts allows the computer to learn complicated concepts by building them out of simpler ones. If we draw a graph showing how these concepts are built on top of each other, the graph is deep, with many layers. For this reason, we call this approach deep learning.",
      ],
    },
    {
      id: "sec2",
      number: "2",
      title: "Neural Networks",
      paragraphs: [
        "A feedforward neural network defines a mapping y = f(x; θ) and learns the value of the parameters θ that result in the best function approximation. These models are called feedforward because information flows through the function being evaluated from x, through the intermediate computations used to define f, and finally to the output y.",
        "When feedforward neural networks are extended to include feedback connections, they are called recurrent neural networks. The depth of the network gives rise to the terminology used to describe the field.",
      ],
    },
    {
      id: "sec3",
      number: "3",
      title: "Backpropagation",
      paragraphs: [
        "Gradient descent minimizes a differentiable loss function by iteratively moving parameters in the direction of steepest descent. The back-propagation algorithm provides an efficient way to compute the gradient of the loss with respect to every parameter in the network.",
        "Back-propagation refers only to the method for computing the gradient, while another algorithm, such as stochastic gradient descent, is used to perform learning using this gradient. The chain rule of calculus is used to compute the derivatives of functions formed by composing other functions whose derivatives are known.",
      ],
    },
    {
      id: "sec4",
      number: "4",
      title: "Optimization",
      paragraphs: [
        "Optimization for training deep models differs from pure optimization in several ways. Typically the loss function decomposes as a sum over the training examples, and we minimize the expected loss with respect to the data-generating distribution rather than the empirical distribution.",
        "Momentum, adaptive learning rates, and second-order methods are designed to accelerate learning, particularly in the face of high curvature, small but consistent gradients, or noisy gradients.",
      ],
    },
    {
      id: "sec5",
      number: "5",
      title: "Transformers",
      paragraphs: [
        "The Transformer dispenses with recurrence entirely and relies on a self-attention mechanism to draw global dependencies between input and output. This allows for significantly more parallelization and has become the dominant architecture in natural language processing.",
        "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions, capturing a rich set of relationships within the sequence.",
      ],
    },
  ] as ReadingSection[],
};

export const bookmarks = [
  { id: "bm1", section: "Backpropagation", note: "Exam: chain rule derivation" },
  { id: "bm2", section: "Transformers", note: "Self-attention intuition" },
];

export const highlights = [
  { id: "hl1", text: "Gradient descent minimizes a differentiable loss function.", section: "Backpropagation" },
  { id: "hl2", text: "Multi-head attention allows the model to jointly attend…", section: "Transformers" },
  { id: "hl3", text: "The graph is deep, with many layers.", section: "Introduction" },
];

export const lensExplanations: Record<string, string> = {
  Beginner:
    "Think of gradient descent like walking downhill in fog: you feel which way is steepest down and take a small step that way, over and over, until you reach the bottom (the lowest error).",
  Intermediate:
    "Gradient descent updates parameters in the opposite direction of the loss gradient, scaled by a learning rate. Repeating this moves the model toward a local minimum of the loss surface.",
  Expert:
    "For a differentiable loss L(θ), the update θ ← θ − η∇L(θ) follows the steepest-descent direction. Convergence and stability depend on the learning rate η relative to the curvature (Hessian eigenvalues) of L near the optimum.",
};
```

## File: src/app/lib/graph-data.ts
```typescript
import type { Node, Edge } from "@xyflow/react";

// ─── node data shape ────────────────────────────────────────────────────────

export interface ConceptData {
  label: string;
  description: string;
  size: "large" | "medium" | "small";
  refCount: number;
  sourceCount: number;
  cluster: "rag" | "agent" | "infra" | "eval";
}

// ─── nodes ──────────────────────────────────────────────────────────────────

export const conceptNodes: Node<ConceptData>[] = [
  {
    id: "rag",
    type: "concept",
    position: { x: 500, y: 310 },
    data: { label: "RAG", description: "Retrieval-Augmented Generation: grounds LLM answers in retrieved document context.", size: "large", refCount: 42, sourceCount: 11, cluster: "rag" },
  },
  {
    id: "chunking",
    type: "concept",
    position: { x: 200, y: 80 },
    data: { label: "Chunking", description: "Splitting documents into semantically coherent passages before embedding.", size: "medium", refCount: 18, sourceCount: 6, cluster: "rag" },
  },
  {
    id: "embeddings",
    type: "concept",
    position: { x: 600, y: 80 },
    data: { label: "Embeddings", description: "Dense vector representations of text that capture semantic meaning.", size: "medium", refCount: 22, sourceCount: 7, cluster: "rag" },
  },
  {
    id: "langchain",
    type: "concept",
    position: { x: 380, y: 155 },
    data: { label: "LangChain", description: "Orchestration framework for building LLM pipelines and RAG applications.", size: "medium", refCount: 14, sourceCount: 5, cluster: "infra" },
  },
  {
    id: "vector-dbs",
    type: "concept",
    position: { x: 80, y: 240 },
    data: { label: "Vector DBs", description: "Specialized stores for embedding vectors enabling ANN similarity search.", size: "medium", refCount: 16, sourceCount: 6, cluster: "infra" },
  },
  {
    id: "tool-calling",
    type: "concept",
    position: { x: 1030, y: 155 },
    data: { label: "Tool Calling", description: "Structured mechanism for LLMs to invoke external functions and APIs.", size: "medium", refCount: 12, sourceCount: 4, cluster: "agent" },
  },
  {
    id: "hybrid-search",
    type: "concept",
    position: { x: 130, y: 360 },
    data: { label: "Hybrid Search", description: "Combining dense vector similarity with sparse BM25 keyword retrieval.", size: "medium", refCount: 11, sourceCount: 4, cluster: "rag" },
  },
  {
    id: "agent-memory",
    type: "concept",
    position: { x: 850, y: 275 },
    data: { label: "Agent Memory", description: "Persistence mechanisms that let agents retain and recall prior context.", size: "large", refCount: 28, sourceCount: 9, cluster: "agent" },
  },
  {
    id: "mcp",
    type: "concept",
    position: { x: 1110, y: 310 },
    data: { label: "MCP", description: "Model Context Protocol: standardized interface for tool and resource access.", size: "small", refCount: 8, sourceCount: 3, cluster: "agent" },
  },
  {
    id: "re-ranking",
    type: "concept",
    position: { x: 295, y: 455 },
    data: { label: "Re-ranking", description: "Cross-encoder scoring of retrieved passages to improve result precision.", size: "medium", refCount: 9, sourceCount: 3, cluster: "rag" },
  },
  {
    id: "retrieval",
    type: "concept",
    position: { x: 540, y: 475 },
    data: { label: "Retrieval", description: "ANN lookup in a vector store returning the top-K most similar chunks.", size: "large", refCount: 31, sourceCount: 10, cluster: "rag" },
  },
  {
    id: "langgraph",
    type: "concept",
    position: { x: 820, y: 455 },
    data: { label: "LangGraph", description: "Graph-based framework for building stateful, multi-step agent workflows.", size: "medium", refCount: 13, sourceCount: 5, cluster: "agent" },
  },
  {
    id: "context-window",
    type: "concept",
    position: { x: 340, y: 595 },
    data: { label: "Context Window", description: "The finite token budget that constrains how much context an LLM can attend to.", size: "small", refCount: 7, sourceCount: 3, cluster: "infra" },
  },
  {
    id: "evaluation",
    type: "concept",
    position: { x: 610, y: 605 },
    data: { label: "Evaluation", description: "Measuring RAG pipeline quality via faithfulness, relevancy and recall metrics.", size: "medium", refCount: 15, sourceCount: 5, cluster: "eval" },
  },
  {
    id: "prompt-eng",
    type: "concept",
    position: { x: 870, y: 595 },
    data: { label: "Prompt Engineering", description: "Crafting instructions and few-shot examples to guide LLM behaviour.", size: "small", refCount: 6, sourceCount: 3, cluster: "infra" },
  },
];

// ─── edges ──────────────────────────────────────────────────────────────────

const edgeBase = {
  type: "smoothstep",
  style: { stroke: "#c8c2b5", strokeWidth: 1.5 },
  labelStyle: { fontSize: 9, fill: "#79736a", fontFamily: "Inter, sans-serif" },
  labelBgStyle: { fill: "#f6f5f1", fillOpacity: 0.9 },
  labelBgPadding: [3, 2] as [number, number],
  labelBgBorderRadius: 3,
};

export const conceptEdges: Edge[] = [
  { id: "e-chunk-rag", source: "chunking", target: "rag", label: "feeds", ...edgeBase },
  { id: "e-embed-rag", source: "embeddings", target: "rag", label: "feeds", ...edgeBase },
  { id: "e-lc-rag", source: "langchain", target: "rag", label: "implements", ...edgeBase },
  { id: "e-vdb-rag", source: "vector-dbs", target: "rag", label: "stores for", ...edgeBase },
  { id: "e-hs-rag", source: "hybrid-search", target: "rag", label: "improves", ...edgeBase },
  { id: "e-prompt-rag", source: "prompt-eng", target: "rag", label: "influences", ...edgeBase },
  { id: "e-rag-ret", source: "rag", target: "retrieval", label: "uses", ...edgeBase },
  { id: "e-rag-mem", source: "rag", target: "agent-memory", label: "augments", ...edgeBase },
  { id: "e-rag-eval", source: "rag", target: "evaluation", label: "measured by", ...edgeBase },
  { id: "e-chunk-vdb", source: "chunking", target: "vector-dbs", label: "populates", ...edgeBase },
  { id: "e-embed-vdb", source: "embeddings", target: "vector-dbs", label: "indexed in", ...edgeBase },
  { id: "e-vdb-ret", source: "vector-dbs", target: "retrieval", label: "enables", ...edgeBase },
  { id: "e-hs-ret", source: "hybrid-search", target: "retrieval", label: "improves", ...edgeBase },
  { id: "e-ret-rank", source: "retrieval", target: "re-ranking", label: "feeds", ...edgeBase },
  { id: "e-ret-eval", source: "retrieval", target: "evaluation", label: "scored by", ...edgeBase },
  { id: "e-tool-mem", source: "tool-calling", target: "agent-memory", label: "extends", ...edgeBase },
  { id: "e-mcp-tool", source: "mcp", target: "tool-calling", label: "standardizes", ...edgeBase },
  { id: "e-mem-lg", source: "agent-memory", target: "langgraph", label: "managed by", ...edgeBase },
  { id: "e-ctx-rag", source: "context-window", target: "rag", label: "limits", ...edgeBase },
  { id: "e-ctx-mem", source: "context-window", target: "agent-memory", label: "constrains", ...edgeBase },
];

// ─── inspector data ──────────────────────────────────────────────────────────

export interface ConceptInspector {
  id: string;
  name: string;
  confidence: number;
  refCount: number;
  sourceCount: number;
  description: string;
  definition: string;
  aiSummary: string;
  relatedConcepts: string[];
  referencedIn: {
    documents: number;
    notes: number;
    flashcards: number;
    quizzes: number;
    answers: number;
    diagrams: number;
  };
  citations: { source: string; detail: string }[];
}

const inspectorMap: Record<string, ConceptInspector> = {
  "agent-memory": {
    id: "agent-memory",
    name: "Agent Memory",
    confidence: 0.92,
    refCount: 28,
    sourceCount: 7,
    description: "Persistence mechanisms that let agents retain and recall prior context.",
    definition: "Agent memory refers to data structures and storage systems that allow an LLM-based agent to persist information across interactions, recall prior reasoning steps, and build up a growing knowledge state.",
    aiSummary: "Agent memory bridges the gap between the LLM's stateless forward pass and the need for persistent, evolving knowledge. It encompasses short-term (in-context) memory, external storage (vector and key-value), and episodic recall.",
    relatedConcepts: ["State Management", "Long-Term Memory", "Tool Calling", "LangGraph"],
    referencedIn: { documents: 4, notes: 3, flashcards: 12, quizzes: 6, answers: 9, diagrams: 2 },
    citations: [
      { source: "Agent Design Patterns.pdf", detail: "Page 17 — Memory architecture overview" },
      { source: "Agent Memory Guide.md", detail: "Section 3 — Long-term storage strategies" },
      { source: "LangGraph Notes", detail: "Chapter 2 — Stateful agent graphs" },
    ],
  },
  rag: {
    id: "rag",
    name: "RAG",
    confidence: 0.97,
    refCount: 42,
    sourceCount: 11,
    description: "Retrieval-Augmented Generation: grounds LLM answers in retrieved document context.",
    definition: "RAG is an architecture that enhances LLM generation by first retrieving relevant document passages using a vector store, then conditioning the LLM's response on those passages to reduce hallucination.",
    aiSummary: "RAG is the dominant pattern for knowledge-grounded AI assistants. It combines a retrieval index over your documents with an LLM that uses the retrieved context to produce accurate, citable answers.",
    relatedConcepts: ["Chunking", "Embeddings", "Retrieval", "Evaluation", "LangChain"],
    referencedIn: { documents: 7, notes: 6, flashcards: 22, quizzes: 10, answers: 18, diagrams: 5 },
    citations: [
      { source: "RAG Fundamentals.pdf", detail: "Chapter 1 — Architecture overview" },
      { source: "LangChain Docs", detail: "RAG chain implementation" },
      { source: "Backpropagation.pdf", detail: "Related retrieval concepts, p.8" },
    ],
  },
  retrieval: {
    id: "retrieval",
    name: "Retrieval",
    confidence: 0.95,
    refCount: 31,
    sourceCount: 10,
    description: "ANN lookup in a vector store returning the top-K most similar chunks.",
    definition: "Retrieval is the step in a RAG pipeline that queries a vector database with the embedded query to find the K most semantically similar document chunks, which are then passed to the LLM as context.",
    aiSummary: "Retrieval quality is the single largest determinant of RAG answer quality. Improving it through hybrid search, re-ranking and better chunking strategies directly translates to better AI responses.",
    relatedConcepts: ["Chunking", "Embeddings", "Re-ranking", "Hybrid Search", "Vector DBs"],
    referencedIn: { documents: 5, notes: 4, flashcards: 14, quizzes: 7, answers: 12, diagrams: 3 },
    citations: [
      { source: "RAG Fundamentals.pdf", detail: "Chapter 3 — Retrieval strategies" },
      { source: "Vector DB Guide", detail: "ANN search algorithms" },
      { source: "Hybrid Search Paper", detail: "BM25 + dense retrieval comparison" },
    ],
  },
};

export function getInspector(id: string): ConceptInspector {
  if (inspectorMap[id]) return inspectorMap[id];
  const node = conceptNodes.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown concept: ${id}`);
  const d = node.data;
  return {
    id,
    name: d.label,
    confidence: 0.8 + Math.random() * 0.15,
    refCount: d.refCount,
    sourceCount: d.sourceCount,
    description: d.description,
    definition: d.description,
    aiSummary: `${d.label} is a key concept in your knowledge base, referenced across ${d.refCount} artifacts in ${d.sourceCount} source documents.`,
    relatedConcepts: conceptEdges
      .filter((e) => e.source === id || e.target === id)
      .map((e) => {
        const peerId = e.source === id ? e.target : e.source;
        return conceptNodes.find((n) => n.id === peerId)?.data.label ?? peerId;
      })
      .slice(0, 5),
    referencedIn: {
      documents: Math.floor(d.sourceCount * 0.7),
      notes: Math.floor(d.refCount * 0.1),
      flashcards: Math.floor(d.refCount * 0.4),
      quizzes: Math.floor(d.refCount * 0.2),
      answers: Math.floor(d.refCount * 0.3),
      diagrams: Math.max(1, Math.floor(d.refCount * 0.06)),
    },
    citations: [
      { source: `${d.label} — Primary Source.pdf`, detail: "Chapter 1" },
      { source: "Lecture Notes", detail: `${d.label} section` },
    ],
  };
}

// ─── left panel data ─────────────────────────────────────────────────────────

export const explorerCollections = [
  { id: "rag-col", label: "RAG", count: 14 },
  { id: "lc-col", label: "LangChain", count: 8 },
  { id: "lg-col", label: "LangGraph", count: 6 },
  { id: "agent-col", label: "Agent Systems", count: 11 },
  { id: "prompt-col", label: "Prompt Engineering", count: 5 },
  { id: "vdb-col", label: "Vector Databases", count: 7 },
  { id: "mcp-col", label: "MCP", count: 4 },
  { id: "eval-col", label: "Evaluation", count: 6 },
];

export const recentConcepts = [
  "Chunking", "Embeddings", "Hybrid Search", "Agent Memory", "Tool Calling",
];

import { Microscope, Target, TrendingDown, Clock } from "lucide-react";

export const savedViews = [
  { id: "sv1", label: "My Research", icon: Microscope },
  { id: "sv2", label: "Exam Topics", icon: Target },
  { id: "sv3", label: "Weak Areas", icon: TrendingDown },
  { id: "sv4", label: "Recently Added", icon: Clock },
];

export const sourceFilters = [
  "Documents", "Notes", "Answers", "Flashcards", "Quizzes", "Diagrams", "Mind Maps",
];

export const relatedDiscoveries: Record<string, string[]> = {
  "agent-memory": ["Conversation Memory", "Vector Memory", "Knowledge Graph Memory", "Long-Term Memory", "State Management"],
  rag: ["Self-RAG", "Corrective RAG", "Modular RAG", "Graph RAG", "Agentic RAG"],
  retrieval: ["Sparse Retrieval", "Dense Retrieval", "Multi-hop Retrieval", "Iterative Retrieval"],
};
```

## File: src/app/lib/nav.ts
```typescript
import {
  LayoutDashboard,
  Library,
  FileText,
  Sparkles,
  NotebookPen,
  Notebook,
  BookOpen,
  Columns2,
  GraduationCap,
  Layers,
  ListChecks,
  Workflow,
  Network,
  Lightbulb,
  Search,
  FolderOpen,
  Settings,
  BookMarked,
  FileSearch,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  shortcut?: string;
  group: "main" | "workspace" | "study" | "system";
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, shortcut: "D", group: "main" },
  { label: "Knowledge", to: "/knowledge", icon: Library, shortcut: "K", group: "main" },
  { label: "Documents", to: "/documents", icon: FileText, shortcut: "O", group: "main" },
  { label: "Courses", to: "/courses", icon: FolderOpen, shortcut: "C", group: "workspace" },
  { label: "Ask AI", to: "/ask", icon: Sparkles, shortcut: "A", group: "main" },
  { label: "Notebooks", to: "/notebooks", icon: Notebook, shortcut: "N", group: "workspace" },
  { label: "Reading", to: "/reading", icon: BookOpen, shortcut: "E", group: "workspace" },
  { label: "Exam", to: "/exam", icon: GraduationCap, shortcut: "X", group: "workspace" },
  { label: "PYQ Analysis", to: "/exam-analysis", icon: FileSearch, shortcut: "Y", group: "workspace" },
  { label: "Teach Me", to: "/teach", icon: Lightbulb, shortcut: "T", group: "study" },
  { label: "Revision", to: "/revision", icon: NotebookPen, shortcut: "R", group: "study" },
  { label: "Flashcards", to: "/flashcards", icon: Layers, shortcut: "F", group: "study" },
  { label: "Quiz", to: "/quiz", icon: ListChecks, shortcut: "Q", group: "study" },
  { label: "Diagrams", to: "/diagrams", icon: Workflow, shortcut: "G", group: "study" },
  { label: "Mind Maps", to: "/mindmaps", icon: Network, shortcut: "M", group: "study" },
  { label: "Differences", to: "/differences", icon: Columns2, shortcut: "I", group: "study" },
  { label: "Search", to: "/search", icon: Search, shortcut: "S", group: "system" },
  { label: "Prompts", to: "/prompts", icon: BookMarked, shortcut: "P", group: "system" },
  { label: "Settings", to: "/settings", icon: Settings, shortcut: ",", group: "system" },
];
```

## File: src/app/lib/api.ts
```typescript
// Typed HTTP client for the ScholarCLI FastAPI backend.
// In dev, requests go to `/api/*` which Vite proxies to the backend
// (see vite.config.ts). Override with VITE_API_BASE_URL for production.

import type { Course, DiagramItem, DifferenceTableItem, DocumentItem, Flashcard, GeneratedDifference, Quiz, Source, PromptItem } from "./types";

const BASE: string = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

export interface FlashcardSet {
  deck: string;
  course: string | null;
  grounded: boolean;
  cards: Flashcard[];
}

export interface GeneratedQuiz extends Quiz {
  grounded: boolean;
}

export interface GeneratedDiagram extends DiagramItem {
  grounded: boolean;
}

export interface GeneratedMindmap {
  id: string;
  title: string;
  course: string;
  text: string;
  grounded: boolean;
}

export interface GeneratedRevision {
  title: string;
  markdown: string;
  grounded: boolean;
}

// ---- Teach Me ----
export interface TeachOverview {
  title: string;
  markdown: string;
  grounded: boolean;
  sources: Source[];
}

export interface PackageMeta {
  id: string;
  title: string;
  course: string;
  depth: string;
  artifactCount: number;
  createdAt: string;
}

export interface PackageFull {
  id: string;
  title: string;
  course: string;
  depth: string;
  overview: { markdown?: string; grounded?: boolean };
  artifacts: Record<string, any>;
  sources: Source[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  group: string;
  title: string;
  snippet: string;
  course: string;
}

export interface DeckOut {
  id: string;
  name: string;
  course: string;
  color: string;
  cards: number;
  mastered: number;
}

export interface NotebookMeta {
  id: string;
  name: string;
  course: string;
  color: string;
  notes: number;
  lastEdited: string;
}

export interface NotebookFull {
  id: string;
  title: string;
  subtitle: string;
  course: string;
  color: string;
  blocks: any[];
  updated: string;
}

export interface ReadingSection {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
}

export interface ReadingDoc {
  id: string;
  title: string;
  author: string;
  kind: string;
  pages: number;
  sections: ReadingSection[];
  highlights: { id: string; text: string; section: string }[];
  bookmarks: { id: string; section: string; note: string }[];
  progress: number;
}

export interface ExamQuestionOut {
  id: string;
  type: "mcq" | "truefalse" | "short" | "long";
  topic: string;
  difficulty: string;
  prompt: string;
  options?: string[];
  answer?: string;
}

export interface ExamSession {
  sessionId: string;
  questions: ExamQuestionOut[];
  grounded: boolean;
}

export interface ExamResult {
  score: number;
  correct: number;
  total: number;
  topicPerformance: { topic: string; score: number }[];
  difficultyAnalysis: { level: string; correct: number; total: number }[];
  review: { id: string; prompt: string; given: string; expected: string; correct: boolean; topic: string }[];
  recommendedRevisions: string[];
}

// ---- PYQ analysis ----
export interface PyqPaper {
  id: number;
  course: string;
  title: string;
  year: number | null;
  questionCount: number;
  createdAt: string;
}

export interface PyqQuestion {
  id: number;
  text: string;
  topic: string;
  subtopics: string[];
  difficulty: string;
  type: string;
  marks: number | null;
  year: number | null;
}

export interface PyqTopicFreq {
  topic: string;
  occurrences: number;
  frequency: string;
  trend: string;
  importance: number;
  accuracy: number | null;
  styles: string[];
  subtopics: string[];
}

export interface PyqDifferenceSuggestion {
  a: string;
  b: string;
  topic: string;
  count: number;
  example: string;
}

export interface PyqPattern {
  type: string;
  label: string;
  pct: number;
  count: number;
  examples: string[];
}

export interface PyqYearTrend {
  topic: string;
  years: { year: number; count: number }[];
}

export interface PyqRevisionRisk {
  topic: string;
  occurrences: number;
  accuracy: number;
  risk: string;
  score: number;
}

export interface PyqAnalysis {
  course: string;
  papers: number;
  totalQuestions: number;
  yearsLabel: string;
  summary: {
    topicsIdentified?: number;
    recurringTopics?: number;
    questionTypes?: number;
    avgDifficulty?: string;
    coverage?: number;
    readiness?: number;
  };
  topicFrequency: PyqTopicFreq[];
  patterns: PyqPattern[];
  difficulty: { level: string; count: number }[];
  marksDistribution: { marks: number; count: number }[];
  yearTrends: PyqYearTrend[];
  revisionRisk: PyqRevisionRisk[];
  readiness: {
    coverage?: number;
    readiness?: number;
    weakTopics?: string[];
    strongTopics?: string[];
  };
}

export interface KGNode {
  id: string;
  label: string;
  description: string;
  size: "large" | "medium" | "small";
  refCount: number;
  sourceCount: number;
  cluster: string;
}

export interface KGEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface KGGraph {
  nodes: KGNode[];
  edges: KGEdge[];
}

export interface DashboardData {
  metrics: { documents: number; flashcards: number; quizzesTaken: number; studySessions: number };
  studyActivity: { day: string; minutes: number; cards: number }[];
  recentSessions: { id: string; title: string; course: string; duration: string; date: string }[];
  activity: { id: string; kind: string; text: string; time: string }[];
  weakTopics: { id: string; topic: string; course: string; mastery: number }[];
  suggestedRevision: { id: string; topic: string; reason: string; course: string }[];
}

export interface Collection {
  id: string;
  name: string;
  count: number;
}

export interface KGSidebar {
  collections: { id: string; label: string; count: number }[];
  recentConcepts: string[];
  sourceFilters: string[];
}

export interface ConceptInspector {
  id: string;
  name: string;
  confidence: number;
  refCount: number;
  sourceCount: number;
  description: string;
  definition: string;
  aiSummary: string;
  relatedConcepts: string[];
  referencedIn: Record<string, number>;
  citations: { source: string; detail: string }[];
}

export interface AskResponse {
  id: string;
  role: "assistant";
  content: string;
  sources: Source[];
  confidence: number | null;
  grounded: boolean;
  route: string | null;
}

export interface TraceChunk {
  id: string;
  source: string;
  page: number;
  similarity: number;
  tokens: number;
  text: string;
}

export interface TraceData {
  query: string | null;
  route: string | null;
  grounded: boolean;
  embeddingModel: string;
  vectorStore: string;
  topK: number;
  documents: number;
  retrievedChunks: number;
  avgSimilarity: number;
  chunks: TraceChunk[];
}

export interface BackendSettings {
  fastModel: string;
  reasoningModel: string;
  embeddingModel: string;
  visionModel: string;
  temperature: number;
  topK: number;
  similarityThreshold: number;
  streaming: boolean;
  citationsInline: boolean;
  accent: string;
  density: string;
  industry: string;
  role: string;
  goals: string;
  interests: string;
  learningPreferences: string;
}

export interface ModelsList {
  fastModels: string[];
  reasoningModels: string[];
  embeddingModels: string[];
  visionModels: string[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function json(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const api = {
  // ---- Ask / chat ----
  ask(question: string, course?: string | null, document?: string | null): Promise<AskResponse> {
    return request<AskResponse>("/api/ask", json({ question, course: course ?? null, document: document ?? null }));
  },

  /** Stream an answer token-by-token over SSE. Returns the final metadata. */
  async askStream(
    question: string,
    course: string | null | undefined,
    document: string | null | undefined,
    handlers: {
      onToken: (chunk: string) => void;
      onDone?: (meta: { sources: Source[]; confidence: number | null; grounded: boolean }) => void;
      onError?: (message: string) => void;
      signal?: AbortSignal;
    },
  ): Promise<void> {
    const res = await fetch(`${BASE}/api/ask/stream`, {
      ...json({ question, course: course ?? null, document: document ?? null }),
      signal: handlers.signal,
    });
    if (!res.ok || !res.body) {
      handlers.onError?.(`Request failed (${res.status})`);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) >= 0) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const line = raw.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        let evt: any;
        try {
          evt = JSON.parse(line.slice(5).trim());
        } catch {
          continue;
        }
        if (evt.type === "token") handlers.onToken(evt.value);
        else if (evt.type === "done")
          handlers.onDone?.({ sources: evt.sources, confidence: evt.confidence, grounded: evt.grounded });
        else if (evt.type === "error") handlers.onError?.(evt.value);
      }
    }
  },

  // ---- Courses ----
  listCourses(): Promise<Course[]> {
    return request<Course[]>("/api/courses");
  },
  createCourse(name: string): Promise<Course> {
    return request<Course>("/api/courses", json({ name }));
  },
  updateCourse(id: string, name: string): Promise<Course> {
    return request<Course>(`/api/courses/${id}`, json({ name }), { method: "PUT" });
  },
  deleteCourse(id: string): Promise<void> {
    return request<void>(`/api/courses/${id}`, undefined, { method: "DELETE" });
  },

  // ---- Documents ----
  listDocuments(course?: string, search?: string): Promise<DocumentItem[]> {
    const p = new URLSearchParams();
    if (course && course !== "all") p.set("course", course);
    if (search) p.set("search", search);
    const qs = p.toString();
    return request<DocumentItem[]>(`/api/documents${qs ? `?${qs}` : ""}`);
  },
  uploadDocument(file: File, course: string): Promise<DocumentItem> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("course", course);
    return request<DocumentItem>("/api/documents/upload", { method: "POST", body: fd });
  },
  updateDocument(id: string, course: string): Promise<DocumentItem> {
    return request<DocumentItem>(`/api/documents/${id}`, { ...json({ course }), method: "PATCH" });
  },
  deleteDocument(id: string): Promise<void> {
    return request<void>(`/api/documents/${id}`, { method: "DELETE" });
  },

  // ---- Sources / search ----
  searchSources(q: string, course?: string, limit = 5): Promise<Source[]> {
    const p = new URLSearchParams({ q, limit: String(limit) });
    if (course && course !== "all") p.set("course", course);
    return request<Source[]>(`/api/sources/search?${p.toString()}`);
  },

  // ---- Generative study features ----
  generateFlashcards(topic: string, course?: string | null, document?: string | null, count = 8): Promise<FlashcardSet> {
    return request<FlashcardSet>("/api/flashcards/generate", json({ topic, course: course ?? null, document: document ?? null, count }));
  },
  generateQuiz(
    topic: string,
    course?: string | null,
    document?: string | null,
    difficulty: "Easy" | "Medium" | "Hard" = "Medium",
  ): Promise<GeneratedQuiz> {
    return request<GeneratedQuiz>("/api/quizzes/generate", json({ topic, course: course ?? null, document: document ?? null, difficulty }));
  },
  generateDiagram(topic: string, course?: string | null, document?: string | null, type?: string): Promise<GeneratedDiagram> {
    return request<GeneratedDiagram>("/api/diagrams/generate", json({ topic, course: course ?? null, document: document ?? null, type }));
  },
  listDiagrams(): Promise<DiagramItem[]> {
    return request<DiagramItem[]>("/api/diagrams");
  },
  deleteDiagram(id: string): Promise<void> {
    return request<void>(`/api/diagrams/${id}`, { method: "DELETE" });
  },
  generateMindmap(topic: string, course?: string | null, document?: string | null): Promise<GeneratedMindmap> {
    return request<GeneratedMindmap>("/api/mindmaps/generate", json({ topic, course: course ?? null, document: document ?? null }));
  },
  listMindmaps(): Promise<GeneratedMindmap[]> {
    return request<GeneratedMindmap[]>("/api/mindmaps");
  },
  deleteMindmap(id: string): Promise<void> {
    return request<void>(`/api/mindmaps/${id}`, { method: "DELETE" });
  },
  generateRevision(
    opts: { topic?: string; course?: string | null; document?: string | null; format: "notes" | "concepts" | "formulas" | "summary" },
  ): Promise<GeneratedRevision> {
    return request<GeneratedRevision>("/api/revision/generate", json(opts));
  },
  async revisionStream(
    opts: { topic?: string; course?: string | null; document?: string | null; format: "notes" | "concepts" | "formulas" | "summary" },
    handlers: {
      onToken: (chunk: string) => void;
      onDone?: (meta: { grounded: boolean; title: string }) => void;
      onError?: (message: string) => void;
      signal?: AbortSignal;
    },
  ): Promise<void> {
    const res = await fetch(`${BASE}/api/revision/generate/stream`, {
      ...json(opts),
      signal: handlers.signal,
    });
    if (!res.ok || !res.body) {
      handlers.onError?.(`Request failed (${res.status})`);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) >= 0) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const line = raw.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        let evt: any;
        try { evt = JSON.parse(line.slice(5).trim()); } catch { continue; }
        if (evt.type === "token") handlers.onToken(evt.value);
        else if (evt.type === "done") handlers.onDone?.({ grounded: evt.grounded, title: evt.title ?? "" });
        else if (evt.type === "error") handlers.onError?.(evt.value);
      }
    }
  },
  search(q: string, filter = "all"): Promise<SearchResult[]> {
    const p = new URLSearchParams({ q, filter });
    return request<SearchResult[]>(`/api/search?${p.toString()}`);
  },

  // ---- Decks / flashcard persistence ----
  listDecks(): Promise<DeckOut[]> {
    return request<DeckOut[]>("/api/decks");
  },
  saveDeck(name: string, course: string | null, cards: Flashcard[], color?: string): Promise<DeckOut> {
    return request<DeckOut>("/api/decks", json({ name, course, cards, color }));
  },
  deleteDeck(id: string): Promise<void> {
    return request<void>(`/api/decks/${id}`, { method: "DELETE" });
  },
  listSavedFlashcards(deck?: string, course?: string): Promise<Flashcard[]> {
    const p = new URLSearchParams();
    if (deck) p.set("deck", deck);
    if (course) p.set("course", course);
    const qs = p.toString();
    return request<Flashcard[]>(`/api/flashcards${qs ? `?${qs}` : ""}`);
  },
  reviewCard(id: string, ease: "new" | "learning" | "mastered", due?: string): Promise<Flashcard> {
    return request<Flashcard>(`/api/flashcards/${id}`, { ...json({ ease, due }), method: "PUT" });
  },
  deleteCard(id: string): Promise<void> {
    return request<void>(`/api/flashcards/${id}`, { method: "DELETE" });
  },

  // ---- Saved quizzes ----
  listSavedQuizzes(): Promise<Quiz[]> {
    return request<Quiz[]>("/api/quizzes");
  },
  saveQuiz(quiz: { title: string; course?: string | null; difficulty: string; questions: Quiz["questions"] }): Promise<Quiz> {
    return request<Quiz>("/api/quizzes", json(quiz));
  },
  deleteQuiz(id: string): Promise<void> {
    return request<void>(`/api/quizzes/${id}`, { method: "DELETE" });
  },

  // ---- Notebooks ----
  listNotebooks(): Promise<NotebookMeta[]> {
    return request<NotebookMeta[]>("/api/notebooks");
  },
  getNotebook(id: string): Promise<NotebookFull> {
    return request<NotebookFull>(`/api/notebooks/${id}`);
  },
  createNotebook(title: string, course?: string | null): Promise<NotebookFull> {
    return request<NotebookFull>("/api/notebooks", json({ title, course }));
  },
  updateNotebook(id: string, patch: { title?: string; subtitle?: string; blocks?: any[]; color?: string }): Promise<NotebookFull> {
    return request<NotebookFull>(`/api/notebooks/${id}`, { ...json(patch), method: "PUT" });
  },
  deleteNotebook(id: string): Promise<void> {
    return request<void>(`/api/notebooks/${id}`, { method: "DELETE" });
  },
  notebookAssist(action: "explain" | "summarize" | "improve", text: string, course?: string | null): Promise<{ text: string }> {
    return request<{ text: string }>("/api/notebooks/assist", json({ action, text, course }));
  },

  // ---- Reading ----
  getReading(documentId: string): Promise<ReadingDoc> {
    return request<ReadingDoc>(`/api/reading/${documentId}`);
  },
  addHighlight(documentId: string, text: string, section: string): Promise<ReadingDoc> {
    return request<ReadingDoc>(`/api/reading/${documentId}/highlights`, json({ text, section }));
  },
  addBookmark(documentId: string, section: string, note: string): Promise<ReadingDoc> {
    return request<ReadingDoc>(`/api/reading/${documentId}/bookmarks`, json({ section, note }));
  },
  readingLens(documentId: string, text: string, level: string): Promise<{ level: string; text: string }> {
    const p = new URLSearchParams({ text, level });
    return request<{ level: string; text: string }>(`/api/reading/${documentId}/lens?${p.toString()}`);
  },

  // ---- Exam ----
  generateExam(opts: { topic?: string; course?: string | null; document?: string | null; difficulty?: "Easy" | "Medium" | "Hard"; count?: number; types?: string[]; pyqCourse?: string | null }): Promise<ExamSession> {
    return request<ExamSession>("/api/exams/generate", json(opts));
  },
  submitExam(sessionId: string, answers: Record<string, string>, timeSpent?: number): Promise<ExamResult> {
    return request<ExamResult>(`/api/exams/${sessionId}/submit`, json({ answers, timeSpent }));
  },

  // ---- PYQ analysis ----
  uploadPyqPaper(file: File, course: string, year?: number | null): Promise<{ paper: PyqPaper; extracted: number }> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("course", course);
    if (year != null) fd.append("year", String(year));
    return request<{ paper: PyqPaper; extracted: number }>("/api/pyq/papers/upload", { method: "POST", body: fd });
  },
  listPyqPapers(course?: string): Promise<PyqPaper[]> {
    const p = new URLSearchParams();
    if (course && course !== "all") p.set("course", course);
    const qs = p.toString();
    return request<PyqPaper[]>(`/api/pyq/papers${qs ? `?${qs}` : ""}`);
  },
  deletePyqPaper(id: number): Promise<void> {
    return request<void>(`/api/pyq/papers/${id}`, { method: "DELETE" });
  },
  getPyqAnalysis(course: string): Promise<PyqAnalysis> {
    return request<PyqAnalysis>(`/api/pyq/analysis?course=${encodeURIComponent(course)}`);
  },
  listPyqQuestions(course: string, filters?: { year?: number; topic?: string; difficulty?: string; type?: string; q?: string }): Promise<PyqQuestion[]> {
    const p = new URLSearchParams({ course });
    if (filters?.year != null) p.set("year", String(filters.year));
    if (filters?.topic) p.set("topic", filters.topic);
    if (filters?.difficulty) p.set("difficulty", filters.difficulty);
    if (filters?.type) p.set("type", filters.type);
    if (filters?.q) p.set("q", filters.q);
    return request<PyqQuestion[]>(`/api/pyq/questions?${p.toString()}`);
  },
  getPyqDifferenceSuggestions(course: string): Promise<PyqDifferenceSuggestion[]> {
    return request<PyqDifferenceSuggestion[]>(`/api/pyq/difference-suggestions?course=${encodeURIComponent(course)}`);
  },

  // ---- Knowledge graph ----
  buildKnowledgeGraph(course?: string | null, maxDocuments = 8): Promise<{ concepts: number; edges: number }> {
    return request<{ concepts: number; edges: number }>("/api/knowledge/build", json({ course, max_documents: maxDocuments }));
  },
  getKnowledgeGraph(course?: string | null): Promise<KGGraph> {
    const p = new URLSearchParams();
    if (course) p.set("course", course);
    const qs = p.toString();
    return request<KGGraph>(`/api/knowledge-graph${qs ? `?${qs}` : ""}`);
  },
  getConcept(id: string): Promise<ConceptInspector> {
    return request<ConceptInspector>(`/api/concepts/${id}`);
  },
  discoverConcepts(conceptId: string): Promise<string[]> {
    return request<string[]>(`/api/concepts/discover?conceptId=${conceptId}`);
  },

  // ---- Dashboard ----
  getDashboard(): Promise<DashboardData> {
    return request<DashboardData>("/api/dashboard");
  },

  // ---- Notebook side-panels ----
  listNotebookCollections(): Promise<Collection[]> {
    return request<Collection[]>("/api/notebooks/collections");
  },
  listNotebookTags(): Promise<string[]> {
    return request<string[]>("/api/notebooks/tags");
  },

  // ---- Knowledge graph side-panel ----
  getKnowledgeSidebar(course?: string | null): Promise<KGSidebar> {
    const p = new URLSearchParams();
    if (course) p.set("course", course);
    const qs = p.toString();
    return request<KGSidebar>(`/api/knowledge/sidebar${qs ? `?${qs}` : ""}`);
  },

  // ---- Trace ----
  getTrace(): Promise<TraceData> {
    return request<TraceData>("/api/trace/last");
  },

  // ---- Onboarding ----
  onboardingAnalysis(): Promise<{ documents: number; pages: number; topics: string[]; concepts: string[]; sources: number }> {
    return request("/api/onboarding/analysis");
  },

  // ---- Settings / models ----
  getSettings(): Promise<BackendSettings> {
    return request<BackendSettings>("/api/settings");
  },
  updateSettings(patch: Partial<BackendSettings>): Promise<BackendSettings> {
    return request<BackendSettings>("/api/settings", { ...json(patch), method: "PUT" });
  },
  listModels(): Promise<ModelsList> {
    return request<ModelsList>("/api/models/list");
  },
  listPromptCategories(): Promise<Array<{ key: string; label: string; description: string }>> {
    return request("/api/prompts/categories");
  },
  listPrompts(category?: string): Promise<PromptItem[]> {
    const q = category ? `?category=${category}` : "";
    return request<PromptItem[]>(`/api/prompts/${q}`);
  },
  createPrompt(body: { category: string; name: string; style: string; body: string }): Promise<PromptItem> {
    return request<PromptItem>("/api/prompts/", json(body));
  },
  activatePrompt(id: number): Promise<PromptItem> {
    return request<PromptItem>(`/api/prompts/${id}/activate`, { method: "PUT" });
  },
  deletePrompt(id: number): Promise<void> {
    return request<void>(`/api/prompts/${id}`, { method: "DELETE" });
  },
  generateDifference(topic: string, course?: string | null, document?: string | null): Promise<GeneratedDifference> {
    return request<GeneratedDifference>("/api/differences/generate", json({ topic, course: course ?? null, document: document ?? null }));
  },
  getDifferenceSuggestions(): Promise<string[]> {
    return request<string[]>("/api/differences/suggestions");
  },
  listDifferences(): Promise<DifferenceTableItem[]> {
    return request<DifferenceTableItem[]>("/api/differences");
  },
  saveDifference(title: string, content: string, course?: string | null): Promise<DifferenceTableItem> {
    return request<DifferenceTableItem>("/api/differences", json({ title, content, course: course ?? null }));
  },
  deleteDifference(id: number): Promise<void> {
    return request<void>(`/api/differences/${id}`, { method: "DELETE" });
  },

  // ---- Teach Me ----
  generateOverview(topic: string, depth: "quick" | "standard" | "deep" = "standard"): Promise<TeachOverview> {
    return request<TeachOverview>("/api/teach/overview", json({ topic, depth }));
  },
  listPackages(): Promise<PackageMeta[]> {
    return request<PackageMeta[]>("/api/teach/packages");
  },
  getPackage(id: string): Promise<PackageFull> {
    return request<PackageFull>(`/api/teach/packages/${id}`);
  },
  savePackage(pkg: {
    title: string;
    course?: string | null;
    depth: string;
    overview: Record<string, any>;
    artifacts: Record<string, any>;
    sources: Source[];
  }): Promise<PackageFull> {
    return request<PackageFull>("/api/teach/packages", json(pkg));
  },
  deletePackage(id: string): Promise<void> {
    return request<void>(`/api/teach/packages/${id}`, { method: "DELETE" });
  },
};
```

## File: src/app/lib/types.ts
```typescript
export type DocStatus = "indexed" | "processing" | "failed";
export type DocType = "pdf" | "docx" | "markdown" | "text";

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  documents: number;
  flashcards: number;
  progress: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: DocType;
  course: string;
  sizeKb: number;
  pages: number;
  addedAt: string;
  status: DocStatus;
}

export type SourceType = "text" | "ocr" | "table" | "image" | "diagram";

export interface Source {
  id: string;
  title: string;
  page: number;
  course: string;
  snippet: string;
  similarity: number;
  sourceType?: SourceType;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  confidence?: number;
  streaming?: boolean;
}

export interface Flashcard {
  id: string;
  type: "basic" | "cloze";
  front: string;
  back: string;
  deck: string;
  due: string;
  ease: "new" | "learning" | "mastered";
}

export interface Deck {
  id: string;
  name: string;
  course: string;
  cards: number;
  mastered: number;
  color: string;
}

export interface QuizQuestion {
  id: string;
  type: "mcq" | "truefalse" | "short";
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  course: string;
  questions: QuizQuestion[];
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface DiagramItem {
  id: string;
  title: string;
  course: string;
  kind: string;
  mermaid: string;
}

export interface TopicNode {
  id: string;
  label: string;
  children?: TopicNode[];
  docId?: string;
}

export interface ActivityItem {
  id: string;
  kind: "ask" | "flashcard" | "quiz" | "document" | "diagram";
  text: string;
  time: string;
}

export interface PromptItem {
  id: number;
  category: string;
  name: string;
  style: string;
  body: string;
  built_in: boolean;
  active: boolean;
}

export interface GeneratedDifference {
  title: string;
  content: string;
  grounded: boolean;
}

export interface DifferenceTableItem {
  id: number;
  title: string;
  course: string;
  content: string;
  createdAt: string;
}
```

## File: src/app/pages/Trace.tsx
```typescript
import { RetrievalTracePanel } from "../components/RetrievalTracePanel";

export function Trace() {
  return (
    <div className="h-full max-h-screen overflow-hidden p-4">
      <div className="h-full border rounded-lg shadow-sm w-full max-w-3xl mx-auto bg-background">
        <RetrievalTracePanel />
      </div>
    </div>
  );
}
```

## File: src/app/pages/AskAI.tsx
```typescript
import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowUp, Gauge, Paperclip, Sparkles, Trash2, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useChatStore } from "../stores/useChatStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { SourcePanel } from "../components/SourcePanel";
import { AnswerViewer } from "../components/AnswerViewer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";

export function AskAI() {
  const { messages, isStreaming, ask, reset, course, setCourse, document, setDocument } = useChatStore();
  const streaming = useSettingsStore((s) => s.streaming);
  const [input, setInput] = useState("");
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => setCourses([]));
    api.listDocuments().then(setDocuments).catch(() => setDocuments([]));
  }, []);

  const suggestions = useMemo(() => {
    const generic = [
      "Summarize the key concepts across my courses",
      "What are the most important formulas to remember?",
    ];
    if (!documents.length) return generic;

    const dynamic = documents
      .slice(0, 2)
      .map((doc) => `Explain the main topics in ${doc.title}`);

    return [...dynamic, ...generic].slice(0, 4);
  }, [documents]);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const sources = lastAssistant?.sources ?? [];
  const confidence = lastAssistant?.confidence;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (q?: string) => {
    const value = (q ?? input).trim();
    if (!value || isStreaming) return;
    void ask(value, { stream: streaming });
    setInput("");
  };

  const jumpToSource = (index: number) => {
    const target = sources[index - 1];
    if (target) {
      setActiveSource(target.id);
      document
        .getElementById(`source-${index}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex h-full">
      {/* Sources — 25% */}
      <div className="hidden w-[25%] min-w-[260px] max-w-[360px] lg:block">
        <SourcePanel sources={sources} activeId={activeSource} onSelect={setActiveSource} />
      </div>

      {/* Answer — 75% */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Answer header */}
        <div className="flex h-12 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BookOpen className="size-4 text-muted-foreground" />
            Answer
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={course ?? "all"}
              onValueChange={(v) => setCourse(v === "all" ? null : v)}
            >
              <SelectTrigger className="h-8 w-44 bg-input-background text-xs">
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All courses</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={document ?? "all"}
              onValueChange={(v) => setDocument(v === "all" ? null : v)}
            >
              <SelectTrigger className="h-8 w-44 bg-input-background text-xs">
                <SelectValue placeholder="All documents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All documents</SelectItem>
                {documents.filter(d => course ? d.course === course : true).map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {confidence !== undefined && !isStreaming && (
              <Badge
                variant="outline"
                className="gap-1.5 border-success/40 bg-success-soft text-success"
              >
                <Gauge className="size-3.5" />
                {(confidence * 100).toFixed(0)}% confidence
              </Badge>
            )}
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={reset}>
                <Trash2 className="size-3.5" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-6">
            {messages.length === 0 ? (
              <EmptyAsk onPick={submit} suggestions={suggestions} />
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <AnswerViewer key={m.id} message={m} onCitationClick={jumpToSource} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky input */}
        <div className="border-t border-border bg-background/80 px-6 py-4 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 transition-colors focus-within:border-ring/60">
              <Button variant="ghost" size="icon" className="size-9 shrink-0 text-muted-foreground">
                <Paperclip className="size-[18px]" />
              </Button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Ask anything about your materials…"
                className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button
                size="icon"
                disabled={!input.trim() || isStreaming}
                onClick={() => submit()}
                className="size-9 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ArrowUp className="size-[18px]" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-primary" />
                Grounded in {courses.length} courses · {streaming ? "Streaming on" : "Streaming off"}
              </span>
              <span>
                <kbd className="rounded border border-border bg-muted px-1 font-mono">Enter</kbd> to send ·{" "}
                <kbd className="rounded border border-border bg-muted px-1 font-mono">Shift+Enter</kbd> newline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyAsk({ onPick, suggestions }: { onPick: (q: string) => void; suggestions: string[] }) {
  return (
    <div className="flex flex-col items-center pt-12 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-violet"
      >
        <Sparkles className="size-6" />
      </motion.div>
      <h1 className="mt-5">Ask your knowledge base</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Get source-grounded answers with citations, drawn directly from your documents, notes and lectures.
      </p>
      <div className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {suggestions.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-card p-3 text-left text-sm text-foreground/90 transition-colors hover:border-primary/50 hover:bg-violet-soft/40"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
```

## File: src/app/pages/Documents.tsx
```typescript
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  FileType,
  FileCode,
  File,
  CheckCircle2,
  Loader2,
  XCircle,
  Search,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Page } from "../components/Page";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";
import type { Course, DocStatus, DocType, DocumentItem } from "../lib/types";

const typeIcon: Record<DocType, typeof FileText> = {
  pdf: FileText,
  docx: FileType,
  markdown: FileCode,
  text: File,
};

const statusMeta: Record<DocStatus, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  indexed: { label: "Indexed", icon: CheckCircle2, cls: "border-success/40 bg-success-soft text-success" },
  processing: { label: "Processing", icon: Loader2, cls: "border-warning/40 bg-warning-soft text-warning" },
  failed: { label: "Failed", icon: XCircle, cls: "border-danger/40 bg-danger-soft text-danger" },
};

export function Documents() {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const refresh = () => {
    api.listDocuments().then(setDocuments).catch(() => {});
    api.listCourses().then(setCourses).catch(() => {});
  };

  useEffect(refresh, []);

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) &&
      (course === "all" || d.course === course),
  );

  const onUpload = async (file: File) => {
    const target = course !== "all" ? course : courses[0]?.name;
    if (!target) {
      toast.error("Create a course first", {
        description: "Select a course from the filter, then upload.",
      });
      return;
    }
    setUploading(true);
    const t = toast.loading(`Indexing ${file.name}…`);
    try {
      const doc = await api.uploadDocument(file, target);
      toast.success("Document indexed", { id: t, description: doc.title });
      refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error("Upload failed", { id: t, description: msg });
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const onDelete = async (id: string, title: string) => {
    try {
      await api.deleteDocument(id);
      setDocuments((docs) => docs.filter((d) => d.id !== id));
      toast.success("Deleted", { description: title });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error("Delete failed", { description: msg });
    }
  };

  const onUpdateCourse = async (id: string, newCourse: string) => {
    try {
      const updated = await api.updateDocument(id, newCourse);
      setDocuments((docs) => docs.map((d) => (d.id === id ? updated : d)));
      toast.success("Document moved", { description: `Moved to ${newCourse}` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Move failed";
      toast.error("Move failed", { description: msg });
    }
  };

  return (
    <Page className="space-y-5">
      <input
        ref={fileInput}
        type="file"
        accept=".pdf,.md,.markdown,.txt"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onUpload(f);
        }}
      />

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-border bg-card p-8 text-center transition-colors hover:border-primary/50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void onUpload(f);
        }}
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-violet-soft text-primary">
          <Upload className="size-6" />
        </div>
        <h3 className="mt-4">Drop files to upload</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          PDF, Markdown or plain text
          {course !== "all" ? ` · into ${course}` : " · into first course"}
        </p>
        <Button
          className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? "Indexing…" : "Browse files"}
        </Button>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            className="bg-input-background pl-9"
          />
        </div>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-52 bg-input-background">
            <SelectValue placeholder="All courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} documents</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-[1fr_140px_90px_70px_120px_40px] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Name</span>
          <span>Course</span>
          <span>Size</span>
          <span>Pages</span>
          <span>Status</span>
          <span />
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No documents yet. Upload a PDF, Markdown or text file to get started.
          </div>
        )}
        {filtered.map((d, i) => {
          const Icon = typeIcon[d.type] ?? File;
          const status = statusMeta[d.status] ?? statusMeta.indexed;
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[1fr_140px_90px_70px_120px_40px] items-center gap-4 border-b border-border px-5 py-3 last:border-0 hover:bg-accent/30"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm">{d.title}</div>
                  <div className="text-xs uppercase text-muted-foreground">{d.type}</div>
                </div>
              </div>
              <div className="flex min-w-0 items-center pr-2">
                <Select
                  value={d.course}
                  onValueChange={(val) => {
                    if (val !== d.course) void onUpdateCourse(d.id, val);
                  }}
                >
                  <SelectTrigger className="h-8 w-full border-transparent bg-transparent px-2 text-sm text-muted-foreground hover:bg-muted focus:ring-0">
                    <div className="truncate text-left">{d.course}</div>
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-sm text-muted-foreground">
                {d.sizeKb > 1024 ? `${(d.sizeKb / 1024).toFixed(1)} MB` : `${d.sizeKb} KB`}
              </span>
              <span className="text-sm text-muted-foreground">{d.pages}</span>
              <Badge variant="outline" className={`w-fit gap-1.5 ${status.cls}`}>
                <StatusIcon className={`size-3 ${d.status === "processing" ? "animate-spin" : ""}`} />
                {status.label}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  void onDelete(d.id, d.title);
                }}
                className="size-8 text-muted-foreground hover:text-danger"
              >
                <Trash2 className="size-4" />
              </Button>
            </motion.div>
          );
        })}
      </div>
    </Page>
  );
}
```

## File: src/app/pages/Search.tsx
```typescript
import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, FileText, Layers, ListChecks, Workflow, Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Page } from "../components/Page";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { api, type SearchResult } from "../lib/api";
import { cn } from "../components/ui/utils";

const groupIcon: Record<string, typeof FileText> = {
  Documents: FileText,
  Flashcards: Layers,
  Quizzes: ListChecks,
  Diagrams: Workflow,
};

// UI label -> backend filter value. Only "all"/"documents" return data in v1.
const filters: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Documents", value: "documents" },
  { label: "Flashcards", value: "flashcards" },
  { label: "Quizzes", value: "quizzes" },
  { label: "Diagrams", value: "diagrams" },
];

// Filters with no backend data yet — show a "coming soon" empty state.
const unindexedFilters = new Set(["flashcards", "quizzes", "diagrams"]);

const MIN_QUERY_LEN = 2;

// Escape regex metacharacters so user input can't break the highlighter.
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Client-side highlight of query terms in a plain-text snippet.
function highlight(snippet: string, query: string) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .map(escapeRegExp);
  if (terms.length === 0) return snippet;
  const re = new RegExp(`(${terms.join("|")})`, "gi");
  // String.split with a capturing group yields alternating [text, match, text, …],
  // so odd indices are the captured matches.
  const parts = snippet.split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-violet-soft px-1 text-primary">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Guards against out-of-order responses clobbering newer ones.
  const requestId = useRef(0);

  const trimmed = query.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_QUERY_LEN;
  const isUnindexed = unindexedFilters.has(filter);

  useEffect(() => {
    // Don't hit the backend for empty/too-short queries or unindexed filters.
    if (trimmed.length < MIN_QUERY_LEN || isUnindexed) {
      setResults([]);
      setLoading(false);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    const handle = window.setTimeout(() => {
      api
        .search(trimmed, filter)
        .then((data) => {
          if (id !== requestId.current) return; // stale response
          setResults(data);
        })
        .catch((err) => {
          if (id !== requestId.current) return;
          setResults([]);
          toast.error(err instanceof Error ? err.message : "Search failed");
        })
        .finally(() => {
          if (id === requestId.current) setLoading(false);
        });
    }, 300);

    return () => window.clearTimeout(handle);
  }, [trimmed, filter, isUnindexed]);

  const grouped = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      (map[r.group] ??= []).push(r);
    });
    return map;
  }, [results]);

  const hasQuery = trimmed.length >= MIN_QUERY_LEN;

  return (
    <Page className="space-y-5">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Semantic search across all your knowledge…"
          className="h-12 bg-input-background pl-12 text-base"
          autoFocus
        />
        {loading ? (
          <Loader2 className="absolute right-32 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
        <Badge variant="outline" className="absolute right-3 top-1/2 -translate-y-1/2 gap-1 border-primary/40 bg-violet-soft text-primary">
          <Sparkles className="size-3" /> Semantic
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
        {hasQuery && !isUnindexed ? (
          <span className="ml-auto self-center text-sm text-muted-foreground">
            {results.length} results
          </span>
        ) : null}
      </div>

      {/* Unindexed filter (flashcards/quizzes/diagrams) — not yet searchable. */}
      {isUnindexed ? (
        <div className="flex flex-col items-center pt-16 text-center text-muted-foreground">
          <Sparkles className="size-8" />
          <p className="mt-3 text-sm">Coming soon — not yet indexed.</p>
        </div>
      ) : !hasQuery ? (
        // Empty / suggestions state.
        <div className="flex flex-col items-center pt-16 text-center text-muted-foreground">
          <SearchIcon className="size-8" />
          <p className="mt-3 text-sm">
            {tooShort
              ? `Type at least ${MIN_QUERY_LEN} characters to search.`
              : "Search semantically across your indexed documents."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => {
            const Icon = groupIcon[group] ?? FileText;
            return (
              <div key={group}>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Icon className="size-3.5" /> {group}
                </div>
                <div className="space-y-2">
                  {items.map((r, i) => (
                    <motion.button
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="block w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium">{r.title}</span>
                        <Badge variant="outline" className="shrink-0 text-xs text-muted-foreground">
                          {r.course}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {highlight(r.snippet, trimmed)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
          {!loading && results.length === 0 ? (
            <div className="flex flex-col items-center pt-16 text-center text-muted-foreground">
              <SearchIcon className="size-8" />
              <p className="mt-3 text-sm">No results for “{trimmed}”.</p>
            </div>
          ) : null}
        </div>
      )}
    </Page>
  );
}
```

## File: src/app/pages/Reading.tsx
```typescript
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  List,
  Bookmark,
  Highlighter,
  Wand2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Clock,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { SelectionToolbar, type SelectionAction } from "../components/SelectionToolbar";
import { api, type ReadingDoc } from "../lib/api";
import type { DocumentItem } from "../lib/types";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

type Lens = "Beginner" | "Intermediate" | "Expert";

export function Reading() {
  const readerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docId, setDocId] = useState<string | null>(null);

  const [doc, setDoc] = useState<ReadingDoc | null>(null);
  const [docLoading, setDocLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const [lens, setLens] = useState<Lens>("Intermediate");
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [lensLoading, setLensLoading] = useState(false);

  // ---- Load the document list ----
  useEffect(() => {
    let cancelled = false;
    setDocsLoading(true);
    api
      .listDocuments()
      .then((items) => {
        if (cancelled) return;
        setDocuments(items);
        if (items.length > 0) setDocId((cur) => cur ?? items[0].id);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load documents"))
      .finally(() => !cancelled && setDocsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Load the selected reading document ----
  useEffect(() => {
    if (!docId) {
      setDoc(null);
      return;
    }
    let cancelled = false;
    setDocLoading(true);
    setSelected(null);
    setExplanation(null);
    setProgress(0);
    api
      .getReading(docId)
      .then((d) => {
        if (cancelled) return;
        setDoc(d);
        setActiveSection(d.sections[0]?.id ?? null);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load reading"))
      .finally(() => !cancelled && setDocLoading(false));
    return () => {
      cancelled = true;
    };
  }, [docId]);

  // ---- Scroll progress + active section tracking ----
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !doc) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0);
      const sections = doc.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const node = document.getElementById(sections[i].id);
        if (node && node.offsetTop - el.scrollTop <= 160) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [doc]);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const currentSectionTitle = useMemo(() => {
    if (!doc) return "";
    const match = doc.sections.find((s) => s.id === activeSection);
    return match?.title ?? doc.sections[0]?.title ?? "";
  }, [doc, activeSection]);

  // ---- Lens: fetch an adaptive explanation for some text ----
  const runLens = async (text: string, level: Lens) => {
    if (!docId || !text) return;
    setSelected(text);
    setLensLoading(true);
    setExplanation(null);
    try {
      const res = await api.readingLens(docId, text, level);
      setExplanation(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to fetch explanation");
    } finally {
      setLensLoading(false);
    }
  };

  // ---- Selection toolbar actions ----
  const onExplain = (text: string) => {
    setSelectedSection(currentSectionTitle);
    runLens(text, lens);
  };

  const onHighlight = async (text: string) => {
    if (!docId) return;
    try {
      const updated = await api.addHighlight(docId, text, currentSectionTitle);
      setDoc(updated);
      toast.success("Highlight saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add highlight");
    }
  };

  const onBookmark = async (text: string) => {
    if (!docId) return;
    try {
      const updated = await api.addBookmark(docId, currentSectionTitle, text);
      setDoc(updated);
      toast.success("Bookmark saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add bookmark");
    }
  };

  const actions: SelectionAction[] = [
    { label: "Explain", icon: Wand2, onSelect: onExplain },
    { label: "Highlight", icon: Highlighter, onSelect: onHighlight },
    { label: "Bookmark", icon: Bookmark, onSelect: onBookmark },
  ];

  // ---- When the user switches lens with active selection, re-fetch ----
  const pickLens = (l: Lens) => {
    setLens(l);
    if (selected) runLens(selected, l);
  };

  const highlights = doc?.highlights ?? [];
  const bookmarks = doc?.bookmarks ?? [];
  const pages = doc?.pages ?? 0;

  // ---- Empty state: no documents at all ----
  if (!docsLoading && documents.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
          <FileText className="size-6" />
        </div>
        <p className="text-sm font-medium">No documents to read yet</p>
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          Upload and index a document first, then come back here to read it with AI-assisted
          highlights, bookmarks, and explanations.
        </p>
        <Button asChild variant="outline" className="mt-1">
          <Link to="/documents">Go to Documents</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left — Content */}
        <aside className={cn(
          "hidden shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 transition-all duration-300 lg:flex",
          leftCollapsed ? "w-0 border-r-0" : "w-[260px]"
        )}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</span>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setLeftCollapsed(true)}>
              <PanelLeftClose className="size-4" />
            </Button>
          </div>

          {/* Document picker */}
          <div className="border-b border-border p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <FileText className="size-3" /> Document
            </div>
            <Select value={docId ?? undefined} onValueChange={setDocId} disabled={docsLoading}>
              <SelectTrigger className="w-full bg-input-background" size="sm">
                <SelectValue placeholder={docsLoading ? "Loading…" : "Select a document"} />
              </SelectTrigger>
              <SelectContent>
                {documents.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Group label="Outline" icon={List}>
            {(doc?.sections ?? []).map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                  activeSection === s.id ? "bg-accent text-foreground" : "text-foreground/70 hover:bg-accent/50",
                )}
              >
                <span className={cn("font-mono text-xs", activeSection === s.id ? "text-violet" : "text-muted-foreground")}>
                  {s.number}
                </span>
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </Group>

          <Group label="Bookmarks" icon={Bookmark}>
            {bookmarks.length === 0 ? (
              <p className="px-2.5 py-1.5 text-[11px] text-muted-foreground">No bookmarks yet.</p>
            ) : (
              bookmarks.map((b) => (
                <div key={b.id} className="rounded-md px-2.5 py-1.5 hover:bg-accent/50">
                  <div className="text-sm text-foreground/80">{b.section}</div>
                  <div className="text-[11px] text-muted-foreground">{b.note}</div>
                </div>
              ))
            )}
          </Group>

          <Group label="Highlights" icon={Highlighter}>
            {highlights.length === 0 ? (
              <p className="px-2.5 py-1.5 text-[11px] text-muted-foreground">No highlights yet.</p>
            ) : (
              highlights.map((h) => (
                <div key={h.id} className="rounded-md px-2.5 py-1.5 hover:bg-accent/50">
                  <div className="study-mark inline font-reading text-[13px] leading-snug text-foreground/80">
                    {h.text}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{h.section}</div>
                </div>
              ))
            )}
          </Group>
        </aside>

        {/* Center — Reader */}
        <main className="relative min-w-0 flex-1 overflow-y-auto" ref={scrollRef}>
          <SelectionToolbar containerRef={readerRef} actions={actions} />

          {/* Sidebar Toggles */}
          <div className="pointer-events-none absolute left-0 top-4 z-10 flex w-full justify-between px-4">
            <div className="pointer-events-auto">
              {leftCollapsed && (
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-full bg-card/80 backdrop-blur shadow-sm"
                  onClick={() => setLeftCollapsed(false)}
                >
                  <PanelLeftOpen className="size-4" />
                </Button>
              )}
            </div>
            <div className="pointer-events-auto">
              {rightCollapsed && (
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-full bg-card/80 backdrop-blur shadow-sm"
                  onClick={() => setRightCollapsed(false)}
                >
                  <PanelRightOpen className="size-4" />
                </Button>
              )}
            </div>
          </div>

          {docLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : !doc ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select a document to start reading.
            </div>
          ) : (
            <div ref={readerRef} className="mx-auto max-w-[760px] px-8 py-14">
              <div className="border-b border-border pb-8 text-center">
                <Badge variant="outline" className="text-[11px] text-muted-foreground">{doc.kind}</Badge>
                <h1 className="mt-4 text-[2.75rem] leading-[1.1]">{doc.title}</h1>
                {doc.author && <p className="mt-3 text-sm text-muted-foreground">{doc.author}</p>}
              </div>

              {doc.sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-8 pt-12">
                  <div className="mb-4 flex items-baseline gap-3">
                    <span className="font-mono text-sm text-violet">{s.number}</span>
                    <h2 className="text-[1.75rem]">{s.title}</h2>
                  </div>
                  {s.paragraphs.map((p, i) => (
                    <div key={i} className="mb-6 font-book text-[18px] leading-[1.85] text-foreground/85 selection:bg-primary selection:text-primary-foreground">
                      <MarkdownRenderer content={p} />
                    </div>
                  ))}
                </section>
              ))}
              <div className="h-24" />
            </div>
          )}
        </main>

        {/* Right — Context */}
        <aside className={cn(
          "hidden shrink-0 flex-col overflow-y-auto border-l border-border bg-card/40 transition-all duration-300 xl:flex",
          rightCollapsed ? "w-0 border-l-0" : "w-[320px]"
        )}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setRightCollapsed(true)}>
              <PanelRightClose className="size-4" />
            </Button>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Context</span>
            {selected ? (
              <Button variant="ghost" size="icon" className="size-6" onClick={() => { setSelected(null); setExplanation(null); }}>
                <X className="size-3.5" />
              </Button>
            ) : (
              <div className="size-7" />
            )}
          </div>

          {/* Academic Lens */}
          <div className="border-b border-border p-4">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <GraduationCap className="size-3.5" /> Academic Lens
            </div>
            <div className="flex rounded-lg border border-border bg-card p-0.5">
              {(["Beginner", "Intermediate", "Expert"] as Lens[]).map((l) => (
                <button
                  key={l}
                  onClick={() => pickLens(l)}
                  className={cn(
                    "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                    lens === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-5 p-4">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key="ctx"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <Block title="Selected Text">
                    <div className="study-mark inline font-reading text-sm leading-relaxed text-foreground/90">
                      "{selected}"
                    </div>
                    {selectedSection && (
                      <div className="mt-1.5 text-[11px] text-muted-foreground">in {selectedSection}</div>
                    )}
                  </Block>
                  <Block title={`AI Explanation · ${lens}`}>
                    <div className="rounded-lg border border-violet/25 bg-violet-soft/50 p-3">
                      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-violet">
                        <Sparkles className="size-3.5" /> ScholarAI
                      </div>
                      {lensLoading ? (
                        <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                          <Loader2 className="size-3.5 animate-spin" /> Thinking…
                        </div>
                      ) : (
                        <p className="font-reading text-sm leading-relaxed text-foreground/90">
                          {explanation ?? "No explanation available."}
                        </p>
                      )}
                    </div>
                  </Block>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center pt-10 text-center"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
                    <BookOpen className="size-5" />
                  </div>
                  <p className="mt-3 text-sm font-medium">Highlight to learn</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Select any passage in the reader and choose "Explain" to get an AI explanation tuned to your chosen lens.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>

      {/* Bottom — Reading progress */}
      <div className="flex h-12 shrink-0 items-center gap-6 border-t border-border bg-card/60 px-6 text-xs text-muted-foreground backdrop-blur">
        <span className="flex items-center gap-1.5">
          <BookOpen className="size-3.5" /> Page {Math.max(1, Math.round((progress / 100) * pages))} of {Math.max(1, pages)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" /> ~{Math.max(1, pages - Math.round((progress / 100) * pages))} min left
        </span>
        <span className="flex items-center gap-1.5">
          <Highlighter className="size-3.5" /> {highlights.length} highlights
        </span>
        <span className="flex items-center gap-1.5">
          <Bookmark className="size-3.5" /> {bookmarks.length} bookmarks
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-medium text-foreground">{progress}%</span>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-violet transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ label, icon: Icon, children }: { label: string; icon: typeof List; children: React.ReactNode }) {
  return (
    <div className="border-b border-border p-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}
```

## File: src/app/pages/Dashboard.tsx
```typescript
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Layers,
  ListChecks,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
} from "recharts";
import { Page, SectionTitle } from "../components/Page";
import { MetricCard } from "../components/MetricCard";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import type { DashboardData } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";

const activityIcon: Record<string, typeof FileText> = {
  ask: Sparkles,
  flashcard: Layers,
  quiz: ListChecks,
  document: FileText,
  diagram: TrendingUp,
};

export function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    api
      .listCourses()
      .then(setCourses)
      .catch(() => { });
    api
      .listDocuments()
      .then(setDocuments)
      .catch(() => { });
    api
      .getDashboard()
      .then(setDashboard)
      .catch(() => { });
  }, []);

  const metrics = dashboard?.metrics;
  const studyActivity = dashboard?.studyActivity ?? [];
  const recentSessions = dashboard?.recentSessions ?? [];
  const activity = dashboard?.activity ?? [];

  return (
    <Page className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6"
      >
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Flame className="size-3.5 text-warning" /> 7-day study streak
          </div>
          <h1 className="mt-3 text-[2.5rem] leading-none">
            Good evening, Student.
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
            You have <span className="text-foreground">12 cards due</span> and{" "}
            <span className="text-foreground">2 weak topics</span> to revisit
            today. Pick up where you left off.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/ask")}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="size-4" /> Ask AI
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/flashcards")}
            className="gap-2"
          >
            <Layers className="size-4" /> Review cards
          </Button>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Documents"
          value={metrics?.documents ?? documents.length}
          icon={FileText}
          accent="#8b5cf6"
          hint={`${courses.length} courses`}
        />
        <MetricCard
          label="Flashcards"
          value={metrics?.flashcards ?? 0}
          icon={Layers}
          accent="#06b6d4"
          hint="across all decks"
        />
        <MetricCard
          label="Quizzes taken"
          value={metrics?.quizzesTaken ?? 0}
          icon={ListChecks}
          accent="#22c55e"
        />
        <MetricCard
          label="Study sessions"
          value={metrics?.studySessions ?? 0}
          icon={Clock}
          accent="#f59e0b"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Study activity */}
          <div>
            <SectionTitle title="Study activity" />
            <div className="rounded-2xl border border-border bg-card p-5">
              {studyActivity.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                  No study activity yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={208}>
                  <AreaChart
                    data={studyActivity}
                    margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="grad-minutes"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="grad-cards"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#06b6d4"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#06b6d4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      stroke="currentColor"
                      className="text-muted-foreground"
                    />
                    <RTooltip
                      cursor={{ stroke: "var(--border)" }}
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      name="Minutes"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#grad-minutes)"
                    />
                    <Area
                      type="monotone"
                      dataKey="cards"
                      name="Cards"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fill="url(#grad-cards)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent documents */}
          <div>
            <SectionTitle
              title="Recent documents"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => navigate("/documents")}
                >
                  View all <ArrowRight className="size-3" />
                </Button>
              }
            />
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {documents.slice(0, 4).map((d, i) => (
                <div
                  key={d.id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-accent/40 ${i !== 0 ? "border-t border-border" : ""
                    }`}
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{d.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.course} · {d.pages} pages
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {d.addedAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Courses */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionTitle
              title="Courses"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-0 text-xs hover:bg-transparent"
                  onClick={() => navigate("/knowledge")}
                >
                  <ArrowRight className="size-4" />
                </Button>
              }
            />
            <div className="space-y-3">
              {courses.map((c) => (
                <motion.div
                  key={c.id}
                  whileHover={{ x: 2 }}
                  className="group flex cursor-pointer items-center gap-3"
                  onClick={() => navigate("/knowledge")}
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg font-semibold text-xs transition-colors group-hover:bg-opacity-30"
                    style={{ backgroundColor: `${c.color}15`, color: c.color }}
                  >
                    {c.code.split(" ")[0].slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium leading-none">
                      {c.name}
                    </div>
                    <div className="mt-1 flex gap-2 text-[11px] text-muted-foreground">
                      <span>{c.documents} docs</span>
                      <span className="opacity-40">•</span>
                      <span>{c.flashcards} cards</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent sessions */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionTitle title="Recent sessions" />
            <div className="space-y-2">
              {recentSessions.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No sessions yet
                </p>
              ) : (
                recentSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/40"
                  >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-soft text-cyan">
                      <Clock className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">{s.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.course}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{s.duration}</div>
                      <div>{s.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionTitle title="Activity" />
            <div className="space-y-1">
              {activity.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No activity yet
                </p>
              ) : (
                activity.map((a) => {
                  const Icon = activityIcon[a.kind] ?? Sparkles;
                  return (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent/40"
                    >
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm leading-snug">{a.text}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.time}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
```

## File: src/app/pages/Revision.tsx
```typescript
import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  NotebookPen,
  FileText,
  Sigma,
  ListTree,
  Download,
  Loader2,
  AlertTriangle,
  Clock,
  Bookmark,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { api } from "../lib/api";
import {
  useRevisionStore,
  type RevisionFormat,
} from "../stores/useRevisionStore";
import type { Course, DocumentItem } from "../lib/types";
import { cn } from "../components/ui/utils";

const formats: {
  id: RevisionFormat;
  label: string;
  icon: typeof NotebookPen;
}[] = [
    { id: "notes", label: "Exam Notes", icon: NotebookPen },
    { id: "concepts", label: "Key Concepts", icon: ListTree },
    { id: "formulas", label: "Formula Sheet", icon: Sigma },
    { id: "summary", label: "Summary Sheet", icon: FileText },
  ];

export function Revision() {
  const {
    format,
    topic,
    course,
    loading,
    output,
    title,
    ungrounded,
    savedRevisions,
    setField,
    generate,
    stop,
    loadRevision,
  } = useRevisionStore();
  const setFormat = (f: RevisionFormat) => setField("format", f);
  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const document = useRevisionStore((s) => s.document);
  const setDocument = (v: string | null) => setField("document", v);

  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => {
        if (!cancelled) setCourses(cs);
      })
      .catch(() => { });
    api
      .listDocuments()
      .then((docs) => {
        if (!cancelled) setDocuments(docs);
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, []);

  const suggestedRevision = useMemo(() => {
    if (!documents.length) return [];

    return documents.slice(0, 3).map((doc, i) => ({
      id: `sr-d${i}`,
      topic: doc.title.replace(/\.[^/.]+$/, ""),
      reason: i === 0 ? "Due for review today" : "Upcoming exam",
      course: doc.course,
    }));
  }, [documents]);

  const pickTopic = (value: string) => {
    setTopic(value);
    toast.success(`Topic set to "${value}"`);
  };

  return (
    <div className="flex h-full">
      {/* Generator */}
      <div className="w-96 shrink-0 overflow-y-auto border-r border-border bg-card/40 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3>Generator</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn your materials into exam-ready study resources.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <Label className="mb-2 block">Format</Label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors",
                    format === f.id
                      ? "border-primary bg-violet-soft"
                      : "border-border bg-card hover:border-ring/40",
                  )}
                >
                  <f.icon
                    className={cn(
                      "size-4",
                      format === f.id
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Topic</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) generate();
              }}
              placeholder="e.g. Backpropagation (optional)"
              className="bg-input-background"
            />
          </div>

          <div>
            <Label className="mb-2 block">Course</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="No course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No course</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={document ?? "all"} onValueChange={(v) => setDocument(v === "all" ? null : v)}>
              <SelectTrigger className="mt-2 bg-input-background">
                <SelectValue placeholder="All documents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All documents</SelectItem>
                {documents.filter(d => course !== "none" ? d.course === course : true).map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Provide at least a topic or a course.
            </p>
          </div>

          <Button
            onClick={loading ? stop : generate}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "Stop" : "Generate"}
          </Button>
        </div>

        {/* Quick picks */}
        {suggestedRevision.length > 0 && (
          <div className="mt-8 space-y-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Clock className="size-3.5 text-muted-foreground" />
                <Label>Suggested revision</Label>
              </div>
              <div className="space-y-2">
                {suggestedRevision.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => pickTopic(r.topic)}
                    className="flex w-full flex-col items-start gap-0.5 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-ring/40"
                  >
                    <span className="text-sm font-medium">{r.topic}</span>
                    <span className="text-xs text-muted-foreground">
                      {r.reason}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                      {r.course}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Saved revisions */}
        {savedRevisions.length > 0 && (
          <div className="mt-8 space-y-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Bookmark className="size-3.5 text-muted-foreground" />
                <Label>Saved revisions</Label>
              </div>
              <div className="space-y-2">
                {savedRevisions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => loadRevision(r.id)}
                    className="flex w-full flex-col items-start gap-0.5 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-ring/40"
                  >
                    <span className="text-sm font-medium truncate w-full">
                      {r.title}
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {r.content.replace(/[#*]/g, "").trim()}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 mt-1">
                      {new Date(r.timestamp).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          <span className="text-sm font-medium">{title ?? "Preview"}</span>
          {output && (
            <div className="flex gap-2">
              {/* <Button variant="outline" size="sm" className="gap-1.5" onClick={saveRevision}> */}
              {/*   <Bookmark className="size-3.5" /> Save */}
              {/* </Button> */}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  if (!output) return;
                  const blob = new Blob([output], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${(title || "revision").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  toast.success("Exported as markdown");
                }}
              >
                <Download className="size-3.5" /> Export
              </Button>
            </div>
          )}
        </div>
        <div className="mx-auto max-w-3xl px-8 py-8">
          {output ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {!loading && ungrounded && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    This topic may not be covered by your uploaded documents —
                    the result below may be incomplete or based on general
                    knowledge.
                  </span>
                </div>
              )}
              <MarkdownRenderer content={output} />
              {loading && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
              )}
            </motion.div>
          ) : loading ? (
            <div className="flex flex-col items-center pt-24 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="mt-3 text-sm">Retrieving sources…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center pt-24 text-center text-muted-foreground">
              <Sparkles className="size-6 text-primary/60" />
              <p className="mt-3 text-sm">
                Choose a format, enter a topic or course, then generate a study
                sheet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## File: src/app/pages/Quiz.tsx
```typescript
import { useEffect, useState } from "react";
import {
  ListChecks,
  Play,
  ChevronRight,
  Check,
  X,
  RotateCw,
  Trophy,
  Settings2,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Page } from "../components/Page";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";
import type { Quiz, QuizQuestion, Course, DocumentItem } from "../lib/types";
import { cn } from "../components/ui/utils";
import { useQuizStore } from "../stores/useQuizStore";
import type { Difficulty } from "../stores/useQuizStore";

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

const diffColor: Record<Quiz["difficulty"], string> = {
  Easy: "border-success/40 bg-success-soft text-success",
  Medium: "border-warning/40 bg-warning-soft text-warning",
  Hard: "border-danger/40 bg-danger-soft text-danger",
};

export function QuizPage() {
  // Flow state lives in the store so it survives page navigation.
  const stage = useQuizStore((s) => s.stage);
  const active = useQuizStore((s) => s.active);
  const answers = useQuizStore((s) => s.answers);
  const start = useQuizStore((s) => s.start);
  const submit = useQuizStore((s) => s.submit);
  const backToBuilder = useQuizStore((s) => s.backToBuilder);

  // Page-only ephemeral data that's cheap to refetch stays local.
  const [saved, setSaved] = useState<Quiz[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [saving, setSaving] = useState(false);

  const refreshSaved = () =>
    api
      .listSavedQuizzes()
      .then(setSaved)
      .catch(() => setSaved([]))
      .finally(() => setLoadingSaved(false));

  useEffect(() => {
    refreshSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveQuiz = async (quiz: Quiz) => {
    if (saving) return;
    setSaving(true);
    try {
      await api.saveQuiz({
        title: quiz.title,
        course: quiz.course && quiz.course !== "all" ? quiz.course : null,
        difficulty: quiz.difficulty,
        questions: quiz.questions,
      });
      await refreshSaved();
      toast.success("Quiz saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      await api.deleteQuiz(id);
      setSaved((s) => s.filter((q) => q.id !== id));
      toast.success("Quiz deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete quiz");
    }
  };

  return (
    <Page className="space-y-6">
      {stage === "builder" && (
        <Builder
          onStart={start}
          saved={saved}
          loadingSaved={loadingSaved}
          onDelete={deleteQuiz}
        />
      )}
      {stage === "player" && active && (
        <Player
          quiz={active}
          onFinish={(a) => submit(a)}
          onSave={() => saveQuiz(active)}
          saving={saving}
        />
      )}
      {stage === "results" && active && (
        <Results
          quiz={active}
          answers={answers}
          onRetry={() => start(active)}
          onBack={backToBuilder}
          onSave={() => saveQuiz(active)}
          saving={saving}
        />
      )}
    </Page>
  );
}

function Builder({
  onStart,
  saved,
  loadingSaved,
  onDelete,
}: {
  onStart: (q: Quiz) => void;
  saved: Quiz[];
  loadingSaved: boolean;
  onDelete: (id: string) => void;
}) {
  // Builder inputs + the in-flight generation flag live in the store so the
  // selections survive navigation and a running generation keeps going.
  const topic = useQuizStore((s) => s.topic);
  const course = useQuizStore((s) => s.course);
  const document = useQuizStore((s) => s.document);
  const difficulty = useQuizStore((s) => s.difficulty);
  const loading = useQuizStore((s) => s.generating);
  const setField = useQuizStore((s) => s.setField);
  const generate = useQuizStore((s) => s.generate);

  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const setDocument = (v: string | null) => setField("document", v);
  const setDifficulty = (v: Difficulty) => setField("difficulty", v);

  // Course list is cheap to refetch — keep it local.
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => setCourses([]));
    api.listDocuments().then(setDocuments).catch(() => setDocuments([]));
  }, []);

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Settings2 className="size-4 text-primary" />
          <h3>Quiz builder</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate a quiz from your materials or pick a saved one below.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-48">
            <label className="mb-1.5 block text-xs text-muted-foreground">Topic</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") generate();
              }}
              placeholder="e.g. Neural networks"
              className="bg-input-background"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">Course</label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="w-44 bg-input-background">
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All courses</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">Document</label>
            <Select value={document ?? "all"} onValueChange={(v) => setDocument(v === "all" ? null : v)}>
              <SelectTrigger className="w-44 bg-input-background">
                <SelectValue placeholder="All documents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All documents</SelectItem>
                {documents.filter(d => course !== "all" ? d.course === course : true).map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <Badge
                  key={d}
                  variant="outline"
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "cursor-pointer py-1.5",
                    difficulty === d
                      ? diffColor[d]
                      : "border-border text-muted-foreground hover:border-ring/40",
                  )}
                >
                  {d}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            onClick={generate}
            disabled={loading || !topic.trim()}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <ListChecks className="size-4" /> Generate quiz
              </>
            )}
          </Button>
        </div>
        <GenerationSteps
          steps={["Searching your library", "Selecting relevant sources", "Writing questions", "Validating answers"]}
          loading={loading}
          className="mt-4"
        />
      </div>

      {loadingSaved ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading saved quizzes…
        </div>
      ) : saved.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-violet-soft text-primary">
            <ListChecks className="size-5" />
          </div>
          <h4 className="mt-3">No saved quizzes yet</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate a quiz above and save it to find it here later.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {saved.map((q) => (
            <motion.div key={q.id} whileHover={{ y: -2 }} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-violet-soft text-primary">
                  <ListChecks className="size-5" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={diffColor[q.difficulty]}>
                    {q.difficulty}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(q.id)}
                    aria-label="Delete quiz"
                    className="size-8 text-muted-foreground hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <h4 className="mt-3">{q.title}</h4>
              <div className="mt-1 text-sm text-muted-foreground">{q.course}</div>
              <div className="mt-1 text-xs text-muted-foreground">{q.questions.length} questions</div>
              <Button onClick={() => onStart(q)} className="mt-4 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="size-4" /> Start quiz
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

function Player({
  quiz,
  onFinish,
  onSave,
  saving,
}: {
  quiz: Quiz;
  onFinish: (a: Record<string, string>) => void;
  onSave: () => void;
  saving: boolean;
}) {
  // Position + answers live in the store so they survive navigation.
  const idx = useQuizStore((s) => s.idx);
  const answers = useQuizStore((s) => s.answers);
  const goTo = useQuizStore((s) => s.goTo);
  const answer = useQuizStore((s) => s.answer);
  const q = quiz.questions[idx];
  const progress = ((idx + 1) / quiz.questions.length) * 100;
  const selected = answers[q.id];

  const choose = (value: string) => answer(q.id, value);

  const advance = () => {
    if (idx === quiz.questions.length - 1) {
      onFinish(answers);
    } else {
      goTo(idx + 1);
    }
  };

  const canAdvance =
    q.type === "short" ? (selected ?? "").trim().length > 0 : !!selected;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <Progress value={progress} className="h-1.5 flex-1" />
        <span className="text-xs text-muted-foreground">
          {idx + 1} / {quiz.questions.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="gap-1.5"
        >
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Save quiz
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <Badge variant="outline" className="text-[10px] uppercase">
            {q.type === "mcq" ? "Multiple choice" : q.type === "truefalse" ? "True / False" : "Short answer"}
          </Badge>
          <h3 className="mt-3 text-lg leading-relaxed">{q.prompt}</h3>

          <div className="mt-5 space-y-2">
            {q.type === "short" ? (
              <Input
                value={selected ?? ""}
                onChange={(e) => answer(q.id, e.target.value)}
                placeholder="Type your answer…"
                className="bg-input-background"
              />
            ) : (
              q.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors",
                    selected === opt
                      ? "border-primary bg-violet-soft"
                      : "border-border bg-background/40 hover:border-ring/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border text-[10px]",
                      selected === opt ? "border-primary bg-primary text-white" : "border-border",
                    )}
                  >
                    {selected === opt && <Check className="size-3" />}
                  </span>
                  {opt}
                </button>
              ))
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex justify-end">
        <Button
          onClick={advance}
          disabled={!canAdvance}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {idx === quiz.questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function Results({
  quiz,
  answers,
  onRetry,
  onBack,
  onSave,
  saving,
}: {
  quiz: Quiz;
  answers: Record<string, string>;
  onRetry: () => void;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const correct = quiz.questions.filter(
    (q) => answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase(),
  ).length;
  const total = quiz.questions.length;
  const pct = Math.round((correct / total) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-card p-8 text-center"
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl border border-border bg-card text-violet">
          <Trophy className="size-7" />
        </div>
        <h1 className="mt-4 text-4xl font-semibold">{pct}%</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You answered {correct} of {total} correctly
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" onClick={onBack}>Back to quizzes</Button>
          <Button variant="outline" onClick={onSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save quiz
          </Button>
          <Button onClick={onRetry} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <RotateCw className="size-4" /> Retry
          </Button>
        </div>
      </motion.div>

      <div className="space-y-3">
        {quiz.questions.map((q: QuizQuestion, i) => {
          const userAns = answers[q.id] ?? "—";
          const isCorrect = userAns.trim().toLowerCase() === q.answer.toLowerCase();
          return (
            <div key={q.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full",
                    isCorrect ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
                  )}
                >
                  {isCorrect ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {i + 1}. {q.prompt}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Your answer: <span className={isCorrect ? "text-success" : "text-danger"}>{userAns}</span>
                    {!isCorrect && <> · Correct: <span className="text-success">{q.answer}</span></>}
                  </div>
                  {q.explanation.trim() && (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{q.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## File: src/app/pages/Exam.tsx
```typescript
import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  FileStack,
  SlidersHorizontal,
  ListChecks,
  Clock,
  Layers3,
  Flag,
  ChevronLeft,
  ChevronRight,
  Check,
  PanelRightOpen,
  PanelRightClose,
  Sigma,
  NotebookPen,
  Calculator as CalcIcon,
  Settings2,
  Trophy,
  Sparkles,
  Network,
  RotateCw,
  CircleDot,
  Loader2,
} from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Page } from "../components/Page";
import { api, type ExamResult } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";
import { formulaSheet, type ExamQuestion } from "../lib/exam-data";
import { useExamStore } from "../stores/useExamStore";

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Adaptive"];
const COVERAGE = [
  "Entire Course",
  "Selected Topics",
  "Weak Topics Only",
  "Recent Documents",
];

export function Exam() {
  const stage = useExamStore((s) => s.stage);

  if (stage === "builder") return <Builder />;
  if (stage === "session") return <Session />;
  return <Results />;
}

/* ---------------- Builder ---------------- */

function Builder() {
  const topic = useExamStore((s) => s.topic);
  const course = useExamStore((s) => s.course);
  const difficulty = useExamStore((s) => s.difficulty);
  const count = useExamStore((s) => s.count);
  const minutes = useExamStore((s) => s.minutes);
  const coverage = useExamStore((s) => s.coverage);
  const types = useExamStore((s) => s.types);
  const generating = useExamStore((s) => s.generating);
  const setField = useExamStore((s) => s.setField);
  const generate = useExamStore((s) => s.generate);

  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const document = useExamStore((s) => s.document);
  const setDocument = (v: string | null) => setField("document", v);
  const setDifficulty = (v: string) => setField("difficulty", v);
  const setCount = (v: number) => setField("count", v);
  const setMinutes = (v: number) => setField("minutes", v);
  const setCoverage = (v: string) => setField("coverage", v);
  const setTypes = (v: string[]) => setField("types", v);

  const TYPE_OPTIONS = [
    { label: "MCQ", value: "mcq" },
    { label: "True/False", value: "truefalse" },
    { label: "Short Answer", value: "short" },
    { label: "Long Answer", value: "long" },
  ];

  useEffect(() => {
    let active = true;
    api
      .listCourses()
      .then((cs) => {
        if (active) setCourses(cs);
      })
      .catch(() => {
      });
    api.listDocuments().then((ds) => { if (active) setDocuments(ds); }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <Page className="max-w-3xl">
      <div className="mb-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-border bg-card text-violet">
          <GraduationCap className="size-6" />
        </div>
        <h1 className="mt-4">Configure Mock Exam</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate a realistic exam from your uploaded materials.
        </p>
      </div>

      <div className="space-y-5">
        <Field
          icon={ListChecks}
          title="Topic"
          desc="What should the exam focus on?"
        >
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Transformers, backpropagation…"
            className="bg-input-background"
          />
        </Field>

        <Field
          icon={FileStack}
          title="Source Material"
          desc="Choose the course the exam draws from"
        >
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="w-full bg-input-background">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={document ?? "all"} onValueChange={(v) => setDocument(v === "all" ? null : v)}>
            <SelectTrigger className="w-full bg-input-background mt-2">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents.filter(d => course !== "all" ? d.course === course : true).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field icon={SlidersHorizontal} title="Difficulty">
          <Segmented
            options={DIFFICULTIES}
            value={difficulty}
            onChange={setDifficulty}
          />
        </Field>

        <Field icon={ListChecks} title="Question Types" desc="Select formats to include">
          <MultiSegmented
            options={TYPE_OPTIONS}
            values={types}
            onChange={(v) => {
               if (v.length > 0) setTypes(v);
            }}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field icon={ListChecks} title="Questions">
            <Segmented
              options={["5", "8", "10", "15"]}
              value={String(count)}
              onChange={(v) => setCount(Number(v))}
            />
          </Field>
          <Field icon={Clock} title="Time Limit">
            <Segmented
              options={["15", "20", "30", "60"]}
              value={String(minutes)}
              onChange={(v) => setMinutes(Number(v))}
              suffix="min"
            />
          </Field>
        </div>

        <Field icon={Layers3} title="Coverage">
          <select
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-input-background px-3 text-sm outline-none focus:border-ring"
          >
            {COVERAGE.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {count} questions
            </span>{" "}
            · {difficulty} · {minutes} min · {coverage}
          </div>
          <Button
            onClick={generate}
            disabled={generating}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {generating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate Mock Exam
              </>
            )}
          </Button>
        </div>
        <GenerationSteps
          steps={[
            "Searching your library",
            "Drafting questions",
            "Calibrating difficulty",
            "Formatting exam",
          ]}
          loading={generating}
          interval={2500}
        />
      </div>
    </Page>
  );
}

/* ---------------- Session ---------------- */

function Session() {
  // Session state lives in the store so it survives navigation away and back.
  const questions = useExamStore((s) => s.questions);
  const difficultyLabel = useExamStore((s) => s.difficultyLabel);
  const answers = useExamStore((s) => s.answers);
  const idx = useExamStore((s) => s.idx);
  const flagged = useExamStore((s) => s.flagged);
  const visited = useExamStore((s) => s.visited);
  const deadline = useExamStore((s) => s.deadline);
  const submitting = useExamStore((s) => s.submitting);
  const answer = useExamStore((s) => s.answer);
  const toggleFlagStore = useExamStore((s) => s.toggleFlag);
  const gotoStore = useExamStore((s) => s.goto);
  const submitStore = useExamStore((s) => s.submit);

  const [panelOpen, setPanelOpen] = useState(false);

  // Derive seconds-left from the absolute store `deadline` so the countdown
  // always reflects real elapsed time, even after leaving and returning to /exam.
  const secsFromDeadline = () =>
    deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0;
  const [secsLeft, setSecsLeft] = useState(secsFromDeadline);
  const submittedRef = useRef(false);

  const q = questions[idx];

  const submit = async () => {
    if (submittedRef.current || useExamStore.getState().submitting) return;
    submittedRef.current = true;
    await submitStore();
    // submitStore clears `submitting` (and stays on this stage) on failure; allow retry.
    if (useExamStore.getState().stage !== "results")
      submittedRef.current = false;
  };

  // Local interval reads the store `deadline` each tick; the store remains the
  // source of truth, so the timer resumes correctly after navigation.
  useEffect(() => {
    const tick = () => {
      const left = secsFromDeadline();
      setSecsLeft(left);
      if (left <= 0 && !submittedRef.current) {
        toast.warning("Time's up — submitting exam");
        void submit();
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  const goto = (i: number) => gotoStore(i);
  const setAnswer = (val: string) => answer(q.id, val);
  const toggleFlag = () => toggleFlagStore(q.id);

  const isFlagged = (id: string) => flagged.includes(id);
  const isVisited = (id: string) => visited.includes(id);

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const ss = String(secsLeft % 60).padStart(2, "0");
  const low = secsLeft < 60;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center gap-4 border-b border-border px-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-4 text-violet" />
          <span className="text-sm font-medium">
            Mock Exam — {difficultyLabel}
          </span>
        </div>
        <div className="ml-4 hidden items-center gap-2 sm:flex">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-violet"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        <div
          className={cn(
            "ml-auto flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums",
            low
              ? "border-danger/40 bg-danger-soft text-danger"
              : "border-border bg-card",
          )}
        >
          <Clock className="size-4" /> {mm}:{ss}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="size-9"
          onClick={() => setPanelOpen((o) => !o)}
        >
          {panelOpen ? (
            <PanelRightClose className="size-4" />
          ) : (
            <PanelRightOpen className="size-4" />
          )}
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Navigator */}
        <aside className="hidden w-[200px] shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 p-4 md:flex">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Questions
          </div>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((eq, i) => {
              const isCurrent = i === idx;
              const isAnswered = !!answers[eq.id];
              const flaggedHere = isFlagged(eq.id);
              const isSkipped = isVisited(eq.id) && !isAnswered && !isCurrent;
              return (
                <button
                  key={eq.id}
                  onClick={() => goto(i)}
                  className={cn(
                    "relative flex aspect-square items-center justify-center rounded-md border text-xs font-medium transition-colors",
                    isCurrent && "border-violet bg-violet text-white",
                    !isCurrent &&
                    isAnswered &&
                    "border-success/40 bg-success-soft text-success",
                    !isCurrent &&
                    isSkipped &&
                    "border-warning/40 bg-warning-soft text-warning",
                    !isCurrent &&
                    !isAnswered &&
                    !isSkipped &&
                    "border-border bg-card text-muted-foreground hover:border-ring/40",
                  )}
                >
                  {i + 1}
                  {flaggedHere && (
                    <Flag className="absolute -right-1 -top-1 size-3 fill-danger text-danger" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-5 space-y-1.5 text-[11px] text-muted-foreground">
            <Legend cls="bg-success-soft border-success/40" label="Answered" />
            <Legend cls="bg-warning-soft border-warning/40" label="Skipped" />
            <Legend cls="bg-violet border-violet" label="Current" />
            <Legend cls="bg-card border-border" label="Unseen" />
          </div>
        </aside>

        {/* Question area */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-8 py-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Question {idx + 1}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] text-muted-foreground"
                >
                  {q.topic}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", diffCls(q.difficulty))}
                >
                  {q.difficulty}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1.5 text-xs",
                  isFlagged(q.id) && "text-danger",
                )}
                onClick={toggleFlag}
              >
                <Flag
                  className={cn("size-3.5", isFlagged(q.id) && "fill-danger")}
                />
                {isFlagged(q.id) ? "Flagged" : "Flag"}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="mt-4 font-reading text-[1.6rem] leading-snug">
                  {q.prompt}
                </h2>
                <div className="mt-6">
                  <AnswerArea
                    q={q}
                    value={answers[q.id]}
                    onChange={setAnswer}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <Button
                variant="outline"
                className="gap-1.5"
                disabled={idx === 0}
                onClick={() => goto(idx - 1)}
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              {idx === questions.length - 1 ? (
                <Button
                  onClick={submit}
                  disabled={submitting}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <Check className="size-4" /> Submit Exam
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => goto(idx + 1)}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Right panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="shrink-0 overflow-hidden border-l border-border bg-card/40"
            >
              <div className="w-[300px] space-y-5 overflow-y-auto p-4">
                <PanelBlock title="Formula Sheet" icon={Sigma}>
                  {formulaSheet.map((f) => (
                    <div
                      key={f.name}
                      className="rounded-lg border border-border bg-card px-3 py-2"
                    >
                      <div className="text-[11px] text-muted-foreground">
                        {f.name}
                      </div>
                      <div className="mt-0.5 font-mono text-sm">
                        {f.formula}
                      </div>
                    </div>
                  ))}
                </PanelBlock>
                <PanelBlock title="Reference Notes" icon={NotebookPen}>
                  <p className="font-reading text-sm leading-relaxed text-foreground/80">
                    Self-attention lets each token weigh all others; scaling by
                    √dₖ stabilizes gradients.
                  </p>
                </PanelBlock>
                <PanelBlock title="Calculator" icon={CalcIcon}>
                  <MiniCalculator />
                </PanelBlock>
                <PanelBlock title="Exam Settings" icon={Settings2}>
                  <div className="text-sm text-muted-foreground">
                    Font size, high contrast and timer visibility.
                  </div>
                </PanelBlock>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnswerArea({
  q,
  value,
  onChange,
}: {
  q: ExamQuestion;
  value?: string;
  onChange: (v: string) => void;
}) {
  if (q.type === "long")
    return (
      <Textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Write your answer…"
        className="resize-none bg-input-background font-reading"
      />
    );
  if (q.type === "short")
    return (
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a short answer…"
        className="bg-input-background"
      />
    );
  return (
    <div className="space-y-2">
      {q.options?.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors",
            value === opt
              ? "border-violet bg-violet-soft"
              : "border-border bg-card hover:border-ring/40",
          )}
        >
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full border",
              value === opt
                ? "border-violet bg-violet text-white"
                : "border-border",
            )}
          >
            {value === opt && <Check className="size-3" />}
          </span>
          {opt}
        </button>
      ))}
    </div>
  );
}

function MiniCalculator() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const inputDigit = (d: string) => {
    setDisplay((cur) => (fresh || cur === "0" ? d : cur + d));
    setFresh(false);
  };
  const dot = () => {
    setDisplay((cur) => (fresh ? "0." : cur.includes(".") ? cur : cur + "."));
    setFresh(false);
  };
  const compute = (a: number, b: number, o: string) =>
    o === "+"
      ? a + b
      : o === "−"
        ? a - b
        : o === "×"
          ? a * b
          : b === 0
            ? NaN
            : a / b;
  const chooseOp = (o: string) => {
    const cur = parseFloat(display);
    if (acc !== null && op && !fresh) {
      const r = compute(acc, cur, op);
      setAcc(r);
      setDisplay(String(r));
    } else {
      setAcc(cur);
    }
    setOp(o);
    setFresh(true);
  };
  const equals = () => {
    if (acc !== null && op) {
      const r = compute(acc, parseFloat(display), op);
      setDisplay(Number.isNaN(r) ? "Error" : String(r));
      setAcc(null);
      setOp(null);
      setFresh(true);
    }
  };
  const clear = () => {
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const keys = [
    "7",
    "8",
    "9",
    "÷",
    "4",
    "5",
    "6",
    "×",
    "1",
    "2",
    "3",
    "−",
    "0",
    ".",
    "=",
    "+",
  ];
  return (
    <div className="rounded-lg border border-border bg-card p-2">
      <div className="mb-2 rounded-md bg-secondary px-3 py-2 text-right font-mono text-lg tabular-nums">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1">
        <button
          onClick={clear}
          className="col-span-4 rounded-md border border-border py-1.5 text-xs text-muted-foreground hover:bg-accent"
        >
          Clear
        </button>
        {keys.map((k) => {
          const isOp = ["÷", "×", "−", "+", "="].includes(k);
          return (
            <button
              key={k}
              onClick={() =>
                k === "="
                  ? equals()
                  : isOp
                    ? chooseOp(k)
                    : k === "."
                      ? dot()
                      : inputDigit(k)
              }
              className={cn(
                "rounded-md py-2 text-sm font-medium transition-colors",
                isOp
                  ? "bg-violet-soft text-violet hover:bg-violet hover:text-white"
                  : "bg-secondary hover:bg-accent",
              )}
            >
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Results ---------------- */

function Results() {
  const result = useExamStore((s) => s.result) as ExamResult;
  const difficultyLabel = useExamStore((s) => s.difficultyLabel);
  const onRestart = useExamStore((s) => s.reset);

  const { score, correct, total, topicPerformance, difficultyAnalysis, review = [], recommendedRevisions = [] } =
    result;
  const pct = Math.round(score);

  const weak = topicPerformance.filter((t) => t.score < 70);
  const strong = topicPerformance.filter((t) => t.score >= 70);

  const revisionActions = [
    { label: "Study Sheet", icon: NotebookPen },
    { label: "Flashcards", icon: Layers3 },
    { label: "Quiz", icon: ListChecks },
    { label: "Mind Map", icon: Network },
  ];

  return (
    <Page className="max-w-4xl space-y-6">
      {/* Score hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex size-24 shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-background">
          <Trophy className="size-5 text-violet" />
          <span className="mt-1 font-display text-3xl leading-none">
            {pct}%
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h1>Exam Complete</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You answered {correct} of {total} correctly.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Stat label="Score" value={`${correct}/${total}`} />
            <Stat label="Percentage" value={`${pct}%`} />
            <Stat label="Difficulty" value={difficultyLabel} />
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={onRestart}>
          <RotateCw className="size-4" /> New Exam
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Topic performance */}
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Topic Performance
          </h3>
          <div className="space-y-4">
            {topicPerformance.map((t) => (
              <div key={t.topic}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span>{t.topic}</span>
                  <span className="font-medium tabular-nums">{t.score}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.score}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        t.score >= 70
                          ? "var(--success)"
                          : t.score >= 50
                            ? "var(--warning)"
                            : "var(--danger)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-7 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Difficulty Analysis
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {difficultyAnalysis.map((d) => (
              <div
                key={d.level}
                className="rounded-xl border border-border bg-background/40 p-3 text-center"
              >
                <div className="font-display text-2xl leading-none">
                  {d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0}%
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {d.level}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {d.correct}/{d.total} correct
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strong / weak */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Strong Areas
            </h3>
            <div className="space-y-2">
              {strong.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No strong areas yet.
                </div>
              )}
              {strong.map((t) => (
                <div key={t.topic} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-success" /> {t.topic}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Weak Areas
            </h3>
            <div className="space-y-2">
              {weak.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No weak areas — great work!
                </div>
              )}
              {weak.map((t) => (
                <div key={t.topic} className="flex items-center gap-2 text-sm">
                  <CircleDot className="size-4 text-danger" /> {t.topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended revision */}
      <div className="rounded-2xl border border-violet/25 bg-violet-soft/40 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-violet" />
          <h3 className="text-sm font-semibold">
            Recommended Revision for weak topics
          </h3>
        </div>
        <div className="mt-3 space-y-2">
          {recommendedRevisions.length > 0 ? (
            <ul className="list-inside list-disc text-sm text-muted-foreground space-y-1">
              {recommendedRevisions.map((rev, i) => (
                <li key={i}>{rev}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {weak.length > 0
                ? `Generate targeted study material for ${weak.map((t) => t.topic).join(", ")}.`
                : "Generate study material to keep your knowledge sharp."}
            </p>
          )}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {revisionActions.map((a) => (
            <button
              key={a.label}
              onClick={() => toast.success(`Generating ${a.label}…`)}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-medium transition-colors hover:border-violet/50 hover:text-violet"
            >
              <a.icon className="size-4" /> {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Review */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Questions Review
        </h3>
        <div className="space-y-4">
          {review.map((r, i) => (
            <div key={r.id} className="rounded-xl border border-border bg-background/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Question {i + 1}</span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", r.correct ? "border-success/40 bg-success-soft text-success" : "border-danger/40 bg-danger-soft text-danger")}
                >
                  {r.correct ? "Correct" : "Incorrect"}
                </Badge>
              </div>
              <p className="font-reading text-[1.1rem] leading-snug">{r.prompt}</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-medium text-muted-foreground">Your Answer:</span>
                  <span className={cn(r.correct ? "text-success" : "text-danger")}>{r.given || "—"}</span>
                </div>
                {!r.correct && (
                  <div className="flex gap-2">
                    <span className="font-medium text-muted-foreground">Correct Answer:</span>
                    <span className="text-success">{r.expected}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ---------------- Shared bits ---------------- */

function diffCls(d: string) {
  return d === "Easy"
    ? "border-success/40 bg-success-soft text-success"
    : d === "Medium"
      ? "border-warning/40 bg-warning-soft text-warning"
      : "border-danger/40 bg-danger-soft text-danger";
}

function Field({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof FileStack;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
        {desc && (
          <span className="text-xs text-muted-foreground">· {desc}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
  suffix,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="flex rounded-lg border border-border bg-card p-0.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
            value === o
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
          {suffix ? ` ${suffix}` : ""}
        </button>
      ))}
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-3 rounded border", cls)} /> {label}
    </div>
  );
}

function PanelBlock({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Sigma;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 px-3 py-1.5">
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function MultiSegmented({
  options,
  values,
  onChange,
}: {
  options: { label: string; value: string }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-0.5">
      {options.map((o) => {
        const active = values.includes(o.value);
        return (
          <button
            key={o.value}
            onClick={() =>
              onChange(
                active
                  ? values.filter((v) => v !== o.value)
                  : [...values, o.value],
              )
            }
            className={cn(
              "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
```

## File: src/app/pages/Flashcards.tsx
```typescript
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  List,
  GraduationCap,
  RotateCw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Page, SectionTitle } from "../components/Page";
import { FlashcardCard } from "../components/FlashcardCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";
import type { DeckOut } from "../lib/api";
import type { Course, DocumentItem, Flashcard } from "../lib/types";
import { useFlashcardGenStore } from "../stores/useFlashcardGenStore";
import { cn } from "../components/ui/utils";

type View = "grid" | "list" | "study";

const NO_GROUNDED_MESSAGE =
  "No grounded flashcards — try uploading documents or a different topic.";

export function Flashcards() {
  // Generation state lives in the store so freshly generated (unsaved) cards and
  // in-flight generations survive navigation.
  const topic = useFlashcardGenStore((s) => s.topic);
  const course = useFlashcardGenStore((s) => s.course);
  const document = useFlashcardGenStore((s) => s.document);
  const generating = useFlashcardGenStore((s) => s.generating);
  const genCards = useFlashcardGenStore((s) => s.cards);
  const genUngrounded = useFlashcardGenStore((s) => s.ungrounded);
  const generatedDeckName = useFlashcardGenStore((s) => s.generatedDeckName);
  const activeDeck = useFlashcardGenStore((s) => s.activeDeck);
  const setField = useFlashcardGenStore((s) => s.setField);
  const setGenCards = useFlashcardGenStore((s) => s.setCards);
  const generate = useFlashcardGenStore((s) => s.generate);

  // View mode persists in the store so it survives navigation.
  const view = useFlashcardGenStore((s) => s.view);
  const setView = (v: View) => setField("view", v);
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  // Cards loaded from a saved deck (view-only / reviewable) — cheap to refetch,
  // so they stay page-local. The store holds the generated unsaved set instead.
  const [savedCards, setSavedCards] = useState<Flashcard[]>([]);

  const [decks, setDecks] = useState<DeckOut[]>([]);
  const [loadingDecks, setLoadingDecks] = useState(true);
  const [loadingCards, setLoadingCards] = useState(false);
  const [saving, setSaving] = useState(false);

  // When a saved deck is open (activeDeck set) we display its cards; otherwise we
  // display the generated unsaved set from the store.
  const cards = activeDeck ? savedCards : genCards;
  const ungrounded = activeDeck ? false : genUngrounded;
  // Helper to update whichever card set is currently displayed.
  const updateActiveCards = (updater: (cs: Flashcard[]) => Flashcard[]) => {
    if (activeDeck) setSavedCards(updater);
    else setGenCards(updater(genCards));
  };

  const loadDecks = async () => {
    setLoadingDecks(true);
    try {
      setDecks(await api.listDecks());
    } catch {
      setDecks([]);
    } finally {
      setLoadingDecks(false);
    }
  };

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => setCourses([]));
    api.listDocuments().then(setDocuments).catch(() => setDocuments([]));
    void loadDecks();
    // If a saved deck was open before navigating away, re-fetch its cards on
    // remount (savedCards is local state and would otherwise be empty).
    const openDeckName = useFlashcardGenStore.getState().activeDeck;
    if (openDeckName) {
      setLoadingCards(true);
      api
        .listSavedFlashcards(openDeckName)
        .then(setSavedCards)
        .catch(() => setField("activeDeck", null))
        .finally(() => setLoadingCards(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After a successful generation, switch to grid view to show the new cards.
  const runGenerate = async () => {
    await generate();
    if (useFlashcardGenStore.getState().cards.length > 0) setView("grid");
  };

  const saveDeck = async () => {
    if (saving || cards.length === 0 || activeDeck) return;
    const name = (generatedDeckName ?? topic.trim() ?? "").trim() || "Untitled deck";
    setSaving(true);
    try {
      const deck = await api.saveDeck(name, course, cards);
      toast.success(`Saved "${deck.name}"`);
      // Mark the generated set as saved and reload from the persisted deck so
      // card ids become DB ids (reviewable).
      setField("generatedDeckName", null);
      await loadDecks();
      await openDeck(deck);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save deck");
    } finally {
      setSaving(false);
    }
  };

  const openDeck = async (deck: DeckOut) => {
    setLoadingCards(true);
    try {
      const loaded = await api.listSavedFlashcards(deck.name);
      setSavedCards(loaded);
      setField("activeDeck", deck.name);
      setField("generatedDeckName", null);
      setField("ungrounded", false);
      setView("grid");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load deck");
    } finally {
      setLoadingCards(false);
    }
  };

  const deleteDeck = async (deck: DeckOut) => {
    try {
      await api.deleteDeck(deck.id);
      toast.success(`Deleted "${deck.name}"`);
      if (activeDeck === deck.name) {
        setSavedCards([]);
        setField("activeDeck", null);
      }
      await loadDecks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete deck");
    }
  };

  const deleteCard = async (card: Flashcard) => {
    const prev = cards;
    updateActiveCards((cs) => cs.filter((c) => c.id !== card.id));
    try {
      await api.deleteCard(card.id);
      toast.success("Card deleted");
      await loadDecks();
    } catch (err) {
      updateActiveCards(() => prev);
      toast.error(err instanceof Error ? err.message : "Failed to delete card");
    }
  };

  const reviewCard = async (card: Flashcard, ease: Flashcard["ease"]) => {
    // Optimistic update on whichever set is shown.
    updateActiveCards((cs) => cs.map((c) => (c.id === card.id ? { ...c, ease } : c)));
    if (!activeDeck) return; // Unsaved cards have no DB id to persist against.
    try {
      const updated = await api.reviewCard(card.id, ease);
      setSavedCards((cs) => cs.map((c) => (c.id === card.id ? updated : c)));
      void loadDecks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save review");
    }
  };

  const hasCards = cards.length > 0;
  const canSave = hasCards && !activeDeck;

  return (
    <Page className="space-y-6">
      {/* Generate flashcards */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-violet" /> Generate flashcards
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={topic}
            onChange={(e) => setField("topic", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void runGenerate();
              }
            }}
            placeholder="Topic, e.g. eigenvalues, SN1 vs SN2…"
            className="flex-1"
            disabled={generating}
          />
          <Select
            value={course ?? "all"}
            onValueChange={(v) => setField("course", v === "all" ? null : v)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={document ?? "all"}
            onValueChange={(v) => setField("document", v === "all" ? null : v)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents.filter(d => course ? d.course === course : true).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => void runGenerate()}
            disabled={!topic.trim() || generating}
            className="gap-1.5"
          >
            {generating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate
              </>
            )}
          </Button>
        </div>
        <GenerationSteps
          steps={["Searching your library", "Extracting key concepts", "Writing cards", "Formatting deck"]}
          loading={generating}
          className="mt-3"
        />
      </div>

      {/* Decks */}
      <div>
        <SectionTitle title="Decks" />
        {loadingDecks ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-card/40 px-4 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading decks…
          </div>
        ) : decks.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-violet">
              <GraduationCap className="size-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No saved decks yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Generate a set of flashcards above and save it as a deck to start
              building your spaced-repetition library.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {decks.map((d) => (
              <motion.div
                key={d.id}
                whileHover={{ y: -2 }}
                onClick={() => void openDeck(d)}
                className={cn(
                  "group relative cursor-pointer rounded-xl border bg-card p-4 transition-colors",
                  activeDeck === d.name ? "border-violet/60 ring-1 ring-violet/30" : "border-border hover:border-border",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${d.color}22`, color: d.color }}>
                    <GraduationCap className="size-4" />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.cards} cards</span>
                </div>
                <div className="mt-3 text-sm font-medium">{d.name}</div>
                <div className="text-xs text-muted-foreground">{d.course}</div>
                <Progress value={d.cards ? (d.mastered / d.cards) * 100 : 0} className="mt-3 h-1.5" />
                <div className="mt-1.5 text-xs text-muted-foreground">{d.mastered} mastered</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void deleteDeck(d);
                  }}
                  aria-label={`Delete ${d.name}`}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-danger-soft hover:text-danger group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* View switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Cards</h3>
          {activeDeck && (
            <Badge variant="outline" className="text-[10px] font-medium">
              {activeDeck}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canSave && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => void saveDeck()}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" /> Save as deck
                </>
              )}
            </Button>
          )}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {([
              { id: "grid", icon: LayoutGrid, label: "Grid" },
              { id: "list", icon: List, label: "List" },
              { id: "study", icon: RotateCw, label: "Study" },
            ] as const).map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                disabled={!hasCards}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  view === v.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  !hasCards && "cursor-not-allowed opacity-50",
                )}
              >
                <v.icon className="size-4" /> {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loadingCards ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 px-6 py-14 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading cards…
        </div>
      ) : !hasCards ? (
        <EmptyCards ungrounded={ungrounded} />
      ) : (
        <>
          {view === "grid" && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <div key={c.id} className="group/card relative">
                  <FlashcardCard card={c} />
                  <button
                    onClick={() => void deleteCard(c)}
                    aria-label="Delete card"
                    className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-md bg-card/80 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:bg-danger-soft hover:text-danger group-hover/card:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {cards.map((c, i) => (
                <div
                  key={c.id}
                  className={cn("group/row flex items-center gap-4 px-4 py-3 hover:bg-accent/30", i !== 0 && "border-t border-border")}
                >
                  <Badge variant="outline" className="text-[10px] uppercase">{c.type}</Badge>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{c.front}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.back}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.deck}</span>
                  <span className="text-xs text-muted-foreground">{c.due}</span>
                  <button
                    onClick={() => void deleteCard(c)}
                    aria-label="Delete card"
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-danger-soft hover:text-danger group-hover/row:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {view === "study" && (
            <StudyMode cards={cards} onReview={reviewCard} persisted={!!activeDeck} />
          )}
        </>
      )}
    </Page>
  );
}

function EmptyCards({ ungrounded }: { ungrounded: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-violet">
        <Sparkles className="size-6" />
      </div>
      <h3 className="mt-5 text-sm font-semibold">
        {ungrounded ? "No grounded flashcards" : "No flashcards yet"}
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {ungrounded
          ? NO_GROUNDED_MESSAGE
          : "Enter a topic above and generate a set of source-grounded flashcards, or pick a saved deck to start studying."}
      </p>
    </div>
  );
}

function StudyMode({
  cards,
  onReview,
  persisted,
}: {
  cards: Flashcard[];
  onReview: (card: Flashcard, ease: Flashcard["ease"]) => void;
  persisted: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[idx % cards.length];
  const progress = ((idx + 1) / cards.length) * 100;

  const next = () => {
    setFlipped(false);
    setIdx((i) => (i + 1) % cards.length);
  };
  const prev = () => {
    setFlipped(false);
    setIdx((i) => (i - 1 + cards.length) % cards.length);
  };

  const grade = (ease: Flashcard["ease"]) => {
    onReview(card, ease);
    next();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Progress value={progress} className="h-1.5 flex-1" />
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {idx + 1} of {cards.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <div key={card.id} className="group relative h-80 w-full [perspective:1000px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              rotateY: flipped ? 180 : 0
            }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              rotateY: { duration: 0.6, type: "spring", stiffness: 260, damping: 20 },
              opacity: { duration: 0.3 },
              y: { duration: 0.3 }
            }}
            className="relative size-full cursor-pointer [transform-style:preserve-3d]"
            onClick={() => setFlipped(!flipped)}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center [backface-visibility:hidden] [transform:rotateY(0deg)] shadow-sm"
              style={{ zIndex: flipped ? 0 : 1 }}
            >
              <Badge variant="outline" className="mb-8 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Question · {card.deck}
              </Badge>
              <p className="font-serif text-2xl leading-tight text-foreground">{card.front}</p>
              <div className="mt-8 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider opacity-60">
                <RotateCw className="size-3" /> Tap to reveal
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-violet/30 bg-[#fdfcfa] p-10 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-sm"
              style={{ zIndex: flipped ? 1 : 0 }}
            >
              <Badge variant="outline" className="mb-8 text-[10px] font-semibold uppercase tracking-widest text-violet">
                Answer · {card.deck}
              </Badge>
              <p className="font-serif text-2xl leading-tight text-foreground">{card.back}</p>
              <div className="mt-8 flex items-center gap-2 text-xs font-medium text-violet/60 uppercase tracking-wider">
                <RotateCw className="size-3" /> Tap to see question
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" size="icon" className="size-11 rounded-full border-border/60" onClick={prev}>
          <ChevronLeft className="size-5" />
        </Button>
        <div className="flex gap-4">
          <Button variant="outline" className="h-11 gap-2 rounded-full border-danger/40 px-6 font-medium text-danger hover:bg-danger-soft" onClick={() => grade("learning")}>
            <X className="size-4" /> Hard
          </Button>
          <Button variant="outline" className="h-11 gap-2 rounded-full border-success/40 px-6 font-medium text-success hover:bg-success-soft" onClick={() => grade("mastered")}>
            <Check className="size-4" /> Easy
          </Button>
        </div>
        <Button variant="outline" size="icon" className="size-11 rounded-full border-border/60" onClick={next}>
          <ChevronRight className="size-5" />
        </Button>
      </div>

      {!persisted && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Save this set as a deck to record your reviews.
        </p>
      )}
    </div>
  );
}
```

## File: src/app/pages/Diagrams.tsx
```typescript
import { Component, useEffect, useState, type ReactNode } from "react";
import { Workflow, Copy, Check, Download, FileImage, Code2, Sparkles, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { toast } from "sonner";
import { DiagramViewer } from "../components/DiagramViewer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";
import type { Course, DiagramItem, DocumentItem } from "../lib/types";
import { useDiagramGenStore } from "../stores/useDiagramGenStore";
import { cn } from "../components/ui/utils";

const DIAGRAM_TYPES = [
  { value: "flowchart", label: "Flowchart" },
  { value: "decision_tree", label: "Decision tree" },
  { value: "concept_map", label: "Concept map" },
] as const;

export function Diagrams() {
  const [items, setItems] = useState<DiagramItem[]>([]);
  const [active, setActiveState] = useState<DiagramItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // Generation state lives in a global store so an in-flight generation keeps
  // running (and shows a pending item) when navigating away and back.
  const { topic, course, document, type, generating, generated, setField, generate } = useDiagramGenStore();
  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const setDocument = (v: string | null) => setField("document", v);
  const setType = (v: string) => setField("type", v);

  // Selecting a diagram also records its id in the store, so the viewer
  // restores the same diagram after navigating away and back.
  const setActive = (d: DiagramItem | null) => {
    setActiveState(d);
    setField("activeId", d?.id ?? null);
  };

  // Absorb the latest generated diagram into the list + select it. Runs on
  // mount too, so a diagram generated while the page was unmounted shows up.
  useEffect(() => {
    if (!generated) return;
    setItems((prev) => (prev.some((d) => d.id === generated.id) ? prev : [generated, ...prev]));
    setActive(generated);
    setShowCode(false);
  }, [generated]);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => {
        if (!cancelled) setCourses(cs);
      })
      .catch(() => {
        /* leave course selector with just "No course" */
      });
    api.listDocuments().then((ds) => { if (!cancelled) setDocuments(ds); }).catch(() => {});
    api
      .listDiagrams()
      .then((ds) => {
        if (cancelled) return;
        setItems(ds);
        // Restore the previously-open diagram by id; fall back to the first.
        const storedId = useDiagramGenStore.getState().activeId;
        setActiveState((cur) => cur ?? ds.find((d) => d.id === storedId) ?? ds[0] ?? null);
      })
      .catch(() => {
        /* empty library */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const remove = async (id: string) => {
    try {
      await api.deleteDiagram(id);
      const next = items.filter((d) => d.id !== id);
      setItems(next);
      if (active?.id === id) setActive(next[0] ?? null);
      toast.success("Diagram deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete diagram");
    }
  };

  const copy = () => {
    if (!active) return;
    navigator.clipboard.writeText(active.mermaid);
    setCopied(true);
    toast.success("Mermaid copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const exportSvg = () => {
    const svg = document.querySelector("#diagram-container svg");
    if (!svg) {
      toast.error("Diagram not found");
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${active?.title || "diagram"}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported as SVG");
  };

  const exportPng = () => {
    const svg = document.querySelector("#diagram-container svg") as SVGElement;
    if (!svg) {
      toast.error("Diagram not found");
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const rect = svg.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(2, 2);
    }
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, rect.width, rect.height);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${active?.title || "diagram"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Exported as PNG");
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex h-full">
      {/* Diagram list */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-3 text-sm font-medium">
          Diagrams
        </div>
        <ScrollArea className="flex-1 [&>[data-radix-scroll-area-viewport]>div]:!block">
          <div className="space-y-1 p-2 w-full">
            {generating && (
              <div className="flex w-full items-center gap-3 rounded-lg border border-dashed border-violet/40 bg-violet-soft/40 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-violet">
                  <Loader2 className="size-4 animate-spin" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{topic.trim() || "Generating…"}</div>
                  <div className="truncate text-xs text-muted-foreground">Generating…</div>
                </div>
              </div>
            )}
            {items.length === 0 && !generating && (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                No diagrams yet. Generate one to get started.
              </div>
            )}
            {items.map((d) => (
              <div
                key={d.id}
                onClick={() => setActive(d)}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors",
                  active?.id === d.id ? "bg-violet-soft" : "hover:bg-accent/40",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    active?.id === d.id ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Workflow className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{d.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{d.kind}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground opacity-0 hover:text-danger group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    void remove(d.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Preview */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Generate control */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card/40 px-6 py-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !generating) generate();
            }}
            placeholder="Topic, e.g. TCP handshake"
            className="h-9 max-w-xs flex-1 bg-input-background"
          />
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="h-9 w-44 bg-input-background">
              <SelectValue placeholder="No course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No course</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={document ?? "all"} onValueChange={(v) => setDocument(v === "all" ? null : v)}>
            <SelectTrigger className="h-9 w-44 bg-input-background">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents.filter(d => course !== "none" ? d.course === course : true).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-9 w-44 bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIAGRAM_TYPES.map((dt) => (
                <SelectItem key={dt.value} value={dt.value}>
                  {dt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-1.5" onClick={generate} disabled={generating}>
            {generating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            {generating ? "Generating..." : "Generate diagram"}
          </Button>
        </div>
        <GenerationSteps
          steps={["Searching your library", "Analyzing relationships", "Building diagram structure", "Rendering Mermaid"]}
          loading={generating}
          className="border-b border-border px-6 py-3"
          interval={2200}
        />

        {active ? (
          <>
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{active.title}</span>
                <Badge variant="outline" className="border-cyan/40 bg-cyan-soft text-cyan">
                  {active.kind}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowCode((s) => !s)}>
                  <Code2 className="size-3.5" /> {showCode ? "Hide" : "Show"} code
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={copy}>
                  {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                  Copy Mermaid
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={exportSvg}>
                  <Download className="size-3.5" /> SVG
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={exportPng}>
                  <FileImage className="size-3.5" /> PNG
                </Button>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col" id="diagram-container">
              <div className="min-h-0 flex-1 relative">
                <DiagramErrorBoundary key={active.id} code={active.mermaid}>
                  <DiagramViewer code={active.mermaid} flush />
                </DiagramErrorBoundary>
              </div>
              {showCode && (
                <div className="absolute bottom-4 left-4 z-20">
                  <pre className="max-h-64 max-w-2xl overflow-auto rounded-lg border border-border bg-secondary/95 p-4 font-mono text-[13px] text-foreground/80 shadow-lg backdrop-blur">
                    {active.mermaid}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <div className="flex size-12 items-center justify-center rounded-xl bg-violet-soft text-primary">
              <Workflow className="size-6" />
            </div>
            <div className="text-sm">No diagram selected — generate one above.</div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Catches synchronous render errors thrown from DiagramViewer (e.g. invalid
 * Mermaid that the viewer's internal try/catch doesn't absorb) so a bad
 * LLM-generated diagram never crashes the whole page. Resets when the code
 * (and thus the `key`) changes.
 */
class DiagramErrorBoundary extends Component<
  { code: string; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { code: string; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    toast.error("Couldn't render that diagram — the Mermaid syntax may be invalid");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Diagram Error</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The mermaid syntax might be invalid. Try the code view or regenerate.
            </p>
          </div>
          <pre className="mt-2 w-full overflow-x-auto rounded-lg border border-border bg-secondary p-3 text-left text-[11px] font-mono text-danger">
            {this.props.code}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
```

## File: src/app/pages/KnowledgeBase.tsx
```typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  SlidersHorizontal,
  Tag,
  History,
  Bookmark,
  Sparkles,
  FileText,
  Layers,
  ListChecks,
  Workflow,
  Network,
  Notebook,
  BookOpen,
  Quote,
  Gauge,
  Compass,
  X,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { ConceptNode } from "../components/ConceptNode";
import {
  savedViews,
  type ConceptData,
} from "../lib/graph-data";
import { useNavigate } from "react-router";
import { api, type KGGraph, type KGSidebar, type ConceptInspector } from "../lib/api";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { useConceptActionStore } from "../stores/useConceptActionStore";
import { useKnowledgeBaseStore } from "../stores/useKnowledgeBaseStore";
import type { Course } from "../lib/types";

// stable node type map — must be outside component
const nodeTypes = { concept: ConceptNode };

// Map each concept cluster (backend enum) to the sidebar source-type label it
// most naturally represents. Clusters are hash-assigned so this is approximate,
// but it gives the source-type checkboxes a real visual effect.
const CLUSTER_SOURCE: Record<string, string> = {
  rag: "Documents",
  agent: "Answers",
  infra: "Notes",
  eval: "Quizzes",
};

// edge styling reused for every backend edge (mirrors the previous mock styling)
const edgeBase = {
  type: "smoothstep" as const,
  style: { stroke: "#c8c2b5", strokeWidth: 1.5 },
  labelStyle: { fontSize: 9, fill: "#79736a", fontFamily: "Inter, sans-serif" },
  labelBgStyle: { fill: "#f6f5f1", fillOpacity: 0.9 },
  labelBgPadding: [3, 2] as [number, number],
  labelBgBorderRadius: 3,
};

// ─── deterministic layout ─────────────────────────────────────────────────────
// The backend provides no x/y. We sort nodes so larger/more-referenced concepts
// sit toward the center, then place them on concentric rings: the single most
// important node is the hub at the origin, the rest fan out on rings whose
// capacity grows with radius. This is stable (no randomness) so the graph looks
// the same on every load.

const SIZE_WEIGHT: Record<ConceptData["size"], number> = {
  large: 3,
  medium: 2,
  small: 1,
};

function layoutGraph(graph: KGGraph): {
  nodes: Node<ConceptData>[];
  edges: Edge[];
} {
  // Most "important" first (size, then refCount) so hubs end up central.
  const ordered = [...graph.nodes].sort((a, b) => {
    const w = SIZE_WEIGHT[b.size] - SIZE_WEIGHT[a.size];
    if (w !== 0) return w;
    return b.refCount - a.refCount;
  });

  const CENTER = { x: 560, y: 360 };
  const RING_GAP = 230;

  const nodes: Node<ConceptData>[] = ordered.map((n, i) => {
    const data: ConceptData = {
      label: n.label,
      description: n.description,
      size: n.size,
      refCount: n.refCount,
      sourceCount: n.sourceCount,
      // ConceptData.cluster is a narrow union; the backend cluster is a free
      // string, so coerce it (it is only used as a tag, not switched on here).
      cluster: n.cluster as ConceptData["cluster"],
    };

    if (i === 0) {
      return { id: n.id, type: "concept", position: { ...CENTER }, data };
    }

    // ring index grows as we run out of room on inner rings:
    // ring r (1-based) holds up to 6*r slots.
    let idx = i - 1;
    let ring = 1;
    while (idx >= 6 * ring) {
      idx -= 6 * ring;
      ring += 1;
    }
    const slots = 6 * ring;
    // offset alternate rings so nodes don't line up radially
    const angle = (idx / slots) * 2 * Math.PI + (ring % 2 ? 0 : Math.PI / slots);
    const radius = ring * RING_GAP;

    return {
      id: n.id,
      type: "concept",
      position: {
        x: CENTER.x + radius * Math.cos(angle),
        y: CENTER.y + radius * Math.sin(angle),
      },
      data,
    };
  });

  const edges: Edge[] = graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    ...edgeBase,
  }));

  return { nodes, edges };
}

// ─── main page ───────────────────────────────────────────────────────────────

export function KnowledgeBase() {
  // Exploration/session state lives in a global store so the research session
  // (selected concept, search, collection/filters, course, panel layout)
  // survives navigating away from this page and back.
  const {
    selectedId,
    drawerConceptId,
    leftCollapsed,
    rightCollapsed,
    searchQuery,
    activeCollection,
    course,
    activeFilters,
    setField,
    toggleFilter,
  } = useKnowledgeBaseStore();
  // Component still works with a Set for membership checks; derive it locally
  // from the serializable array kept in the store.
  const activeFilterSet = useMemo(() => new Set(activeFilters), [activeFilters]);

  const setSelectedId = useCallback((v: string | null) => setField("selectedId", v), [setField]);
  const setDrawerConceptId = useCallback((v: string | null) => setField("drawerConceptId", v), [setField]);
  const setLeftCollapsed = useCallback((v: boolean) => setField("leftCollapsed", v), [setField]);
  const setRightCollapsed = useCallback((v: boolean) => setField("rightCollapsed", v), [setField]);
  const setSearchQuery = useCallback((v: string) => setField("searchQuery", v), [setField]);
  const setActiveCollection = useCallback((v: string | null) => setField("activeCollection", v), [setField]);
  const setCourse = useCallback((v: string | null) => setField("course", v), [setField]);

  // graph state — re-fetched on mount, so it stays local (not in the store)
  const [graph, setGraph] = useState<{ nodes: Node<ConceptData>[]; edges: Edge[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // explorer side-panel data loaded from the backend
  const [sidebar, setSidebar] = useState<KGSidebar>({
    collections: [],
    recentConcepts: [],
    sourceFilters: [],
  });

  const loadSidebar = useCallback(async (c: string | null) => {
    try {
      const s = await api.getKnowledgeSidebar(c);
      setSidebar(s);
      // Seed "all source-type filters enabled" only on a fresh session. If the
      // user already picked filters before navigating away, the store holds
      // them and we must NOT overwrite them on remount.
      const { initializedFilters } = useKnowledgeBaseStore.getState();
      if (!initializedFilters) {
        setField("activeFilters", s.sourceFilters);
        setField("initializedFilters", true);
      }
    } catch {
      // side-panel is non-critical — fall back to empty state
      setSidebar({ collections: [], recentConcepts: [], sourceFilters: [] });
    }
  }, [setField]);

  const loadGraph = useCallback(async (c: string | null) => {
    setLoading(true);
    try {
      const g = await api.getKnowledgeGraph(c);
      setGraph(layoutGraph(g));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load knowledge graph");
      setGraph({ nodes: [], edges: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph(course);
    loadSidebar(course);
  }, [course, loadGraph, loadSidebar]);

  // load courses once for the optional filter
  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => {
      /* filter is optional — ignore failures */
    });
  }, []);

  const build = useCallback(async () => {
    setBuilding(true);
    toast.info("Building knowledge graph — this runs the LLM over your documents and may take a while…");
    try {
      const { concepts, edges } = await api.buildKnowledgeGraph(course);
      toast.success(`Knowledge graph built — ${concepts} concepts, ${edges} relationships.`);
      await Promise.all([loadGraph(course), loadSidebar(course)]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to build knowledge graph");
    } finally {
      setBuilding(false);
    }
  }, [course, loadGraph, loadSidebar]);

  const isEmpty = !!graph && graph.nodes.length === 0;

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel ── */}
      <motion.aside
        animate={{ width: leftCollapsed ? 0 : 280 }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="relative z-10 hidden shrink-0 flex-col overflow-hidden border-r border-border bg-card/50 lg:flex"
      >
        <div className="flex h-full w-[280px] flex-col overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Compass className="size-3.5" /> Knowledge Explorer
            </div>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setLeftCollapsed(true)}>
              <PanelLeftClose className="size-4" />
            </Button>
          </div>

          {/* search */}
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts…"
                className="h-8 bg-input-background pl-8 text-xs"
              />
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            {/* course filter (real) */}
            {courses.length > 0 && (
              <SideSection label="Course" icon={Bookmark}>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setCourse(null)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      course === null ? "bg-violet-soft text-violet" : "text-foreground/80 hover:bg-accent/50",
                    )}
                  >
                    <span>All courses</span>
                  </button>
                  {courses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCourse(c.name === course ? null : c.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        course === c.name ? "bg-violet-soft text-violet" : "text-foreground/80 hover:bg-accent/50",
                      )}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </SideSection>
            )}

            {/* source filters (from backend) */}
            {sidebar.sourceFilters.length > 0 && (
              <SideSection label="Source Type" icon={SlidersHorizontal}>
                <div className="space-y-1">
                  {sidebar.sourceFilters.map((f) => (
                    <label key={f} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1 text-sm text-foreground/80 hover:bg-accent/50">
                      <input
                        type="checkbox"
                        checked={activeFilterSet.has(f)}
                        onChange={() => toggleFilter(f)}
                        className="accent-violet"
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </SideSection>
            )}

            {/* collections (from backend, concepts grouped by cluster) */}
            <SideSection label="Collections" icon={Bookmark}>
              {sidebar.collections.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">
                  Build the graph to group concepts into collections.
                </p>
              ) : (
                <div className="space-y-0.5">
                  {sidebar.collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCollection(c.id === activeCollection ? null : c.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        activeCollection === c.id ? "bg-violet-soft text-violet" : "text-foreground/80 hover:bg-accent/50",
                      )}
                    >
                      <span>{c.label}</span>
                      <span className="text-xs text-muted-foreground">{c.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </SideSection>

            {/* recent (from backend) */}
            <SideSection label="Recent Concepts" icon={History}>
              {sidebar.recentConcepts.length === 0 ? (
                <p className="px-1 text-xs text-muted-foreground">
                  No concepts extracted yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {sidebar.recentConcepts.map((c) => (
                    <button
                      key={c}
                      className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-foreground/70 transition-colors hover:border-violet/40 hover:text-violet"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </SideSection>

            {/* saved views (mock-only) */}
            <SideSection label="Saved Views" icon={Tag}>
              {savedViews.map((v) => (
                <button
                  key={v.id}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50"
                >
                  <v.icon className="size-4 text-muted-foreground" />
                  <span>{v.label}</span>
                </button>
              ))}
            </SideSection>
          </ScrollArea>
        </div>
      </motion.aside>

      {/* ── Center canvas ── */}
      <div className="relative min-w-0 flex-1">
        {/* panel re-open buttons */}
        {leftCollapsed && (
          <button
            onClick={() => setLeftCollapsed(false)}
            className="absolute left-3 top-3 z-20 flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        )}
        {rightCollapsed && (
          <button
            onClick={() => setRightCollapsed(false)}
            className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent"
          >
            <PanelRightOpen className="size-4" />
          </button>
        )}

        {/* Rebuild action for non-empty graphs */}
        {graph && !isEmpty && !loading && (
          <div className="absolute right-3 top-3 z-20">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-card shadow-sm"
              onClick={build}
              disabled={building}
            >
              {building ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
              {building ? "Rebuilding…" : "Rebuild"}
            </Button>
          </div>
        )}

        {loading ? (
          <GraphLoading />
        ) : isEmpty ? (
          <GraphEmpty onBuild={build} building={building} />
        ) : (
          <GraphCanvas
            nodes={graph!.nodes}
            edges={graph!.edges}
            selectedId={selectedId}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            activeCollection={activeCollection}
            onNodeClick={(id) => setSelectedId(id === selectedId ? null : id)}
            onNodeDoubleClick={(id) => setDrawerConceptId(id)}
            onPaneClick={() => setSelectedId(null)}
          />
        )}

        {/* Bottom canvas legend */}
        {!loading && !isEmpty && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
            <div className="flex items-center gap-4 rounded-full border border-border bg-card/80 px-4 py-2 text-[11px] text-muted-foreground backdrop-blur">
              <LegendDot cls="size-4 border-2 border-foreground bg-card" label="Large (hub)" />
              <LegendDot cls="size-3 border border-foreground/60 bg-card" label="Medium" />
              <LegendDot cls="size-2.5 border border-foreground/40 bg-card" label="Small (rare)" />
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1">Click to inspect · Double-click for details</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Right inspector ── */}
      <motion.aside
        animate={{ width: rightCollapsed ? 0 : 320 }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="relative z-10 hidden shrink-0 flex-col overflow-hidden border-l border-border bg-card/50 xl:flex"
      >
        <div className="flex h-full w-[320px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inspector</span>
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setRightCollapsed(true)}>
              <PanelRightClose className="size-4" />
            </Button>
          </div>
          <ScrollArea className="min-h-0 flex-1">
            {selectedId ? (
              <InspectorContent
                key={selectedId}
                conceptId={selectedId}
                onOpenDrawer={() => setDrawerConceptId(selectedId)}
              />
            ) : (
              <EmptyInspector />
            )}
          </ScrollArea>
        </div>
      </motion.aside>

      {/* ── Concept drawer (Sheet) ── */}
      <Sheet open={!!drawerConceptId} onOpenChange={(o) => !o && setDrawerConceptId(null)}>
        <SheetContent side="right" className="w-[540px] max-w-full overflow-y-auto p-0 sm:max-w-[540px]">
          {drawerConceptId && (
            <ConceptDrawerContent key={drawerConceptId} conceptId={drawerConceptId} onClose={() => setDrawerConceptId(null)} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── data hook ────────────────────────────────────────────────────────────────

function useConcept(conceptId: string) {
  const [concept, setConcept] = useState<ConceptInspector | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setConcept(null);
    api
      .getConcept(conceptId)
      .then((c) => {
        if (!cancelled) setConcept(c);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load concept");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [conceptId]);

  return { concept, loading };
}

// ─── graph states ─────────────────────────────────────────────────────────────

function GraphLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
      <Loader2 className="size-6 animate-spin text-violet" />
      <span className="text-sm">Loading knowledge graph…</span>
    </div>
  );
}

function GraphEmpty({ onBuild, building }: { onBuild: () => void; building: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
        <Network className="size-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">No knowledge graph yet</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Build your knowledge graph to discover how concepts across your indexed documents
        connect. This runs the LLM over your documents and may take a while.
      </p>
      <Button className="mt-6 gap-2" onClick={onBuild} disabled={building}>
        {building ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {building ? "Building knowledge graph…" : "Build knowledge graph"}
      </Button>
      {building && (
        <p className="mt-3 text-xs text-muted-foreground">
          Extracting concepts and relationships — this can take a minute or two.
        </p>
      )}
    </div>
  );
}

// ─── graph canvas ─────────────────────────────────────────────────────────────

function GraphCanvas({
  nodes: sourceNodes,
  edges: sourceEdges,
  selectedId,
  searchQuery,
  activeFilters,
  activeCollection,
  onNodeClick,
  onNodeDoubleClick,
  onPaneClick,
}: {
  nodes: Node<ConceptData>[];
  edges: Edge[];
  selectedId: string | null;
  searchQuery: string;
  activeFilters: string[];
  activeCollection: string | null;
  onNodeClick: (id: string) => void;
  onNodeDoubleClick: (id: string) => void;
  onPaneClick: () => void;
}) {
  const q = searchQuery.toLowerCase().trim();

  const styledNodes = useMemo(
    () =>
      sourceNodes.map((n) => {
        const cluster = n.data.cluster as string;

        // Search match: dim if query doesn't match label
        const searchMatch = !q || n.data.label.toLowerCase().includes(q);

        // Collection filter: dim if a specific collection is active and this node isn't in it
        const collectionMatch = !activeCollection || `col-${cluster}` === activeCollection;

        // Source type filter: dim if this node's mapped source type is unchecked
        const nodeSourceType = CLUSTER_SOURCE[cluster];
        const sourceMatch = !nodeSourceType || activeFilters.includes(nodeSourceType);

        const visible = searchMatch && collectionMatch && sourceMatch;

        return {
          ...n,
          selected: n.id === selectedId,
          style: { opacity: visible ? 1 : 0.12, transition: "opacity 0.2s" },
        };
      }),
    [sourceNodes, selectedId, q, activeFilters, activeCollection],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(styledNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sourceEdges);

  // keep ReactFlow's internal state in sync when graph/selection/search change
  useEffect(() => {
    setNodes(styledNodes);
  }, [styledNodes, setNodes]);
  useEffect(() => {
    setEdges(sourceEdges);
  }, [sourceEdges, setEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => onNodeClick(node.id),
    [onNodeClick],
  );
  const handleDblClick: NodeMouseHandler = useCallback(
    (_, node) => onNodeDoubleClick(node.id),
    [onNodeDoubleClick],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      onNodeDoubleClick={handleDblClick}
      onPaneClick={onPaneClick}
      fitView
      fitViewOptions={{ padding: 0.22 }}
      proOptions={{ hideAttribution: true }}
      minZoom={0.3}
      maxZoom={3}
      className="bg-background"
      defaultEdgeOptions={{
        type: "smoothstep",
        style: { stroke: "#c8c2b5", strokeWidth: 1.5 },
      }}
    >
      <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#ddd8cc" />
      <Controls
        showInteractive={false}
        className="!border-border !bg-card [&_button]:!border-border [&_button]:!bg-card [&_button]:!fill-foreground [&_button:hover]:!bg-accent"
      />
    </ReactFlow>
  );
}

// ─── inspector content ────────────────────────────────────────────────────────

function InspectorContent({
  conceptId,
  onOpenDrawer,
}: {
  conceptId: string;
  onOpenDrawer: () => void;
}) {
  const { concept, loading } = useConcept(conceptId);
  const navigate = useNavigate();
  const [discoveries, setDiscoveries] = useState<string[] | null>(null);
  const [discovering, setDiscovering] = useState(false);
  // AI-action state lives in a global store so an in-flight action and its
  // result panel survive navigating away from the Knowledge page and back.
  const { running, runningConceptId, result, resultConceptId, clearResult, runAction } =
    useConceptActionStore();
  const showResult = result && resultConceptId === conceptId;

  const onDiscover = useCallback(async () => {
    setDiscovering(true);
    try {
      const list = await api.discoverConcepts(conceptId);
      setDiscoveries(list);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to discover related concepts");
    } finally {
      setDiscovering(false);
    }
  }, [conceptId]);

  if (loading || !concept) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 pt-20 text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-violet" />
        <span className="text-sm">Loading concept…</span>
      </div>
    );
  }

  const ri = concept.referencedIn ?? {};
  const refInRows = [
    { label: "Documents", icon: FileText, count: ri.documents ?? 0 },
    { label: "Notebook Notes", icon: Notebook, count: ri.notes ?? 0 },
    { label: "Flashcards", icon: Layers, count: ri.flashcards ?? 0 },
    { label: "Quizzes", icon: ListChecks, count: ri.quizzes ?? 0 },
    { label: "Saved Answers", icon: Sparkles, count: ri.answers ?? 0 },
    { label: "Diagrams", icon: Workflow, count: ri.diagrams ?? 0 },
  ];

  const aiActions = [
    { label: "Explain Concept", icon: Sparkles },
    { label: "Generate Summary", icon: FileText },
    { label: "Generate Flashcards", icon: Layers },
    { label: "Generate Quiz", icon: ListChecks },
    { label: "Generate Diagram", icon: Workflow },
    { label: "Generate Mind Map", icon: Network },
    { label: "Add To Notebook", icon: Notebook },
  ];

  return (
    <div className="space-y-0 divide-y divide-border">
      {/* Concept header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl leading-tight">{concept.name}</h2>
          <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={onOpenDrawer}>
            <ExternalLink className="size-3.5" /> Full page
          </Button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{concept.description}</p>

        <div className="mt-4 flex gap-3">
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-center">
            <div className="font-display text-2xl leading-none">{(concept.confidence * 100).toFixed(0)}%</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</div>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-center">
            <div className="font-display text-2xl leading-none">{concept.refCount}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">References</div>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-center">
            <div className="font-display text-2xl leading-none">{concept.sourceCount}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Sources</div>
          </div>
        </div>
      </div>

      {/* Related concepts */}
      <div className="p-4">
        <InspectorBlock title="Related Concepts">
          <div className="flex flex-wrap gap-1.5">
            {concept.relatedConcepts.map((c) => (
              <span key={c} className="cursor-pointer rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-foreground/80 hover:border-violet/40 hover:text-violet">
                {c}
              </span>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* Referenced in */}
      <div className="p-4">
        <InspectorBlock title="Referenced In">
          <div className="space-y-1">
            {refInRows.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/50">
                <span className="flex items-center gap-2 text-sm text-foreground/80">
                  <r.icon className="size-3.5 text-muted-foreground" /> {r.label}
                </span>
                <Badge variant="outline" className="text-xs">{r.count}</Badge>
              </div>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* Citations */}
      <div className="p-4">
        <InspectorBlock title="Source Citations">
          <div className="space-y-2">
            {concept.citations.map((c, i) => (
              <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
                <div className="flex items-start gap-2">
                  <Quote className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{c.source}</div>
                    <div className="text-[11px] text-muted-foreground">{c.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* Generated assets */}
      <div className="p-4">
        <InspectorBlock title="Generated Assets">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Open Flashcards", icon: Layers, to: "/flashcards" },
              { label: "Open Quiz", icon: ListChecks, to: "/quiz" },
              { label: "Open Diagram", icon: Workflow, to: "/diagrams" },
              { label: "Open Mind Map", icon: Network, to: "/mindmaps" },
              { label: "Open Notebook", icon: Notebook, to: "/notebooks" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-[12px] font-medium text-foreground/80 transition-colors hover:border-violet/40 hover:text-violet"
              >
                <a.icon className="size-3.5" /> {a.label}
              </button>
            ))}
          </div>
        </InspectorBlock>
      </div>

      {/* AI Actions */}
      <div className="p-4">
        <InspectorBlock title="AI Actions">
          <div className="space-y-1">
            {aiActions.map((a) => {
              const isRunning = running === a.label && runningConceptId === conceptId;
              return (
                <button
                  key={a.label}
                  onClick={() => concept && runAction(concept, conceptId, a.label, navigate)}
                  disabled={running !== null}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                >
                  {isRunning ? (
                    <Loader2 className="size-4 animate-spin text-violet" />
                  ) : (
                    <a.icon className="size-4 text-violet" />
                  )}
                  {isRunning ? `${a.label}…` : a.label}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-xs font-medium">{result!.title}</span>
                  <button onClick={clearResult} className="text-muted-foreground hover:text-foreground">
                    <X className="size-3.5" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto p-3">
                  {result!.mono ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80">{result!.body}</pre>
                  ) : (
                    <MarkdownRenderer content={result!.body} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </InspectorBlock>
      </div>

      {/* Semantic discovery */}
      <div className="p-4">
        <Button
          onClick={onDiscover}
          variant="outline"
          disabled={discovering}
          className="w-full gap-2 border-violet/30 text-violet hover:bg-violet-soft"
        >
          {discovering ? <Loader2 className="size-4 animate-spin" /> : <Compass className="size-4" />}
          {discovering ? "Discovering…" : "Discover Related Concepts"}
        </Button>
        <AnimatePresence>
          {discoveries && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="size-3 text-violet" /> AI Suggestions
              </div>
              {discoveries.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">No related concepts found.</p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {discoveries.map((d) => (
                    <button
                      key={d}
                      className="rounded-full border border-violet/30 bg-violet-soft px-2.5 py-1 text-[11px] text-violet"
                    >
                      + {d}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyInspector() {
  return (
    <div className="flex flex-col items-center px-6 pt-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
        <Network className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold">Explore your knowledge base</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Click any concept in the graph to inspect its sources, references, and generated assets.
      </p>
      <Button
        variant="outline"
        className="mt-6 gap-2"
        onClick={() => toast.info("Browsing all concepts…")}
      >
        <Compass className="size-4" /> Browse Concepts
      </Button>
      <div className="mt-8 w-full rounded-xl border border-border bg-card p-4 text-left">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">How it works</div>
        <p className="mt-2 text-xs leading-relaxed text-foreground/80">
          ScholarAI automatically discovers relationships between concepts across your documents, notes, flashcards, quizzes and AI answers — building your personal knowledge graph.
        </p>
      </div>
    </div>
  );
}

// ─── concept drawer ───────────────────────────────────────────────────────────

function ConceptDrawerContent({ conceptId, onClose }: { conceptId: string; onClose: () => void }) {
  const { concept, loading } = useConcept(conceptId);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const addToNotebook = async () => {
    if (!concept || adding) return;
    setAdding(true);
    try {
      const ex = await api.ask(`Explain the concept: ${concept.name}`);
      const nb = await api.createNotebook(concept.name);
      await api.updateNotebook(nb.id, {
        blocks: [
          { type: "heading", level: 1, text: concept.name },
          { type: "ai-answer", question: `Explain ${concept.name}`, answer: ex.content, confidence: 1, sources: 0 },
        ],
      });
      toast.success("Added to notebook", { action: { label: "Open", onClick: () => navigate("/notebooks") } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to notebook");
    } finally {
      setAdding(false);
    }
  };

  if (loading || !concept) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-violet" />
        <span className="text-sm">Loading concept…</span>
      </div>
    );
  }

  const ri = concept.referencedIn ?? {};
  const refInRows = [
    { label: "Documents", icon: FileText, count: ri.documents ?? 0 },
    { label: "Notes", icon: Notebook, count: ri.notes ?? 0 },
    { label: "Flashcards", icon: Layers, count: ri.flashcards ?? 0 },
    { label: "Quizzes", icon: ListChecks, count: ri.quizzes ?? 0 },
    { label: "Answers", icon: Sparkles, count: ri.answers ?? 0 },
    { label: "Diagrams", icon: Workflow, count: ri.diagrams ?? 0 },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Drawer header */}
      <SheetHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-muted-foreground">Concept</Badge>
              <Badge variant="outline" className="border-success/40 bg-success-soft text-[10px] text-success">
                <Gauge className="mr-1 size-2.5" /> {(concept.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
            <SheetTitle className="mt-1 font-display text-2xl">{concept.name}</SheetTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="size-4" /></Button>
        </div>
      </SheetHeader>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-8 px-6 py-6">
          {/* Definition */}
          <DrawerBlock title="Definition">
            <p className="font-reading text-[16px] leading-relaxed text-foreground/90">{concept.definition}</p>
          </DrawerBlock>

          {/* AI Summary */}
          <DrawerBlock title="AI Summary">
            <div className="rounded-xl border border-violet/25 bg-violet-soft/40 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet">
                <Sparkles className="size-3" /> ScholarAI
              </div>
              <p className="font-reading text-[15px] leading-relaxed text-foreground/90">{concept.aiSummary}</p>
            </div>
          </DrawerBlock>

          {/* Source References */}
          <DrawerBlock title="Source References">
            <div className="space-y-2">
              {concept.citations.map((c, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
                  <Quote className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{c.source}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{c.detail}</div>
                  </div>
                  <ExternalLink className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
                </div>
              ))}
            </div>
          </DrawerBlock>

          {/* Related Concepts */}
          <DrawerBlock title="Related Concepts">
            <div className="flex flex-wrap gap-2">
              {concept.relatedConcepts.map((c) => (
                <span key={c} className="cursor-pointer rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/80 hover:border-violet/40 hover:text-violet">
                  {c}
                </span>
              ))}
            </div>
          </DrawerBlock>

          {/* Referenced In */}
          <DrawerBlock title="Referenced In">
            <div className="grid grid-cols-2 gap-2">
              {refInRows.map((r) => (
                <div key={r.label} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
                  <r.icon className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="font-display text-lg leading-none">{r.count}</div>
                    <div className="text-[10px] text-muted-foreground">{r.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </DrawerBlock>

          {/* Generated Assets */}
          <DrawerBlock title="Generated Assets">
            <div className="space-y-1">
              {[
                { label: "Open Flashcard Deck", icon: Layers, onClick: () => navigate("/flashcards") },
                { label: "Open Quiz", icon: ListChecks, onClick: () => navigate("/quiz") },
                { label: "Open Diagram", icon: Workflow, onClick: () => navigate("/diagrams") },
                { label: "Open Mind Map", icon: Network, onClick: () => navigate("/mindmaps") },
                { label: "Add To Notebook", icon: Notebook, onClick: addToNotebook },
                { label: "View in Reading Mode", icon: BookOpen, onClick: () => navigate("/reading") },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  disabled={a.label === "Add To Notebook" && adding}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                >
                  {a.label === "Add To Notebook" && adding ? (
                    <Loader2 className="size-4 animate-spin text-violet" />
                  ) : (
                    <a.icon className="size-4 text-violet" />
                  )}
                  {a.label}
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </DrawerBlock>

          {/* Recent Activity */}
          <DrawerBlock title="Recent Activity">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between py-1">
                <span>Generated flashcard deck</span><span>2h ago</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Saved AI answer</span><span>Yesterday</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Added to Notebook</span><span>3d ago</span>
              </div>
            </div>
          </DrawerBlock>
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── small shared components ──────────────────────────────────────────────────

function SideSection({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="border-b border-border px-3 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      {children}
    </div>
  );
}

function InspectorBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function DrawerBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function LegendDot({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("shrink-0 rounded-full", cls)} />
      {label}
    </span>
  );
}
```

## File: src/app/pages/Notebooks.tsx
```typescript
import { useMemo, useEffect, useRef, useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Search,
  Hash,
  FolderClosed,
  Clock,
  Sparkles,
  FileText,
  ScrollText,
  Wand2,
  Layers,
  ListChecks,
  Workflow,
  Quote,
  Gauge,
  GripVertical,
  Lightbulb,
  Info,
  TriangleAlert,
  Check,
  BookOpen,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { cn } from "../components/ui/utils";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { DiagramViewer } from "../components/DiagramViewer";
import { SelectionToolbar } from "../components/SelectionToolbar";
import { type NotebookBlock } from "../lib/notebook-data";
import {
  api,
  type NotebookMeta,
  type NotebookFull,
  type Collection,
} from "../lib/api";
import type { Course } from "../lib/types";

// Deterministic default icon per notebook (no icon field on real notebooks).
const NOTEBOOK_ICONS = [
  BookOpen,
  FileText,
  Layers,
  ScrollText,
  Lightbulb,
] as const;
function iconFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return NOTEBOOK_ICONS[h % NOTEBOOK_ICONS.length];
}

const calloutMeta = {
  note: {
    icon: Info,
    cls: "border-border bg-muted/50 text-foreground",
    iconCls: "text-muted-foreground",
  },
  insight: {
    icon: Lightbulb,
    cls: "border-violet/30 bg-violet-soft text-foreground",
    iconCls: "text-violet",
  },
  warning: {
    icon: TriangleAlert,
    cls: "border-warning/30 bg-warning-soft text-foreground",
    iconCls: "text-warning",
  },
};

export function Notebooks() {
  const [list, setList] = useState<NotebookMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [active, setActive] = useState<NotebookFull | null>(null);
  const [blocks, setBlocks] = useState<NotebookBlock[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingNotebook, setLoadingNotebook] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assisting, setAssisting] = useState(false);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Block editing / drag-reorder state.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Dynamic sidebar sections (collections + tags).
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // New-notebook dialog state
  const [courses, setCourses] = useState<Course[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState<string>("none");
  const [creating, setCreating] = useState(false);

  // Fetch the dynamic sidebar sections (collections + tags). Called on mount
  // and again whenever a notebook is created so counts/tags stay fresh.
  function loadSidebar() {
    api
      .listNotebookCollections()
      .then(setCollections)
      .catch(() => setCollections([]));
    api
      .listNotebookTags()
      .then(setTags)
      .catch(() => setTags([]));
  }

  // Load the notebook list on mount.
  useEffect(() => {
    setLoadingList(true);
    api
      .listNotebooks()
      .then((nbs) => {
        setList(nbs);
        if (nbs.length > 0) setActiveId(nbs[0].id);
      })
      .catch((e) => toast.error(`Failed to load notebooks: ${e.message}`))
      .finally(() => setLoadingList(false));
    api
      .listCourses()
      .then(setCourses)
      .catch(() => setCourses([]));
    loadSidebar();
  }, []);

  // Load the selected notebook whenever the active id changes.
  useEffect(() => {
    if (!activeId) {
      setActive(null);
      setBlocks([]);
      return;
    }
    let cancelled = false;
    setLoadingNotebook(true);
    api
      .getNotebook(activeId)
      .then((nb) => {
        if (cancelled) return;
        setActive(nb);
        setBlocks((nb.blocks ?? []) as NotebookBlock[]);
      })
      .catch((e) => {
        if (!cancelled) toast.error(`Failed to open notebook: ${e.message}`);
      })
      .finally(() => {
        if (!cancelled) setLoadingNotebook(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  // Persist the given blocks for the active notebook, and reflect any
  // server-side metadata changes (e.g. updated timestamp / notes count).
  async function persistBlocks(next: NotebookBlock[]) {
    if (!activeId) return;
    setBlocks(next);
    setSaving(true);
    try {
      const updated = await api.updateNotebook(activeId, { blocks: next });
      setActive(updated);
      setList((prev) =>
        prev.map((n) =>
          n.id === activeId
            ? {
              ...n,
              notes: updated.blocks?.length ?? n.notes,
              lastEdited: "just now",
            }
            : n,
        ),
      );
    } catch (e: any) {
      toast.error(`Failed to save: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  // Append a fresh block of the given type and jump straight into editing it.
  function addBlock(block: NotebookBlock) {
    const next = [...blocks, block];
    persistBlocks(next);
    setEditingIndex(next.length - 1);
  }

  function updateBlock(index: number, patch: Partial<NotebookBlock>) {
    persistBlocks(
      blocks.map((b, i) =>
        i === index ? ({ ...b, ...patch } as NotebookBlock) : b,
      ),
    );
  }

  function deleteBlock(index: number) {
    if (editingIndex === index) setEditingIndex(null);
    persistBlocks(blocks.filter((_, i) => i !== index));
  }

  // Reorder via drag handle: pull `from` out, splice it back at `to`.
  function moveBlock(from: number, to: number) {
    if (from === to) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistBlocks(next);
  }

  async function handleCreate() {
    const title = newTitle.trim();
    if (!title) {
      toast.error("Enter a notebook title");
      return;
    }
    setCreating(true);
    try {
      const nb = await api.createNotebook(
        title,
        newCourse === "none" ? null : newCourse,
      );
      const meta: NotebookMeta = {
        id: nb.id,
        name: nb.title,
        course: nb.course,
        color: nb.color,
        notes: nb.blocks?.length ?? 0,
        lastEdited: "just now",
      };
      setList((prev) => [meta, ...prev]);
      setActiveId(nb.id);
      setCreateOpen(false);
      setNewTitle("");
      setNewCourse("none");
      loadSidebar();
      toast.success(`Created “${nb.title}”`);
    } catch (e: any) {
      toast.error(`Failed to create notebook: ${e.message}`);
    } finally {
      setCreating(false);
    }
  }

  // AI assist: run the action on the selected text, then insert the
  // returned markdown as a new ai-answer block and persist.
  async function runAssist(
    action: "explain" | "summarize" | "improve",
    selected: string,
  ) {
    const sel = selected.trim();
    if (!sel) {
      toast.error("Select some text first");
      return;
    }
    if (!activeId || assisting) return;
    const labels: Record<typeof action, string> = {
      explain: "Explaining selection…",
      summarize: "Summarizing selection…",
      improve: "Improving selection…",
    };
    setAssisting(true);
    const toastId = toast.loading(labels[action]);
    try {
      const { text } = await api.notebookAssist(
        action,
        sel,
        active?.course ?? null,
      );
      const block: NotebookBlock = {
        type: "ai-answer",
        question: `${action[0].toUpperCase()}${action.slice(1)}: ${sel.slice(0, 80)}${sel.length > 80 ? "…" : ""}`,
        answer: text,
        confidence: 1,
        sources: 0,
      };
      await persistBlocks([...blocks, block]);
      toast.success("AI block added", { id: toastId });
    } catch (e: any) {
      toast.error(`AI assist failed: ${e.message}`, { id: toastId });
    } finally {
      setAssisting(false);
    }
  }

  const actions = [
    {
      label: "Explain",
      icon: Wand2,
      onSelect: (text: string) => runAssist("explain", text),
    },
    {
      label: "Summarize",
      icon: ScrollText,
      onSelect: (text: string) => runAssist("summarize", text),
    },
    {
      label: "Improve",
      icon: Sparkles,
      onSelect: (text: string) => runAssist("improve", text),
    },
    {
      label: "Cite",
      icon: Quote,
      onSelect: () => toast.success("Citation saved"),
    },
  ];

  const activeMeta = list.find((n) => n.id === activeId);

  // Recent notes derived from the already-loaded notebook list (list is kept
  // in recency order — newly created notebooks are prepended).
  const recentNotes = list.slice(0, 5).map((n) => ({
    id: n.id,
    title: n.name,
    notebook: n.course || "Notebook",
  }));

  const dynamicInspector = useMemo(() => {
    if (!active) return null;

    let wordCount = 0;
    let aiCount = 0;
    let diagramCount = 0;
    let flashcardCount = 0;
    let quizCount = 0;

    (blocks || []).forEach((b: any) => {
      if (!b) return;
      if (b.type === "text" || b.type === "heading" || b.type === "callout") {
        wordCount += (b.text || "").split(/\s+/).length;
      } else if (b.type === "ai-answer") {
        wordCount += (b.answer || "").split(/\s+/).length;
        aiCount++;
      } else if (b.type === "mermaid") {
        diagramCount++;
      } else if (b.type === "flashdeck") {
        flashcardCount += b.count || 0;
      } else if (b.type === "quiz-results") {
        quizCount++;
      }
    });

    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const generatedAssets = [
      { label: "AI Answers", count: aiCount },
      { label: "Diagrams", count: diagramCount },
      { label: "Flashcards", count: flashcardCount },
      { label: "Quizzes", count: quizCount },
    ].filter((a) => a.count > 0);

    return {
      details: {
        notebook: activeMeta?.name ?? active.title,
        type: active.course || "General Note",
        created: active.updated || "Unknown",
      },
      wordCount,
      readingTime: `${readingTime} min`,
      linkedSources: [] as string[],
      generatedAssets,
      relatedTopics: [] as string[],
      revisionStatus: "In progress",
    };
  }, [active, activeMeta, blocks]);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left — Notebooks */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 transition-all duration-300 lg:flex",
          leftCollapsed ? "w-0 border-r-0" : "w-[280px]",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notebooks
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setLeftCollapsed(true)}
            >
              <PanelLeftClose className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes…"
              className="h-8 bg-input-background pl-8 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1 p-2">
          {loadingList ? (
            <div className="flex items-center gap-2 px-2.5 py-3 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Loading notebooks…
            </div>
          ) : list.length === 0 ? (
            <button
              onClick={() => setCreateOpen(true)}
              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-2.5 py-3 text-left text-xs text-muted-foreground hover:border-violet/50 hover:text-violet"
            >
              <Plus className="size-3.5" /> Create your first notebook
            </button>
          ) : (
            list.map((n) => {
              const Icon = iconFor(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => setActiveId(n.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                    activeId === n.id ? "bg-accent" : "hover:bg-accent/50",
                  )}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-background/50">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{n.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {n.notes} notes · {n.lastEdited}
                    </div>
                  </div>
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: n.color }}
                  />
                </button>
              );
            })
          )}
        </div>

        <Section label="Collections" icon={FolderClosed}>
          {collections.length === 0 ? (
            <div className="px-2.5 py-1.5 text-xs text-muted-foreground">
              No collections
            </div>
          ) : (
            collections.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50"
              >
                <span className="truncate">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.count}</span>
              </div>
            ))
          )}
        </Section>

        <Section label="Tags" icon={Hash}>
          {tags.length === 0 ? (
            <div className="px-2.5 py-1.5 text-xs text-muted-foreground">
              No tags
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 px-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </Section>

        <Section label="Recent" icon={Clock}>
          {recentNotes.length === 0 ? (
            <div className="px-2.5 py-1.5 text-xs text-muted-foreground">
              No recent notes
            </div>
          ) : (
            recentNotes.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent/50"
              >
                <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{r.title}</span>
              </div>
            ))
          )}
        </Section>
      </aside>

      {/* Center — Content */}
      <main className="relative min-w-0 flex-1 overflow-y-auto">
        <SelectionToolbar containerRef={contentRef} actions={actions} />

        {/* Sidebar Toggles */}
        <div className="pointer-events-none absolute left-0 top-4 z-10 flex w-full justify-between px-4">
          <div className="pointer-events-auto">
            {leftCollapsed && (
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-full bg-card/80 backdrop-blur shadow-sm"
                onClick={() => setLeftCollapsed(false)}
              >
                <PanelLeftOpen className="size-4" />
              </Button>
            )}
          </div>
          <div className="pointer-events-auto">
            {rightCollapsed && (
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-full bg-card/80 backdrop-blur shadow-sm"
                onClick={() => setRightCollapsed(false)}
              >
                <PanelRightOpen className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div ref={contentRef} className="mx-auto max-w-[900px] px-10 py-12">
          {loadingNotebook ? (
            <div className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading notebook…
            </div>
          ) : !active ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center text-muted-foreground">
              <BookOpen className="size-10 opacity-40" />
              <div>
                <div className="text-base font-medium text-foreground">
                  No notebook selected
                </div>
                <p className="mt-1 text-sm">
                  Pick a notebook from the sidebar or create a new one.
                </p>
              </div>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 size-4" /> New notebook
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>
                  {activeMeta?.name ?? active.title} · {active.updated}
                </span>
                {saving && <Loader2 className="size-3 animate-spin" />}
              </div>
              <h1 className="mt-3 text-[2.75rem] leading-[1.1]">
                {active.title}
              </h1>
              {active.subtitle && (
                <p className="mt-3 font-reading text-lg italic text-muted-foreground">
                  {active.subtitle}
                </p>
              )}

              <div className="mt-8 space-y-5">
                {blocks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                    This notebook is empty. Add a block below, or select text
                    elsewhere and use AI assist.
                  </div>
                )}

                {blocks.map((block, i) => (
                  <BlockView
                    key={i}
                    block={block}
                    index={i}
                    editing={editingIndex === i}
                    dragging={dragIndex === i}
                    dropTarget={
                      overIndex === i && dragIndex !== null && dragIndex !== i
                    }
                    onEdit={() => setEditingIndex(i)}
                    onSave={(patch) => {
                      updateBlock(i, patch);
                      setEditingIndex(null);
                    }}
                    onCancel={() => setEditingIndex(null)}
                    onDelete={() => deleteBlock(i)}
                    onDragStart={() => setDragIndex(i)}
                    onDragEnter={() => dragIndex !== null && setOverIndex(i)}
                    onDragEnd={() => {
                      if (dragIndex !== null && overIndex !== null)
                        moveBlock(dragIndex, overIndex);
                      setDragIndex(null);
                      setOverIndex(null);
                    }}
                  />
                ))}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group flex w-full items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-violet/50 hover:text-violet">
                      <Plus className="size-4" /> Add block
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[300px]">
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "text",
                          text: "New text block. Edit me!",
                        })
                      }
                    >
                      <FileText className="mr-2 size-4 text-muted-foreground" />{" "}
                      Text
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "heading",
                          level: 2,
                          text: "New Heading",
                        })
                      }
                    >
                      <Hash className="mr-2 size-4 text-muted-foreground" />{" "}
                      Heading
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "callout",
                          tone: "note",
                          text: "New note callout.",
                        })
                      }
                    >
                      <Info className="mr-2 size-4 text-muted-foreground" />{" "}
                      Callout
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "code",
                          lang: "python",
                          code: "print('Hello world')",
                        })
                      }
                    >
                      <Workflow className="mr-2 size-4 text-muted-foreground" />{" "}
                      Code
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "mermaid",
                          code: "graph TD\n  A[Start] --> B[End]",
                        })
                      }
                    >
                      <Workflow className="mr-2 size-4 text-muted-foreground" />{" "}
                      Diagram
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        addBlock({
                          type: "table",
                          headers: ["Column A", "Column B"],
                          rows: [["", ""]],
                        })
                      }
                    >
                      <Layers className="mr-2 size-4 text-muted-foreground" />{" "}
                      Table
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Right — Inspector */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col overflow-y-auto border-l border-border bg-card/40 transition-all duration-300 xl:flex",
          rightCollapsed ? "w-0 border-l-0" : "w-[300px]",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setRightCollapsed(true)}
          >
            <PanelRightClose className="size-4" />
          </Button>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Inspector
          </span>
          <div className="size-7" /> {/* spacer */}
        </div>

        {dynamicInspector ? (
          <div className="space-y-5 p-4">
            <InspectorBlock title="Notebook Details">
              <MetaRow k="Notebook" v={dynamicInspector.details.notebook} />
              <MetaRow k="Course" v={dynamicInspector.details.type} />
              <MetaRow k="Updated" v={dynamicInspector.details.created} />
            </InspectorBlock>

            <div className="grid grid-cols-2 gap-2">
              <Stat label="Words" value={dynamicInspector.wordCount} />
              <Stat label="Reading" value={dynamicInspector.readingTime} />
            </div>

            {dynamicInspector.linkedSources.length > 0 && (
              <InspectorBlock title="Linked Sources">
                {dynamicInspector.linkedSources.map((s) => (
                  <div
                    key={s}
                    className="flex items-start gap-2 py-1 text-sm text-foreground/80"
                  >
                    <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <span className="leading-snug">{s}</span>
                  </div>
                ))}
              </InspectorBlock>
            )}

            {dynamicInspector.generatedAssets.length > 0 && (
              <InspectorBlock title="Generated Assets">
                <div className="grid grid-cols-2 gap-2">
                  {dynamicInspector.generatedAssets.map((a) => (
                    <div
                      key={a.label}
                      className="rounded-lg border border-border bg-card px-3 py-2"
                    >
                      <div className="font-display text-xl leading-none">
                        {a.count}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {a.label}
                      </div>
                    </div>
                  ))}
                </div>
              </InspectorBlock>
            )}

            {dynamicInspector.relatedTopics.length > 0 && (
              <InspectorBlock title="Related Topics">
                <div className="flex flex-wrap gap-1.5">
                  {dynamicInspector.relatedTopics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </InspectorBlock>
            )}

            <InspectorBlock title="Revision Status">
              <Badge
                variant="outline"
                className="gap-1.5 border-warning/40 bg-warning-soft text-warning"
              >
                <Gauge className="size-3" /> {dynamicInspector.revisionStatus}
              </Badge>
            </InspectorBlock>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground mt-10">
            <Info className="size-8 opacity-20 mb-3" />
            <p className="text-sm">Select a notebook to view its details.</p>
          </div>
        )}
      </aside>

      {/* New notebook dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New notebook</DialogTitle>
            <DialogDescription>
              Give your notebook a title and optionally link a course.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Title
              </label>
              <Input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !creating) handleCreate();
                }}
                placeholder="e.g. Machine Learning"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Course (optional)
              </label>
              <Select value={newCourse} onValueChange={setNewCourse}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No course</SelectItem>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !newTitle.trim()}
            >
              {creating && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// A block in the document: hover reveals a drag handle (reorder), edit and
// delete controls. Clicking edit swaps the rendered block for an inline editor.
function BlockView({
  block,
  index,
  editing,
  dragging,
  dropTarget,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  block: NotebookBlock;
  index: number;
  editing: boolean;
  dragging: boolean;
  dropTarget: boolean;
  onEdit: () => void;
  onSave: (patch: Partial<NotebookBlock>) => void;
  onCancel: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
}) {
  const editable = EDITABLE_TYPES.has(block.type);
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      className={cn(
        "group/block relative -mx-3 rounded-lg px-3 py-1 transition-colors hover:bg-accent/20",
        dragging && "opacity-40",
        dropTarget &&
        "before:absolute before:-top-1 before:left-3 before:right-3 before:h-0.5 before:rounded-full before:bg-violet",
      )}
    >
      {!editing && (
        <div className="absolute -left-3 top-2 flex items-center opacity-0 transition-opacity group-hover/block:opacity-100">
          <span
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="size-4 text-muted-foreground" />
          </span>
        </div>
      )}

      {!editing && (
        <div className="absolute -top-1 right-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/block:opacity-100">
          {editable && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 bg-card/80 backdrop-blur"
              onClick={onEdit}
              title="Edit"
            >
              <Wand2 className="size-3.5 text-muted-foreground" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-6 bg-card/80 backdrop-blur hover:text-destructive"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      )}

      {editing ? (
        <BlockEditor block={block} onSave={onSave} onCancel={onCancel} />
      ) : (
        <BlockInner block={block} />
      )}
    </div>
  );
}

const EDITABLE_TYPES = new Set([
  "heading",
  "text",
  "callout",
  "code",
  "mermaid",
  "ai-answer",
]);

// Inline editor for the common authorable block types. Commits a typed patch
// back to the parent on save.
function BlockEditor({
  block,
  onSave,
  onCancel,
}: {
  block: NotebookBlock;
  onSave: (patch: Partial<NotebookBlock>) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<NotebookBlock>(block);
  const d = draft as any;

  const field = (patch: Record<string, unknown>) =>
    setDraft({ ...d, ...patch } as NotebookBlock);

  return (
    <div className="space-y-3 rounded-xl border border-violet/40 bg-card/60 p-4">
      {draft.type === "heading" && (
        <>
          <div className="flex gap-1.5">
            {[1, 2].map((lvl) => (
              <button
                key={lvl}
                onClick={() => field({ level: lvl })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs",
                  d.level === lvl
                    ? "border-violet bg-violet-soft text-violet"
                    : "border-border text-muted-foreground",
                )}
              >
                H{lvl}
              </button>
            ))}
          </div>
          <Input
            value={d.text}
            onChange={(e) => field({ text: e.target.value })}
            placeholder="Heading text"
            autoFocus
          />
        </>
      )}

      {draft.type === "text" && (
        <textarea
          value={d.text}
          onChange={(e) => field({ text: e.target.value })}
          placeholder="Write markdown…"
          autoFocus
          rows={5}
          className="w-full resize-y rounded-lg border border-border bg-input-background p-3 font-reading text-sm leading-relaxed outline-none focus:border-violet"
        />
      )}

      {draft.type === "callout" && (
        <>
          <div className="flex gap-1.5">
            {(["note", "insight", "warning"] as const).map((tone) => (
              <button
                key={tone}
                onClick={() => field({ tone })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs capitalize",
                  d.tone === tone
                    ? "border-violet bg-violet-soft text-violet"
                    : "border-border text-muted-foreground",
                )}
              >
                {tone}
              </button>
            ))}
          </div>
          <textarea
            value={d.text}
            onChange={(e) => field({ text: e.target.value })}
            placeholder="Callout text"
            autoFocus
            rows={3}
            className="w-full resize-y rounded-lg border border-border bg-input-background p-3 text-sm outline-none focus:border-violet"
          />
        </>
      )}

      {draft.type === "code" && (
        <>
          <Input
            value={d.lang}
            onChange={(e) => field({ lang: e.target.value })}
            placeholder="Language (e.g. python)"
            className="h-8 max-w-[200px] text-xs"
          />
          <textarea
            value={d.code}
            onChange={(e) => field({ code: e.target.value })}
            placeholder="Code…"
            autoFocus
            rows={6}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-border bg-secondary p-3 font-mono text-[13px] leading-relaxed outline-none focus:border-violet"
          />
        </>
      )}

      {draft.type === "mermaid" && (
        <textarea
          value={d.code}
          onChange={(e) => field({ code: e.target.value })}
          placeholder="Mermaid graph definition…"
          autoFocus
          rows={6}
          spellCheck={false}
          className="w-full resize-y rounded-lg border border-border bg-secondary p-3 font-mono text-[13px] leading-relaxed outline-none focus:border-violet"
        />
      )}

      {draft.type === "ai-answer" && (
        <>
          <Input
            value={d.question}
            onChange={(e) => field({ question: e.target.value })}
            placeholder="Question / prompt"
            autoFocus
          />
          <textarea
            value={d.answer}
            onChange={(e) => field({ answer: e.target.value })}
            placeholder="Answer (markdown)"
            rows={5}
            className="w-full resize-y rounded-lg border border-border bg-input-background p-3 text-sm leading-relaxed outline-none focus:border-violet"
          />
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => onSave(draft)}>
          <Check className="mr-1.5 size-3.5" /> Save
        </Button>
      </div>
    </div>
  );
}

function BlockInner({ block }: { block: NotebookBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 1 ? (
        <h1 className="mt-4 text-3xl">{block.text}</h1>
      ) : (
        <h2 className="mt-4">{block.text}</h2>
      );
    case "text":
      return <MarkdownRenderer content={block.text} />;
    case "callout": {
      const m = calloutMeta[block.tone];
      return (
        <div className={cn("flex gap-3 rounded-xl border p-4", m.cls)}>
          <m.icon className={cn("mt-0.5 size-5 shrink-0", m.iconCls)} />
          <div className="font-reading leading-relaxed">{block.text}</div>
        </div>
      );
    }
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4">
          <code className="font-mono text-[13px] leading-relaxed text-foreground/90">
            {block.code}
          </code>
        </pre>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/60">
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="border-b border-border px-4 py-2.5 text-left font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border-b border-border/60 px-4 py-2.5 text-foreground/80"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "ai-answer":
      return (
        <div className="overflow-hidden rounded-xl border border-violet/25 bg-violet-soft/40">
          <div className="flex items-center justify-between border-b border-violet/15 px-4 py-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet">
              <Sparkles className="size-3.5" /> Saved AI Answer
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="size-3" /> {(block.confidence * 100).toFixed(0)}
              % · {block.sources} sources
            </span>
          </div>
          <div className="px-4 pb-3 pt-3">
            <div className="mb-2 font-reading text-base font-medium italic text-foreground">
              {block.question}
            </div>
            <MarkdownRenderer content={block.answer} />
          </div>
        </div>
      );
    case "mermaid":
      return (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Workflow className="size-3.5" /> Diagram
          </div>
          <DiagramViewer code={block.code} />
        </div>
      );
    case "flashdeck":
      return (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Layers className="size-4 text-violet" /> {block.name}
            </span>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {block.count} cards
            </Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {block.cards.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-background/50 p-3"
              >
                <div className="font-reading text-sm leading-snug">
                  {c.front}
                </div>
                <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
                  {c.back}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "quiz-results": {
      const pct = Math.round((block.score / block.total) * 100);
      return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-success-soft text-success">
            <span className="font-display text-xl leading-none">{pct}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ListChecks className="size-4 text-success" /> {block.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Scored {block.score} of {block.total} · embedded quiz result
            </div>
          </div>
          <Check className="size-5 text-success" />
        </div>
      );
    }
    default:
      return null;
  }
}

function Section({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof Hash;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border px-2 py-3">
      <div className="flex items-center gap-1.5 px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      {children}
    </div>
  );
}

function InspectorBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="font-display text-2xl leading-none">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
```

## File: src/app/pages/Courses.tsx
```typescript
import { useEffect, useState } from "react";
import { FolderOpen, Plus, Search, Trash2, Pencil, Check, X } from "lucide-react";
import { Page } from "../components/Page";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { api } from "../lib/api";
import type { Course } from "../lib/types";

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [creating, setCreating] = useState(false);

  const loadCourses = () => api.listCourses().then(setCourses).catch(() => {});
  useEffect(() => { loadCourses(); }, []);

  const handleCreate = async () => {
    if (!newCourseName.trim()) return;
    try {
      await api.createCourse(newCourseName);
      setNewCourseName("");
      setCreating(false);
      loadCourses();
    } catch {}
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await api.updateCourse(id, editName);
      setEditingId(null);
      loadCourses();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.deleteCourse(id);
      loadCourses();
    } catch {}
  };

  const filtered = courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Page className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your subjects, modules, and collections.</p>
        </div>
        <Button onClick={() => setCreating(true)}><Plus className="size-4 mr-2" /> New Course</Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      {creating && (
        <div className="mb-6 rounded-2xl border border-violet/30 bg-violet-soft/20 p-5 flex items-center gap-3 shadow-sm">
          <div className="size-10 rounded-xl bg-violet-soft flex items-center justify-center shrink-0">
            <FolderOpen className="size-5 text-violet" />
          </div>
          <Input 
            placeholder="Course name (e.g. Machine Learning)" 
            value={newCourseName} 
            onChange={e => setNewCourseName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleCreate(); }}
            autoFocus
            className="flex-1 bg-card border-border h-10"
          />
          <Button onClick={handleCreate} disabled={!newCourseName.trim()}>Create</Button>
          <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => (
          <div key={c.id} className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
            {editingId === c.id ? (
              <div className="flex flex-col gap-3 h-full">
                <Input 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)} 
                  onKeyDown={e => { if (e.key === "Enter") handleUpdate(c.id); }} 
                  autoFocus 
                  className="h-9 bg-input-background" 
                />
                <div className="flex items-center gap-2 justify-end mt-auto pt-4">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="size-3.5 mr-1" /> Cancel</Button>
                  <Button size="sm" onClick={() => handleUpdate(c.id)}><Check className="size-3.5 mr-1" /> Save</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                      <FolderOpen className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base line-clamp-1" title={c.name}>{c.name}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="size-7 hover:bg-accent" onClick={() => { setEditingId(c.id); setEditName(c.name); }}>
                      <Pencil className="size-3.5 text-muted-foreground" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-border/50">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xl font-display leading-none">{c.documents}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Documents</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xl font-display leading-none">{c.flashcards}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Cards</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {!creating && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-accent mb-4">
            <FolderOpen className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No courses found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm mx-auto">Create a new course to start organizing your documents and study materials.</p>
          <Button onClick={() => setCreating(true)} className="mt-6">
            <Plus className="size-4 mr-2" /> Create First Course
          </Button>
        </div>
      )}
    </Page>
  );
}
```

## File: src/app/pages/PromptLibrary.tsx
```typescript
import { useEffect, useState } from "react";
import { BookMarked, Check, Plus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../lib/api";
import type { PromptItem } from "../lib/types";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";

const STYLE_BADGE: Record<string, string> = {
  Concise: "bg-cyan-soft text-cyan",
  Comprehensive: "bg-violet-soft text-violet",
  Socratic: "bg-warning-soft text-warning",
  "": "bg-muted text-muted-foreground",
};

export function PromptLibrary() {
  const [categories, setCategories] = useState<{ key: string; label: string; description: string }[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selected, setSelected] = useState<PromptItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", style: "", body: "" });

  useEffect(() => {
    api.listPromptCategories().then((cs) => {
      setCategories(cs);
      if (cs.length) setActiveCategory(cs[0].key);
    });
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    api.listPrompts(activeCategory).then((ps) => {
      setPrompts(ps);
      setSelected(ps.find((p) => p.active) ?? ps[0] ?? null);
    });
  }, [activeCategory]);

  async function activate(p: PromptItem) {
    await api.activatePrompt(p.id);
    setPrompts((prev) => prev.map((x) => ({ ...x, active: x.id === p.id })));
    setSelected({ ...p, active: true });
    toast.success(`"${p.name}" activated`);
  }

  async function remove(p: PromptItem) {
    await api.deletePrompt(p.id);
    const next = prompts.filter((x) => x.id !== p.id);
    setPrompts(next);
    if (selected?.id === p.id) setSelected(next[0] ?? null);
    toast.success("Prompt deleted");
  }

  async function save() {
    if (!form.name.trim() || !form.body.trim()) return;
    const created = await api.createPrompt({ category: activeCategory, ...form });
    setPrompts((prev) => [...prev, created]);
    setSelected(created);
    setCreating(false);
    setForm({ name: "", style: "", body: "" });
    toast.success("Prompt created");
  }

  const visible = prompts.filter((p) => p.category === activeCategory);
  const cat = categories.find((c) => c.key === activeCategory);

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left: category tabs + prompt list ───────────────────────── */}
      <div className="flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BookMarked className="size-4 text-violet" />
            Prompt Library
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Customise AI generation</p>
        </div>

        {/* category list */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                activeCategory === c.key
                  ? "bg-sidebar-accent text-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Middle: prompt list ──────────────────────────────────────── */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card/50">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-medium text-foreground">{cat?.label}</span>
          <button
            onClick={() => { setCreating(true); setSelected(null); }}
            className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-3" /> New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {visible.map((p) => (
            <motion.button
              key={p.id}
              layout
              onClick={() => { setSelected(p); setCreating(false); }}
              className={cn(
                "group w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                selected?.id === p.id
                  ? "bg-sidebar-accent"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
                    {p.active && <Check className="size-3 shrink-0 text-success" />}
                    <span className="truncate">{p.name}</span>
                  </div>
                  {p.style && (
                    <span className={cn("mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium", STYLE_BADGE[p.style] ?? STYLE_BADGE[""])}>
                      {p.style}
                    </span>
                  )}
                </div>
                {!p.built_in && selected?.id === p.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(p); }}
                    className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Right: editor / viewer ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {creating ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col p-6 gap-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">New Prompt — {cat?.label}</h2>
                <button onClick={() => setCreating(false)} className="rounded p-1 hover:bg-muted">
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="My custom prompt"
                    className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Style tag (optional)</label>
                  <input
                    value={form.style}
                    onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))}
                    placeholder="e.g. Concise"
                    className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">System prompt</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    rows={14}
                    placeholder="You are a..."
                    className="mt-1 w-full resize-none rounded-md border border-border bg-input px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={save}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col p-6 gap-4 overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
                    {selected.style && (
                      <span className={cn("rounded px-2 py-0.5 text-[11px] font-medium", STYLE_BADGE[selected.style] ?? STYLE_BADGE[""])}>
                        {selected.style}
                      </span>
                    )}
                    {selected.built_in && (
                      <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">Built-in</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{cat?.description}</p>
                </div>
                {!selected.active && (
                  <button
                    onClick={() => activate(selected)}
                    className="shrink-0 flex items-center gap-1.5 rounded-md bg-violet px-3 py-1.5 text-xs font-medium text-white hover:bg-violet/90"
                  >
                    <Check className="size-3" /> Activate
                  </button>
                )}
                {selected.active && (
                  <span className="flex items-center gap-1.5 rounded-md bg-success-soft px-3 py-1.5 text-xs font-medium text-success">
                    <Check className="size-3" /> Active
                  </span>
                )}
              </div>

              <pre className="flex-1 overflow-y-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {selected.body}
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-1 items-center justify-center text-muted-foreground text-sm"
            >
              Select a prompt to preview
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

## File: src/app/pages/MindMaps.tsx
```typescript
import { useEffect, useMemo, useState } from "react";
import { Network, Sparkles, Loader2, Trash2 } from "lucide-react";
import { GenerationSteps } from "../components/GenerationSteps";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api, type GeneratedMindmap } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";
import { useMindmapStore, ALL_COURSES } from "../stores/useMindmapStore";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { MindMapTree, parseMindmapText, countNodes } from "../components/MindMapTree";

export function MindMaps() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [items, setItems] = useState<GeneratedMindmap[]>([]);
  const [active, setActive] = useState<GeneratedMindmap | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const { topic, course, document, loading, mindmap, setField, generate } = useMindmapStore();
  const setCourse = (v: string) => setField("course", v);
  const setDocument = (v: string | null) => setField("document", v);
  const setTopic = (v: string) => setField("topic", v);

  // Absorb a newly generated mindmap into the sidebar list and select it.
  useEffect(() => {
    if (!mindmap) return;
    setItems((prev) => (prev.some((m) => m.id === mindmap.id) ? prev : [mindmap, ...prev]));
    setActive(mindmap);
  }, [mindmap]);

  useEffect(() => {
    let cancelled = false;
    api
      .listCourses()
      .then((cs) => { if (!cancelled) setCourses(cs); })
      .catch(() => {});
    api.listDocuments().then((ds) => { if (!cancelled) setDocuments(ds); }).catch(() => {});
    api
      .listMindmaps()
      .then((ms) => {
        if (cancelled) return;
        setItems(ms);
        setActive((cur) => cur ?? ms[0] ?? null);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const remove = async (id: string) => {
    try {
      await api.deleteMindmap(id);
      const next = items.filter((m) => m.id !== id);
      setItems(next);
      if (active?.id === id) setActive(next[0] ?? null);
      toast.success("Mind map deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete mind map");
    }
  };

  const tree = useMemo(
    () => (active?.text ? parseMindmapText(active.text) : []),
    [active],
  );
  const nodeCount = useMemo(() => countNodes(tree), [tree]);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="border-b border-border px-4 py-3 text-sm font-medium">
          Mind Maps
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {loading && (
              <div className="flex w-full items-center gap-3 rounded-lg border border-dashed border-violet/40 bg-violet-soft/40 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-violet">
                  <Loader2 className="size-4 animate-spin" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{topic.trim() || "Generating…"}</div>
                  <div className="truncate text-xs text-muted-foreground">Generating…</div>
                </div>
              </div>
            )}
            {items.length === 0 && !loading && (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                No mind maps yet. Generate one to get started.
              </div>
            )}
            {items.map((m) => (
              <div
                key={m.id}
                onClick={() => setActive(m)}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors",
                  active?.id === m.id ? "bg-violet-soft" : "hover:bg-accent/40",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    active?.id === m.id ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Network className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{m.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.course}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground opacity-0 hover:text-danger group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    void remove(m.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main panel */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Generate controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card/40 px-6 py-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !loading) generate(); }}
            placeholder="Topic to map…"
            className="h-9 max-w-xs flex-1 bg-input-background"
            disabled={loading}
          />
          <Select value={course} onValueChange={setCourse} disabled={loading}>
            <SelectTrigger className="h-9 w-48 bg-input-background">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_COURSES}>All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={document ?? "all"} onValueChange={(v) => setDocument(v === "all" ? null : v)} disabled={loading}>
            <SelectTrigger className="h-9 w-48 bg-input-background">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents.filter(d => course !== ALL_COURSES ? d.course === course : true).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={generate} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>

        <GenerationSteps
          steps={["Searching your library", "Mapping concepts", "Building hierarchy", "Assembling tree"]}
          loading={loading}
          className="border-b border-border px-6 py-3"
          interval={2000}
        />

        {/* Tree viewer */}
        {active ? (
          <>
            <div className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
              <Network className="size-4 text-primary" />
              <span className="text-sm font-medium">{active.title}</span>
              <Badge variant="outline" className="border-cyan/40 bg-cyan-soft text-cyan">
                {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
              </Badge>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6">
                {active.course && (
                  <p className="mb-4 text-xs uppercase tracking-wide text-muted-foreground">
                    {active.course}
                  </p>
                )}
                <MindMapTree text={active.text} />
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
            <Network className="size-8 opacity-40" />
            <div>
              <p className="text-sm font-medium text-foreground">No mind map selected</p>
              <p className="mt-1 text-sm">
                Enter a topic and press Generate, or select one from the sidebar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## File: src/app/pages/PyqAnalysis.tsx
```typescript
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  RefreshCw,
  GraduationCap,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  ListChecks,
  NotebookPen,
  Search,
  AlertTriangle,
  Trash2,
  BookOpen,
  FileSearch,
  Columns2,
} from "lucide-react";
import { toast } from "sonner";
import { Page } from "../components/Page";
import { MetricCard } from "../components/MetricCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { api } from "../lib/api";
import type { PyqTopicFreq } from "../lib/api";
import type { Course } from "../lib/types";
import { usePyqStore } from "../stores/usePyqStore";
import { useExamStore } from "../stores/useExamStore";
import { useQuizStore } from "../stores/useQuizStore";
import { useRevisionStore } from "../stores/useRevisionStore";

const ACCENT = "#4f4d7a";

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "Increasing") return <TrendingUp className="size-3.5 text-success" />;
  if (trend === "Decreasing") return <TrendingDown className="size-3.5 text-danger" />;
  return <Minus className="size-3.5 text-muted-foreground" />;
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-warning" title={`${n}/5`}>
      {"★".repeat(n)}
      <span className="text-muted-foreground/30">{"★".repeat(Math.max(0, 5 - n))}</span>
    </span>
  );
}

function Accuracy({ value }: { value: number | null }) {
  if (value == null)
    return <span className="text-xs text-muted-foreground/60">Not practiced</span>;
  const tone = value >= 75 ? "text-success" : value >= 50 ? "text-warning" : "text-danger";
  return <span className={`font-medium ${tone}`}>{value}%</span>;
}

export function PyqAnalysis() {
  const navigate = useNavigate();
  const course = usePyqStore((s) => s.course);
  const analysis = usePyqStore((s) => s.analysis);
  const papers = usePyqStore((s) => s.papers);
  const loading = usePyqStore((s) => s.loading);
  const uploading = usePyqStore((s) => s.uploading);
  const selectCourse = usePyqStore((s) => s.selectCourse);
  const refresh = usePyqStore((s) => s.refresh);
  const uploadPaper = usePyqStore((s) => s.uploadPaper);
  const setField = usePyqStore((s) => s.setField);

  const [courses, setCourses] = useState<Course[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    api.listCourses().then((cs) => {
      if (!active) return;
      setCourses(cs);
      if (cs.length && !course) selectCourse(cs[0].name);
    }).catch(() => {});
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Generate-asset helpers (seed the target store, then navigate) ----
  const seedExam = () => {
    if (!analysis) return;
    const top = analysis.topicFrequency.slice(0, 5).map((t) => t.topic).join(", ");
    useExamStore.getState().reset();
    useExamStore.getState().setField("topic", top || course);
    useExamStore.getState().setField("course", course);
    useExamStore.getState().setField("pyqCourse", course);
    useExamStore.getState().setField("difficulty", analysis.summary.avgDifficulty || "Medium");
    useExamStore.getState().setField("types", ["mcq", "short"]);
    toast.message("Mock exam configured from PYQ trends", { description: "Press Generate to start." });
    navigate("/exam");
  };
  const genQuiz = (topic: string) => {
    useQuizStore.getState().setField("topic", topic);
    useQuizStore.getState().setField("course", course);
    navigate("/quiz");
  };
  const genRevision = (topic: string) => {
    useRevisionStore.getState().setField("topic", topic);
    useRevisionStore.getState().setField("course", course);
    navigate("/revision");
  };
  const genFlashcards = (topic: string) => {
    navigate(`/flashcards?topic=${encodeURIComponent(topic)}&course=${encodeURIComponent(course)}`);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPaper(file);
    e.target.value = "";
  };

  const hasData = !!analysis && analysis.totalQuestions > 0;

  return (
    <Page className="max-w-6xl">
      <input
        ref={fileInput}
        type="file"
        accept=".pdf,.md,.markdown,.txt"
        className="hidden"
        onChange={onUpload}
      />

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSearch className="size-5 text-violet" />
            <h1 className="text-3xl font-bold tracking-tight">PYQ Analysis</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Turn previous-year question papers into exam intelligence.
          </p>
          {hasData && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Analyzed: <b>{analysis!.papers}</b> papers</span>
              {analysis!.yearsLabel && <span>Years: <b>{analysis!.yearsLabel}</b></span>}
              <span>Questions: <b>{analysis!.totalQuestions}</b></span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={course} onValueChange={selectCourse}>
            <SelectTrigger className="w-44 bg-input-background">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refresh()} disabled={!course || loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => fileInput.current?.click()} disabled={!course || uploading}>
            <Upload className="size-4" /> {uploading ? "Analyzing…" : "Upload PYQ"}
          </Button>
          {hasData && (
            <Button size="sm" variant="secondary" onClick={seedExam}>
              <GraduationCap className="size-4" /> Generate Mock Exam
            </Button>
          )}
        </div>
      </div>

      {!course && (
        <p className="text-sm text-muted-foreground">Create a course first to analyze its papers.</p>
      )}

      {course && !hasData && !loading && <EmptyState onUpload={() => fileInput.current?.click()} />}

      {hasData && (
        <div className="space-y-8">
          <SummaryCards a={analysis!} />
          <div className="grid gap-6 lg:grid-cols-2">
            <TopicFrequency
              rows={analysis!.topicFrequency}
              onOpen={(t) => setField("selectedTopic", t)}
              onQuiz={genQuiz}
              onNotes={genRevision}
              onFlashcards={genFlashcards}
            />
            <QuestionPatterns />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <YearTimeline trends={analysis!.yearTrends} />
            <DifficultyDistribution dist={analysis!.difficulty} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <MarksDistribution dist={analysis!.marksDistribution} />
            <DifferenceSuggestions />
          </div>
          <RevisionRisk onExam={seedExam} onNotes={genRevision} onFlashcards={genFlashcards} />
          <ExamReadiness a={analysis!} />
          <QuestionExplorer />
          <PaperList papers={papers} />
        </div>
      )}

      <TopicDrawer onQuiz={genQuiz} onNotes={genRevision} onFlashcards={genFlashcards} onExam={seedExam} />
    </Page>
  );
}

/* ---------------- Empty state ---------------- */

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-border bg-card text-violet">
        <FileSearch className="size-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Upload Previous Year Question Papers</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        ScholarAI will analyze topic frequency, question patterns, difficulty trends, and revision
        priorities to create exam-aware study material.
      </p>
      <Button className="mt-5" onClick={onUpload}>
        <Upload className="size-4" /> Upload PYQs
      </Button>
    </div>
  );
}

/* ---------------- Summary cards ---------------- */

function SummaryCards({ a }: { a: NonNullable<ReturnType<typeof usePyqStore.getState>["analysis"]> }) {
  const s = a.summary;
  const cards = [
    { label: "Topics Identified", value: s.topicsIdentified ?? 0, icon: Layers },
    { label: "Recurring Topics", value: s.recurringTopics ?? 0, icon: RefreshCw },
    { label: "Question Types", value: s.questionTypes ?? 0, icon: ListChecks },
    { label: "Avg Difficulty", value: s.avgDifficulty ?? "—", icon: AlertTriangle },
    { label: "Coverage", value: `${s.coverage ?? 0}%`, icon: BookOpen },
    { label: "Exam Readiness", value: `${s.readiness ?? 0}%`, icon: GraduationCap },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <MetricCard key={c.label} label={c.label} value={c.value} icon={c.icon} accent={ACCENT} />
      ))}
    </div>
  );
}

/* ---------------- Topic frequency table ---------------- */

function TopicFrequency({
  rows,
  onOpen,
  onQuiz,
  onNotes,
  onFlashcards,
}: {
  rows: PyqTopicFreq[];
  onOpen: (t: string) => void;
  onQuiz: (t: string) => void;
  onNotes: (t: string) => void;
  onFlashcards: (t: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Topic Frequency
      </h3>
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 font-medium">Topic</th>
              <th className="py-2 font-medium">Occ.</th>
              <th className="py-2 font-medium">Trend</th>
              <th className="py-2 font-medium">Importance</th>
              <th className="py-2 font-medium">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.topic} className="border-b border-border/50 last:border-0">
                <td className="py-2">
                  <button className="text-left font-medium hover:text-violet" onClick={() => onOpen(r.topic)}>
                    {r.topic}
                  </button>
                </td>
                <td className="py-2">{r.occurrences}</td>
                <td className="py-2"><TrendIcon trend={r.trend} /></td>
                <td className="py-2"><Stars n={r.importance} /></td>
                <td className="py-2"><Accuracy value={r.accuracy} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------------- Question patterns ---------------- */

function QuestionPatterns() {
  const patterns = usePyqStore((s) => s.analysis?.patterns ?? []);
  const selected = usePyqStore((s) => s.selectedPattern);
  const setField = usePyqStore((s) => s.setField);
  const active = patterns.find((p) => p.type === selected);
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Question Patterns
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {patterns.map((p) => (
          <button
            key={p.type}
            onClick={() => setField("selectedPattern", selected === p.type ? null : p.type)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              selected === p.type ? "border-violet bg-violet-soft/40" : "border-border hover:border-foreground/20"
            }`}
          >
            <div className="font-display text-xl">{p.pct}%</div>
            <div className="text-xs text-muted-foreground">{p.label}</div>
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-4 space-y-2 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">Examples</p>
          {active.examples.map((ex, i) => (
            <p key={i} className="text-sm text-foreground/80">• {ex}</p>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Year timeline ---------------- */

function YearTimeline({ trends }: { trends: { topic: string; years: { year: number; count: number }[] }[] }) {
  const maxCount = useMemo(
    () => Math.max(1, ...trends.flatMap((t) => t.years.map((y) => y.count))),
    [trends],
  );
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Topic Trend Timeline
      </h3>
      {trends.length === 0 && <p className="text-sm text-muted-foreground">No year data in these papers.</p>}
      <div className="space-y-3">
        {trends.map((t) => (
          <div key={t.topic}>
            <div className="mb-1 text-sm font-medium">{t.topic}</div>
            <div className="flex items-end gap-2">
              {t.years.map((y) => (
                <div key={y.year} className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 rounded-t bg-violet/70"
                    style={{ height: `${8 + (y.count / maxCount) * 40}px` }}
                    title={`${y.count} question(s)`}
                  />
                  <span className="text-[10px] text-muted-foreground">{y.year}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Difficulty distribution ---------------- */

function DifficultyDistribution({ dist }: { dist: { level: string; count: number }[] }) {
  const total = Math.max(1, dist.reduce((a, d) => a + d.count, 0));
  const tone: Record<string, string> = { Easy: "bg-success", Medium: "bg-warning", Hard: "bg-danger" };
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Difficulty Distribution
      </h3>
      <div className="space-y-3">
        {dist.map((d) => (
          <div key={d.level}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{d.level}</span>
              <span className="text-muted-foreground">{d.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${tone[d.level] ?? "bg-violet"}`} style={{ width: `${(d.count / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Marks distribution ---------------- */

function MarksDistribution({ dist }: { dist: { marks: number; count: number }[] }) {
  const total = Math.max(1, dist.reduce((a, d) => a + d.count, 0));
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Marks Distribution
      </h3>
      {dist.length === 0 ? (
        <p className="text-sm text-muted-foreground">No marks data in these papers.</p>
      ) : (
        <div className="space-y-3">
          {dist.map((d) => (
            <div key={d.marks}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{d.marks} marks</span>
                <span className="text-muted-foreground">{d.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-violet/70" style={{ width: `${(d.count / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Difference suggestions ---------------- */

function DifferenceSuggestions() {
  const differences = usePyqStore((s) => s.differences);
  const navigate = useNavigate();
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Comparison Suggestions
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        Recurring "X vs Y" comparisons mined from past papers.
      </p>
      {differences.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comparison questions detected yet.</p>
      ) : (
        <div className="space-y-2">
          {differences.map((d, i) => (
            <button
              key={i}
              onClick={() => navigate(`/differences?a=${encodeURIComponent(d.a)}&b=${encodeURIComponent(d.b)}`)}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-border p-3 text-left hover:border-foreground/20"
              title={d.example}
            >
              <span className="text-sm">
                <b>{d.a}</b> <span className="text-muted-foreground">vs</span> <b>{d.b}</b>
              </span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                {d.count > 1 && <Badge variant="outline">{d.count}×</Badge>}
                <Columns2 className="size-4" />
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Revision risk ---------------- */

function RevisionRisk({
  onExam,
  onNotes,
  onFlashcards,
}: {
  onExam: () => void;
  onNotes: (t: string) => void;
  onFlashcards: (t: string) => void;
}) {
  const risk = usePyqStore((s) => s.analysis?.revisionRisk ?? []);
  const tone: Record<string, string> = {
    High: "border-danger/40 bg-danger/5",
    Medium: "border-warning/40 bg-warning/5",
    Low: "border-success/40 bg-success/5",
  };
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Revision Risk Dashboard
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        High frequency + low accuracy = high risk. Based on topics you've practiced.
      </p>
      {risk.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Take a PYQ mock exam to build per-topic accuracy and surface revision priorities.{" "}
          <button className="text-violet hover:underline" onClick={onExam}>Generate one →</button>
        </p>
      ) : (
        <div className="space-y-2">
          {risk.map((r) => (
            <div key={r.topic} className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 ${tone[r.risk]}`}>
              <div>
                <div className="font-medium">{r.topic}</div>
                <div className="text-xs text-muted-foreground">
                  Appears {r.occurrences}× · Accuracy {r.accuracy}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={r.risk === "High" ? "default" : "outline"}>{r.risk} risk</Badge>
                <Button size="sm" variant="ghost" onClick={() => onNotes(r.topic)}>
                  <NotebookPen className="size-4" /> Revise
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onFlashcards(r.topic)}>
                  <Layers className="size-4" /> Cards
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Exam readiness ---------------- */

function ExamReadiness({ a }: { a: NonNullable<ReturnType<typeof usePyqStore.getState>["analysis"]> }) {
  const r = a.readiness;
  const weak = r.weakTopics ?? [];
  const strong = r.strongTopics ?? [];
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Exam Readiness
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <div className="font-display text-3xl">{r.readiness ?? 0}%</div>
          <div className="text-xs text-muted-foreground">Estimated readiness</div>
        </div>
        <div>
          <div className="font-display text-3xl">{r.coverage ?? 0}%</div>
          <div className="text-xs text-muted-foreground">Topic coverage (practiced)</div>
        </div>
        <div className="text-sm">
          <div className="text-success">{strong.length} strong</div>
          <div className="text-danger">{weak.length} weak</div>
        </div>
      </div>
      {(weak.length > 0 || strong.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {strong.map((t) => <Badge key={t} variant="outline" className="border-success/40 text-success">{t}</Badge>)}
          {weak.map((t) => <Badge key={t} variant="outline" className="border-danger/40 text-danger">{t}</Badge>)}
        </div>
      )}
      {weak.length === 0 && strong.length === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          No practice data yet — readiness is an estimate built from PYQ mock-exam results.
        </p>
      )}
    </section>
  );
}

/* ---------------- Question explorer ---------------- */

function QuestionExplorer() {
  const questions = usePyqStore((s) => s.questions);
  const analysis = usePyqStore((s) => s.analysis);
  const filters = usePyqStore((s) => s.filters);
  const setFilter = usePyqStore((s) => s.setFilter);
  const fetchQuestions = usePyqStore((s) => s.fetchQuestions);

  const topics = analysis?.topicFrequency.map((t) => t.topic) ?? [];
  const years = useMemo(
    () => [...new Set(questions.map((q) => q.year).filter((y): y is number => y != null))].sort((a, b) => b - a),
    [questions],
  );

  // Re-fetch when structured filters change (search is debounced separately below).
  useEffect(() => {
    fetchQuestions();
  }, [filters.year, filters.topic, filters.difficulty, filters.type]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Question Explorer
      </h3>
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search questions…"
            className="bg-input-background pl-8"
            defaultValue={filters.q ?? ""}
            onChange={(e) => {
              setFilter("q", e.target.value);
            }}
            onKeyDown={(e) => { if (e.key === "Enter") fetchQuestions(); }}
          />
        </div>
        <FilterSelect label="Topic" value={filters.topic} options={topics} onChange={(v) => setFilter("topic", v)} />
        <FilterSelect label="Difficulty" value={filters.difficulty} options={["Easy", "Medium", "Hard"]} onChange={(v) => setFilter("difficulty", v)} />
        <FilterSelect label="Type" value={filters.type} options={["definition", "explanation", "comparison", "advantages", "architecture", "case_study", "numerical", "problem_solving", "short_answer", "long_answer", "other"]} onChange={(v) => setFilter("type", v)} />
        <FilterSelect label="Year" value={filters.year != null ? String(filters.year) : undefined} options={years.map(String)} onChange={(v) => setFilter("year", v ? Number(v) : undefined)} />
      </div>
      <div className="max-h-[460px] space-y-2 overflow-y-auto">
        {questions.length === 0 && <p className="text-sm text-muted-foreground">No questions match these filters.</p>}
        {questions.map((q) => (
          <div key={q.id} className="rounded-lg border border-border p-3">
            <p className="text-sm">{q.text}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              <Badge variant="outline">{q.topic}</Badge>
              {q.subtopics?.map((st) => <Badge key={st} variant="outline" className="text-violet">{st}</Badge>)}
              <Badge variant="secondary">{q.difficulty}</Badge>
              <Badge variant="outline">{q.type.replace(/_/g, " ")}</Badge>
              {q.marks != null && <Badge variant="outline">{q.marks} marks</Badge>}
              {q.year != null && <Badge variant="outline">{q.year}</Badge>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: string[];
  onChange: (v: string | undefined) => void;
}) {
  const ALL = "__all__";
  return (
    <Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
      <SelectTrigger className="w-32 bg-input-background">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All {label.toLowerCase()}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ---------------- Paper list ---------------- */

function PaperList({ papers }: { papers: ReturnType<typeof usePyqStore.getState>["papers"] }) {
  const deletePaper = usePyqStore((s) => s.deletePaper);
  if (papers.length === 0) return null;
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Analyzed Papers
      </h3>
      <div className="space-y-2">
        {papers.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {p.year ? `${p.year} · ` : ""}{p.questionCount} questions · {p.createdAt}
                </div>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => deletePaper(p.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Topic detail drawer ---------------- */

function TopicDrawer({
  onQuiz,
  onNotes,
  onFlashcards,
  onExam,
}: {
  onQuiz: (t: string) => void;
  onNotes: (t: string) => void;
  onFlashcards: (t: string) => void;
  onExam: () => void;
}) {
  const topic = usePyqStore((s) => s.selectedTopic);
  const analysis = usePyqStore((s) => s.analysis);
  const setField = usePyqStore((s) => s.setField);
  const row = analysis?.topicFrequency.find((t) => t.topic === topic);
  const trend = analysis?.yearTrends.find((t) => t.topic === topic);
  return (
    <Dialog open={!!topic} onOpenChange={(o) => !o && setField("selectedTopic", null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{topic}</DialogTitle>
          <DialogDescription>Topic intelligence from previous-year papers.</DialogDescription>
        </DialogHeader>
        {row && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-muted-foreground">Frequency:</span> {row.frequency}</div>
              <div><span className="text-muted-foreground">Occurrences:</span> {row.occurrences}</div>
              <div className="flex items-center gap-1"><span className="text-muted-foreground">Trend:</span> <TrendIcon trend={row.trend} /> {row.trend}</div>
              <div className="flex items-center gap-1"><span className="text-muted-foreground">Importance:</span> <Stars n={row.importance} /></div>
            </div>
            <div>
              <span className="text-muted-foreground">Your performance: </span>
              <Accuracy value={row.accuracy} />
            </div>
            {row.subtopics.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Subtopics / related concepts</p>
                <div className="flex flex-wrap gap-1.5">
                  {row.subtopics.map((s) => <Badge key={s} variant="outline" className="text-violet">{s}</Badge>)}
                </div>
              </div>
            )}
            {row.styles.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Common question styles</p>
                <div className="flex flex-wrap gap-1.5">
                  {row.styles.map((s) => <Badge key={s} variant="outline">{s.replace(/_/g, " ")}</Badge>)}
                </div>
              </div>
            )}
            {trend && (
              <YearTimeline trends={[trend]} />
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => onNotes(row.topic)}><NotebookPen className="size-4" /> Notes</Button>
              <Button size="sm" variant="outline" onClick={() => onFlashcards(row.topic)}><Layers className="size-4" /> Flashcards</Button>
              <Button size="sm" variant="outline" onClick={() => onQuiz(row.topic)}><ListChecks className="size-4" /> Quiz</Button>
              <Button size="sm" onClick={onExam}><GraduationCap className="size-4" /> Mock Exam</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

## File: src/app/pages/Teach.tsx
```typescript
import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  NotebookPen,
  Layers,
  ListChecks,
  Network,
  Workflow,
  Columns2,
  FileText,
  Sparkles,
  Loader2,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { FlashcardCard } from "../components/FlashcardCard";
import { DiagramViewer } from "../components/DiagramViewer";
import { SourcePanel } from "../components/SourcePanel";
import { MindMapTree, countNodes, parseMindmapText } from "../components/MindMapTree";
import { cn } from "../components/ui/utils";
import { api, type PackageMeta, type FlashcardSet, type GeneratedQuiz, type GeneratedDiagram, type GeneratedMindmap, type GeneratedRevision } from "../lib/api";
import type { GeneratedDifference, Flashcard, QuizQuestion } from "../lib/types";
import {
  useTeachStore,
  ARTIFACT_KEYS,
  type ArtifactKey,
  type Depth,
  type ViewKey,
  type SlotStatus,
} from "../stores/useTeachStore";

const EXAMPLES = ["CAP Theorem", "RAG", "Deadlocks", "Service Discovery", "OS Scheduling", "LangGraph"];

const DEPTHS: { id: Depth; label: string }[] = [
  { id: "quick", label: "Quick Overview" },
  { id: "standard", label: "Standard" },
  { id: "deep", label: "Deep Dive" },
];

const ARTIFACT_LABELS: Record<ArtifactKey, string> = {
  notes: "Notes",
  flashcards: "Flashcards",
  quiz: "Quiz",
  mindmap: "Mind Map",
  diagram: "Diagram",
  difference: "Difference Tables",
};

const NAV: { id: ViewKey; label: string; icon: typeof BookOpen }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quiz", icon: ListChecks },
  { id: "mindmap", label: "Mind Map", icon: Network },
  { id: "diagram", label: "Diagram", icon: Workflow },
  { id: "difference", label: "Difference Tables", icon: Columns2 },
  { id: "sources", label: "Sources", icon: FileText },
];

// ---------------------------------------------------------------------------
// Input phase
// ---------------------------------------------------------------------------

function InputPhase() {
  const { topic, depth, course, document, courses, documents, selected, setField, setCourse, setDocument, toggleArtifact, startGenerate, loadPackage, fetchCoursesAndDocs } =
    useTeachStore();
  const [packages, setPackages] = useState<PackageMeta[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(EXAMPLES);

  useEffect(() => {
    let cancelled = false;
    fetchCoursesAndDocs();
    api.listPackages().then((p) => { if (!cancelled) setPackages(p); }).catch(() => { });
    api.onboardingAnalysis().then((a) => {
      if (!cancelled) {
        const generated = [...(a.topics || []), ...(a.concepts || [])];
        if (generated.length > 0) {
          // Get unique suggestions up to 6
          const unique = Array.from(new Set(generated)).slice(0, 6);
          setSuggestions(unique);
        }
      }
    }).catch(() => { });
    return () => { cancelled = true; };
  }, []);

    const removePackage = async (id: string) => {
      try {
        await api.deletePackage(id);
        setPackages((prev) => prev.filter((p) => p.id !== id));
        toast.success("Package deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete");
      }
    };

    return (
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-soft text-primary">
              <GraduationCap className="size-6" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold">Teach Me</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter a topic and get a complete learning workspace — notes, flashcards, quiz,
              mind map, diagram and more, all in one place.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-5">
            <Input
              value={topic}
              onChange={(e) => setField("topic", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") startGenerate(); }}
              placeholder="What would you like to learn?"
              className="h-11 bg-input-background text-base"
              autoFocus
            />

            <div className="mt-3 flex flex-wrap gap-1.5">
              {suggestions.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setField("topic", ex)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Context Pickers */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Course</div>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="All courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All courses</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Document</div>
                <Select
                  value={document ?? "all"}
                  onValueChange={(v) => setDocument(v === "all" ? null : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All documents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All documents</SelectItem>
                    {(course === "none" ? documents : documents.filter(d => d.course === course)).map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Depth */}
            <div className="mt-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Depth</div>
              <div className="flex gap-2">
                {DEPTHS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setField("depth", d.id)}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2 text-sm transition-colors",
                      depth === d.id ? "border-primary bg-violet-soft text-primary" : "border-border bg-background hover:border-ring/40",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Artifacts */}
            <div className="mt-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Artifacts</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ARTIFACT_KEYS.map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleArtifact(key)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                      selected[key] ? "border-primary/50 bg-violet-soft/60" : "border-border bg-background text-muted-foreground hover:border-ring/40",
                    )}
                  >
                    <span className={cn("flex size-4 items-center justify-center rounded border", selected[key] ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}>
                      {selected[key] && <CheckCircle2 className="size-3" />}
                    </span>
                    {ARTIFACT_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={startGenerate} className="mt-6 w-full gap-2">
              <Sparkles className="size-4" /> Generate learning package
            </Button>
          </div>

          {/* Library */}
          {packages.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-3 text-sm font-medium">Your learning packages</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {packages.map((p) => (
                  <div
                    key={p.id}
                    className="group flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring/40"
                    onClick={() => loadPackage(p.id)}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-soft text-primary">
                      <GraduationCap className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{p.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground capitalize">
                        {p.depth} · {p.artifactCount} {p.artifactCount === 1 ? "artifact" : "artifacts"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-muted-foreground opacity-0 hover:text-danger group-hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); void removePackage(p.id); }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }

// ---------------------------------------------------------------------------
// Workspace views
// ---------------------------------------------------------------------------

function ViewState({ icon: Icon, message }: { icon: typeof Sparkles; message: string }) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 pt-24 text-center text-muted-foreground">
          <Icon className="size-7 opacity-50" />
          <p className="max-w-sm text-sm">{message}</p>
        </div>
      );
    }

function Spinner({ message }: { message: string }) {
      return (
        <div className="flex flex-col items-center pt-24 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="mt-3 text-sm">{message}</p>
        </div>
      );
    }

function QuizReview({ questions }: { questions: QuizQuestion[] }) {
      const [revealed, setRevealed] = useState<Record<string, boolean>>({});
      if (!questions.length) {
        return <ViewState icon={ListChecks} message="No quiz questions were generated for this topic." />;
      }
      return (
        <div className="space-y-4">
          {questions.map((q, i) => {
            const show = revealed[q.id];
            return (
              <div key={q.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-violet-soft text-[11px] font-medium text-primary">{i + 1}</span>
                  <p className="text-sm font-medium leading-snug">{q.prompt}</p>
                </div>
                {q.options && q.options.length > 0 && (
                  <ul className="mt-3 space-y-1.5 pl-7">
                    {q.options.map((opt, oi) => {
                      const isAnswer = show && opt.trim() === q.answer.trim();
                      return (
                        <li
                          key={oi}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm",
                            isAnswer ? "border-success/50 bg-success-soft text-success" : "border-border",
                          )}
                        >
                          {isAnswer && <CheckCircle2 className="size-3.5 shrink-0" />}
                          {opt}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-3 pl-7">
                  {show ? (
                    q.explanation && (
                      <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                        <p className="text-muted-foreground">{q.explanation}</p>
                      </div>
                    )
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setRevealed((r) => ({ ...r, [q.id]: true }))}>
                      Show answer
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

function ArtifactBody({ view }: { view: ArtifactKey }) {
      const slot = useTeachStore((s) => s.artifacts[view]);
      const selected = useTeachStore((s) => s.selected[view]);
      const retryArtifact = useTeachStore((s) => s.retryArtifact);

      if (!selected) {
        return <ViewState icon={XCircle} message={`${ARTIFACT_LABELS[view]} was not included in this package.`} />;
      }
      if (slot.status === "queued") return <Spinner message="Queued — waiting for earlier artifacts…" />;
      if (slot.status === "loading") return <Spinner message={`Generating ${ARTIFACT_LABELS[view].toLowerCase()}…`} />;
      if (slot.status === "error") {
        return (
          <div className="flex flex-col items-center gap-3 pt-24 text-center text-muted-foreground">
            <AlertTriangle className="size-7 text-danger/70" />
            <p className="max-w-sm text-sm">{slot.error}</p>
            <Button variant="outline" size="sm" onClick={() => void retryArtifact(view)}>Retry</Button>
          </div>
        );
      }
      if (!slot.data) return <Spinner message="Loading…" />;

      switch (view) {
        case "notes":
          return <MarkdownRenderer content={(slot.data as GeneratedRevision).markdown} />;
        case "difference":
          return <MarkdownRenderer content={(slot.data as GeneratedDifference).content} />;
        case "flashcards": {
          const cards = (slot.data as FlashcardSet).cards as Flashcard[];
          if (!cards.length) return <ViewState icon={Layers} message="No flashcards were generated." />;
          return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cards.map((c) => <FlashcardCard key={c.id} card={c} />)}
            </div>
          );
        }
        case "quiz":
          return <QuizReview questions={(slot.data as GeneratedQuiz).questions} />;
        case "diagram":
          return <DiagramViewer code={(slot.data as GeneratedDiagram).mermaid} flush />;
        case "mindmap": {
          const text = (slot.data as GeneratedMindmap).text;
          if (!text?.trim()) return <ViewState icon={Network} message="No mind map was generated." />;
          const count = countNodes(parseMindmapText(text));
          return (
            <div>
              <Badge variant="outline" className="mb-4 border-cyan/40 bg-cyan-soft text-cyan">
                {count} {count === 1 ? "node" : "nodes"}
              </Badge>
              <MindMapTree text={text} />
            </div>
          );
        }
      }
    }

function StatusIcon({ status }: { status: SlotStatus }) {
      switch (status) {
        case "loading":
          return <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />;
        case "done":
          return <CheckCircle2 className="size-3.5 shrink-0 text-success" />;
        case "error":
          return <AlertTriangle className="size-3.5 shrink-0 text-danger" />;
        case "queued":
          return <Clock className="size-3.5 shrink-0 text-muted-foreground/60" />;
        default:
          return null;
      }
    }

function WorkspacePhase() {
      const {
        topic, activeView, overview, overviewStatus, sources, packageId, saving,
        artifacts, selected, generating, currentTask, openView, savePackage, reset,
      } = useTeachStore();

      const grounded = overview?.grounded;

      // Status per nav item: overview/artifacts have real status; Sources rides on
      // the overview (its chunks come back with the overview).
      const statusFor = (view: ViewKey): SlotStatus => {
        if (view === "overview" || view === "sources") return overviewStatus;
        return artifacts[view].status;
      };

      // Progress across the whole package: overview + each selected artifact.
      const total = 1 + ARTIFACT_KEYS.filter((k) => selected[k]).length;
      const done =
        (overviewStatus === "done" ? 1 : 0) +
        ARTIFACT_KEYS.filter((k) => selected[k] && artifacts[k].status === "done").length;
      const currentLabel = currentTask ? NAV.find((n) => n.id === currentTask)?.label : null;

      return (
        <div className="flex h-full">
          {/* Nav rail */}
          <div className="flex w-64 shrink-0 flex-col border-r border-border bg-card/40">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <GraduationCap className="size-4 text-primary" />
              <span className="truncate text-sm font-medium">{topic}</span>
            </div>

            {/* Live progress strip */}
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  {generating ? (
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Loader2 className="size-3 animate-spin text-primary" />
                      Generating {currentLabel ?? "…"}
                    </span>
                  ) : done >= total ? (
                    "All artifacts ready"
                  ) : (
                    "Ready"
                  )}
                </span>
                <span className="font-mono text-muted-foreground">{done}/{total}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${total ? (done / total) * 100 : 0}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <ScrollArea className="h-full">
              <nav className="space-y-1 p-2">
                {NAV.map((item) => {
                  const st = statusFor(item.id);
                  const isArtifact = (ARTIFACT_KEYS as string[]).includes(item.id);
                  const notIncluded = isArtifact && !selected[item.id as ArtifactKey];
                  return (
                    <button
                      key={item.id}
                      onClick={() => openView(item.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        activeView === item.id ? "bg-violet-soft text-primary" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                        notIncluded && "opacity-40",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <StatusIcon status={st} />
                    </button>
                  );
                })}
              </nav>
              </ScrollArea>
            </div>
            <div className="space-y-2 border-t border-border p-3">
              <Button onClick={savePackage} disabled={saving || !overview} className="w-full gap-2" size="sm">
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                {packageId ? "Saved" : "Save Learning Package"}
              </Button>
              <Button onClick={reset} variant="outline" className="w-full gap-2" size="sm">
                <Plus className="size-3.5" /> New topic
              </Button>
            </div>
          </div>

          {/* Main panel */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
              <span className="text-sm font-medium">{NAV.find((n) => n.id === activeView)?.label}</span>
              {grounded !== undefined && (
                <Badge variant="outline" className={cn("text-[10px]", grounded ? "border-success/40 bg-success-soft text-success" : "border-warning/40 bg-warning-soft text-warning")}>
                  {grounded ? "From your documents" : "General knowledge"}
                </Badge>
              )}
            </div>

            {activeView === "sources" ? (
              <div className="min-h-0 flex-1">
                <SourcePanel sources={sources} />
              </div>
            ) : activeView === "diagram" ? (
              <div className="min-h-0 flex-1 relative">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0"
                >
                  <ArtifactBody view={activeView as ArtifactKey} />
                </motion.div>
              </div>
            ) : (
              <div className="min-h-0 flex-1">
                <ScrollArea className="h-full">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto max-w-3xl px-8 py-8"
                >
                  {activeView === "overview" ? (
                    overviewStatus === "loading" ? (
                      <Spinner message="Retrieving sources…" />
                    ) : overviewStatus === "error" ? (
                      <ViewState icon={AlertTriangle} message="Failed to generate the overview." />
                    ) : overview ? (
                      <MarkdownRenderer content={overview.markdown} />
                    ) : (
                      <ViewState icon={Sparkles} message="Generating overview…" />
                    )
                  ) : (
                    <ArtifactBody view={activeView as ArtifactKey} />
                  )}
                </motion.div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      );
    }

export function Teach() {
    const phase = useTeachStore((s) => s.phase);
    return phase === "input" ? <InputPhase /> : <WorkspacePhase />;
  }
```

## File: src/app/pages/Settings.tsx
```typescript
import { useEffect, useState } from "react";
import { Cpu, Boxes, Filter, Keyboard, User } from "lucide-react";
import { Page } from "../components/Page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useSettingsStore } from "../stores/useSettingsStore";
import { navItems } from "../lib/nav";
import { api, type ModelsList } from "../lib/api";

function ModelOptions({
  models,
  current,
}: {
  models: string[];
  current: string;
}) {
  const list = models.includes(current) ? models : [current, ...models];
  return (
    <>
      {list.filter(Boolean).map((m) => (
        <SelectItem key={m} value={m}>
          {m}
        </SelectItem>
      ))}
    </>
  );
}

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border py-4 last:border-0">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const s = useSettingsStore();
  const [models, setModels] = useState<ModelsList>({
    fastModels: [],
    reasoningModels: [],
    embeddingModels: [],
    visionModels: [],
  });

  useEffect(() => {
    s.hydrate();
    api
      .listModels()
      .then(setModels)
      .catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page className="max-w-4xl">
      <Tabs defaultValue="models">
        <TabsList className="mb-6 bg-card">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="size-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-1.5">
            <Cpu className="size-4" /> Models
          </TabsTrigger>
          <TabsTrigger value="embeddings" className="gap-1.5">
            <Boxes className="size-4" /> Embeddings
          </TabsTrigger>
          <TabsTrigger value="retrieval" className="gap-1.5">
            <Filter className="size-4" /> Retrieval
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="gap-1.5">
            <Keyboard className="size-4" /> Shortcuts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row
              title="General Purpose Fast Model"
              desc="Optimized for speed and quick summaries"
            >
              <Select
                value={s.fastModel}
                onValueChange={(v) => s.set("fastModel", v)}
              >
                <SelectTrigger className="w-56 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ModelOptions
                    models={models.fastModels}
                    current={s.fastModel}
                  />
                </SelectContent>
              </Select>
            </Row>
            <Row
              title="Deep Reasoning Model"
              desc="Optimized for complex synthesis and large tasks"
            >
              <Select
                value={s.reasoningModel}
                onValueChange={(v) => s.set("reasoningModel", v)}
              >
                <SelectTrigger className="w-56 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ModelOptions
                    models={models.reasoningModels}
                    current={s.reasoningModel}
                  />
                </SelectContent>
              </Select>
            </Row>
            <Row
              title="Temperature"
              desc={`Creativity of responses · ${s.temperature.toFixed(2)}`}
            >
              <Slider
                className="w-56"
                value={[s.temperature]}
                onValueChange={(v) => s.set("temperature", v[0])}
                min={0}
                max={1}
                step={0.05}
              />
            </Row>
            <Row title="Stream responses" desc="Render tokens as they generate">
              <Switch
                checked={s.streaming}
                onCheckedChange={(v) => s.set("streaming", v)}
              />
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="embeddings">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row
              title="Embedding model"
              desc="Used to vectorize your documents"
            >
              <Select
                value={s.embeddingModel}
                onValueChange={(v) => s.set("embeddingModel", v)}
              >
                <SelectTrigger className="w-56 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ModelOptions
                    models={models.embeddingModels}
                    current={s.embeddingModel}
                  />
                </SelectContent>
              </Select>
            </Row>
            <Row
              title="Vision / OCR model"
              desc="Describes images & diagrams and recovers low-confidence OCR"
            >
              <Select
                value={s.visionModel}
                onValueChange={(v) => s.set("visionModel", v)}
              >
                <SelectTrigger className="w-56 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ModelOptions
                    models={models.visionModels}
                    current={s.visionModel}
                  />
                </SelectContent>
              </Select>
            </Row>
            <Row title="Vector store" desc="Local LanceDB storage">
              <span className="rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
                lancedb
              </span>
            </Row>
            <Row title="Chunk size" desc="Tokens per indexed chunk">
              <span className="rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
                800
              </span>
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="retrieval">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row
              title="Top-K results"
              desc={`Documents retrieved per query · ${s.topK}`}
            >
              <Slider
                className="w-56"
                value={[s.topK]}
                onValueChange={(v) => s.set("topK", v[0])}
                min={1}
                max={10}
                step={1}
              />
            </Row>
            <Row
              title="Similarity threshold"
              desc={`Minimum cosine similarity · ${s.similarityThreshold.toFixed(2)}`}
            >
              <Slider
                className="w-56"
                value={[s.similarityThreshold]}
                onValueChange={(v) => s.set("similarityThreshold", v[0])}
                min={0.5}
                max={0.95}
                step={0.01}
              />
            </Row>
            <Row
              title="Inline citations"
              desc="Show [n] markers within answers"
            >
              <Switch
                checked={s.citationsInline}
                onCheckedChange={(v) => s.set("citationsInline", v)}
              />
            </Row>
          </div>
        </TabsContent>

        <TabsContent value="shortcuts">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row title="Command menu" desc="Open the global search palette">
              <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs">
                ⌘ K
              </kbd>
            </Row>
            {navItems.map((n) => (
              <Row key={n.to} title={n.label} desc={`Jump to ${n.label}`}>
                <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs">
                  {n.shortcut}
                </kbd>
              </Row>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="rounded-2xl border border-border bg-card px-5">
            <Row title="Industry" desc="Your professional industry">
              <Input
                className="w-56 bg-input-background"
                value={s.industry}
                onChange={(e) => s.set("industry", e.target.value)}
                placeholder="e.g. Technology"
              />
            </Row>
            <Row title="Role" desc="Your primary role or title">
              <Input
                className="w-56 bg-input-background"
                value={s.role}
                onChange={(e) => s.set("role", e.target.value)}
                placeholder="e.g. Software Engineer"
              />
            </Row>
            <Row title="Goals" desc="Your learning or professional goals">
              <Input
                className="w-56 bg-input-background"
                value={s.goals}
                onChange={(e) => s.set("goals", e.target.value)}
                placeholder="e.g. Learn AI"
              />
            </Row>
            <Row title="Interests" desc="Topics you are interested in">
              <Input
                className="w-56 bg-input-background"
                value={s.interests}
                onChange={(e) => s.set("interests", e.target.value)}
                placeholder="e.g. Machine Learning"
              />
            </Row>
            <Row title="Learning Preferences" desc="How you prefer to learn">
              <Input
                className="w-56 bg-input-background"
                value={s.learningPreferences}
                onChange={(e) => s.set("learningPreferences", e.target.value)}
                placeholder="e.g. Visual, Hands-on"
              />
            </Row>
          </div>
        </TabsContent>
      </Tabs>
    </Page>
  );
}
```

## File: src/app/pages/Differences.tsx
```typescript
import { useEffect, useRef } from "react";
import {
  Columns2,
  Copy,
  Download,
  Loader2,
  Sparkles,
  Trash2,
  Code,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { Page, SectionTitle } from "../components/Page";
import { useDifferencesStore } from "../stores/useDifferencesStore";
import { cn } from "../components/ui/utils";

export function Differences() {
  const topic = useDifferencesStore((s) => s.topic);
  const course = useDifferencesStore((s) => s.course);
  const document = useDifferencesStore((s) => s.document);
  const loading = useDifferencesStore((s) => s.loading);
  const output = useDifferencesStore((s) => s.output);
  const showRaw = useDifferencesStore((s) => s.showRaw);
  const suggestions = useDifferencesStore((s) => s.suggestions);
  const saved = useDifferencesStore((s) => s.saved);
  const courses = useDifferencesStore((s) => s.courses);
  const documents = useDifferencesStore((s) => s.documents);
  const setTopic = useDifferencesStore((s) => s.setTopic);
  const setCourse = useDifferencesStore((s) => s.setCourse);
  const setDocument = useDifferencesStore((s) => s.setDocument);
  const setShowRaw = useDifferencesStore((s) => s.setShowRaw);
  const generate = useDifferencesStore((s) => s.generate);
  const fetchSuggestions = useDifferencesStore((s) => s.fetchSuggestions);
  const fetchSaved = useDifferencesStore((s) => s.fetchSaved);
  const fetchCoursesAndDocs = useDifferencesStore((s) => s.fetchCoursesAndDocs);
  const saveTable = useDifferencesStore((s) => s.saveTable);
  const deleteTable = useDifferencesStore((s) => s.deleteTable);
  const loadSaved = useDifferencesStore((s) => s.loadSaved);

  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSuggestions();
    fetchSaved();
    fetchCoursesAndDocs();
  }, [fetchSuggestions, fetchSaved, fetchCoursesAndDocs]);

  const prevOutput = useRef(output);
  useEffect(() => {
    if (output && output !== prevOutput.current) {
      setTimeout(() => viewerRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
    prevOutput.current = output;
  }, [output]);

  function copyMarkdown() {
    if (!output) return;
    navigator.clipboard.writeText(output.content);
    toast.success("Copied to clipboard");
  }

  function exportMarkdown() {
    if (!output) return;
    const blob = new Blob([output.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${output.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as Markdown");
  }

  const visibleDocs = course === "none"
    ? documents
    : documents.filter((d) => d.course === course);

  const isEmpty = !output && saved.length === 0 && !loading;

  return (
    <Page>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Columns2 className="size-5 text-violet" />
          <h1 className="text-2xl font-semibold tracking-tight">Difference Tables</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Compare concepts, architectures, algorithms and systems.
        </p>
      </div>

      {/* Search + generate */}
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Compare concepts… e.g. Process vs Thread"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && generate()}
          className="flex-1"
        />
        <Button onClick={generate} disabled={loading || !topic.trim()}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? "Generating…" : "Generate Table"}
        </Button>
      </div>

      {/* Course + document pickers */}
      <div className="flex gap-2 mb-6">
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={document ?? "all"}
          onValueChange={(v) => setDocument(v === "all" ? null : v)}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All documents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All documents</SelectItem>
            {visibleDocs.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Viewer */}
      {output && (
        <div ref={viewerRef} className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-medium text-foreground">{output.title}</h2>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRaw(!showRaw)}
                className="gap-1.5"
              >
                {showRaw ? <Eye className="size-3.5" /> : <Code className="size-3.5" />}
                {showRaw ? "Rendered" : "Raw"}
              </Button>
              <Button variant="ghost" size="sm" onClick={copyMarkdown} className="gap-1.5">
                <Copy className="size-3.5" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={exportMarkdown} className="gap-1.5">
                <Download className="size-3.5" /> Export
              </Button>
              <Button size="sm" onClick={saveTable} className="gap-1.5">
                Save
              </Button>
            </div>
          </div>
          <div
            className={cn(
              "rounded-lg border border-border bg-card p-4",
              showRaw && "font-mono text-xs",
            )}
          >
            {showRaw ? (
              <pre className="whitespace-pre-wrap text-foreground">{output.content}</pre>
            ) : (
              <MarkdownRenderer content={output.content} />
            )}
          </div>
          {!output.grounded && (
            <p className="mt-2 text-xs text-muted-foreground">
              Based on general knowledge — upload documents for grounded comparisons.
            </p>
          )}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Columns2 className="size-10 text-muted-foreground/40 mb-3" />
          <p className="font-medium text-muted-foreground mb-1">Generate your first comparison.</p>
          <p className="text-sm text-muted-foreground/70">
            Compare two concepts to create an exam-ready revision table.
          </p>
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {["Process vs Thread", "REST vs gRPC", "Monolith vs Microservices"].map((ex) => (
              <button
                key={ex}
                onClick={() => setTopic(ex)}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saved tables */}
      {saved.length > 0 && (
        <div>
          <SectionTitle title="Saved Comparisons" />
          <div className="space-y-2">
            {saved.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors",
                  output?.title === item.title
                    ? "border-violet/40 bg-violet/5"
                    : "hover:bg-muted/50",
                )}
              >
                <button className="flex-1 text-left" onClick={() => loadSaved(item)}>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                    {item.course && ` · ${item.course}`}
                  </p>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTable(item.id)}
                  className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}
```

## File: src/app/pages/onboarding/OnboardingHero.tsx
```typescript
import { useNavigate } from "react-router";
import { GraduationCap, Upload, Cpu, Lock, WifiOff, BookMarked } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const formats = ["PDF", "DOCX", "Markdown", "Text"];

const traits = [
  { icon: Cpu, label: "Powered by local AI" },
  { icon: Lock, label: "Private" },
  { icon: WifiOff, label: "Offline-first" },
  { icon: BookMarked, label: "Source-grounded" },
];

export function OnboardingHero() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-lg flex-col items-center text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
        >
          <GraduationCap className="size-9" />
        </motion.div>

        {/* Brand */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-6 font-display text-4xl font-semibold tracking-tight text-foreground"
        >
          ScholarAI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 text-lg text-muted-foreground"
        >
          Your personal knowledge workspace.
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-5 max-w-sm leading-relaxed text-muted-foreground"
        >
          Import documents, notes, textbooks, research papers and study materials to begin
          building your library. Everything stays on your machine.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8"
        >
          <Button
            size="lg"
            className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/onboarding/import")}
          >
            <Upload className="size-4" />
            Import Documents
          </Button>
        </motion.div>

        {/* Supported formats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {formats.map((fmt) => (
            <Badge key={fmt} variant="secondary" className="px-3 py-1 text-xs font-medium">
              {fmt}
            </Badge>
          ))}
        </motion.div>

        {/* Traits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
        >
          {traits.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon className="size-3.5" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
```

## File: src/app/pages/onboarding/OnboardingImport.tsx
```typescript
import { useRef } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  FileText,
  FileType,
  FileCode,
  File,
  CheckCircle2,
  Loader2,
  XCircle,
  X,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useOnboarding, type ImportFileStatus } from "../../context/OnboardingContext";

const ACCEPTED = ".pdf,.docx,.md,.markdown,.txt,.text";

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return FileText;
  if (ext === "docx") return FileType;
  if (ext === "md" || ext === "markdown") return FileCode;
  return File;
}

function fileTypeLabel(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = { pdf: "PDF", docx: "DOCX", md: "Markdown", markdown: "Markdown", txt: "Text", text: "Text" };
  return map[ext ?? ""] ?? ext?.toUpperCase() ?? "File";
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

const statusConfig: Record<ImportFileStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  queued: { label: "Queued", cls: "border-border text-muted-foreground", icon: File },
  processing: { label: "Processing", cls: "border-warning/40 bg-warning-soft text-warning", icon: Loader2 },
  completed: { label: "Completed", cls: "border-success/40 bg-success-soft text-success", icon: CheckCircle2 },
  failed: { label: "Failed", cls: "border-danger/40 bg-danger-soft text-danger", icon: XCircle },
};

const supportedTypes = ["Books", "Lecture Notes", "Research Papers", "Documentation", "Markdown Notes", "Text Files", "PDFs"];

export function OnboardingImport() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const { files, addFiles, removeFile, startImport } = useOnboarding();

  const importing = files.some((f) => f.status === "processing");
  const canStart = files.length > 0 && !importing && files.some((f) => f.status === "queued");

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length) addFiles(picked);
    e.target.value = "";
  };

  const handleStart = async () => {
    navigate("/onboarding/analyzing");
    await startImport();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <input
        ref={fileInput}
        type="file"
        multiple
        accept={ACCEPTED}
        className="hidden"
        onChange={onFileChange}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-center text-2xl font-semibold tracking-tight">Import your documents</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Drop files below or browse your machine. Supports PDFs, DOCX, Markdown and plain text.
        </p>

        {/* Dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition-colors hover:border-primary/50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInput.current?.click()}
        >
          <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-violet-soft text-primary">
            <Upload className="size-7" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">Drop files here</p>
          <p className="mt-1 text-sm text-muted-foreground">or</p>
          <Button
            variant="outline"
            className="mt-3 gap-2"
            onClick={(e) => { e.stopPropagation(); fileInput.current?.click(); }}
          >
            Browse Files
          </Button>

          {/* Supported content chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-1.5">
            {supportedTypes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Queue */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_80px_100px_24px] gap-3 border-b border-border bg-muted/40 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <span>File</span>
                <span>Type</span>
                <span>Size</span>
                <span>Status</span>
                <span />
              </div>

              <AnimatePresence>
                {files.map((item) => {
                  const Icon = fileIcon(item.file.name);
                  const { label, cls, icon: StatusIcon } = statusConfig[item.status];
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="grid grid-cols-[1fr_80px_80px_100px_24px] items-center gap-3 border-b border-border px-4 py-3 last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Icon className="size-4" />
                        </div>
                        <span className="truncate text-sm">{item.file.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{fileTypeLabel(item.file.name)}</span>
                      <span className="text-xs text-muted-foreground">{formatSize(item.file.size)}</span>
                      <Badge variant="outline" className={`w-fit gap-1 text-[11px] ${cls}`}>
                        <StatusIcon
                          className={`size-3 ${item.status === "processing" ? "animate-spin" : ""}`}
                        />
                        {label}
                      </Badge>
                      {item.status === "queued" && (
                        <button
                          onClick={() => removeFile(item.id)}
                          className="flex size-5 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <Button
            disabled={!canStart}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleStart}
          >
            Start Import
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
```

## File: src/app/pages/onboarding/OnboardingAnalyzing.tsx
```typescript
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Loader2,
  Circle,
  FileText,
  Tag,
  Network,
  Cpu,
  Database,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../../lib/api";
import { useOnboarding, type OnboardingAnalysis } from "../../context/OnboardingContext";

const PIPELINE_STEPS = [
  { label: "Extracting Text", icon: FileText },
  { label: "Analyzing Structure", icon: Layers },
  { label: "Detecting Topics", icon: Tag },
  { label: "Building Knowledge Graph", icon: Network },
  { label: "Generating Embeddings", icon: Cpu },
  { label: "Indexing Sources", icon: Database },
  { label: "Preparing Workspace", icon: Sparkles },
];

type StepState = "pending" | "active" | "done";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function StatCounter({ label, value }: { label: string; value: number }) {
  const displayed = useCountUp(value);
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold tabular-nums text-foreground">{displayed}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function OnboardingAnalyzing() {
  const navigate = useNavigate();
  const { files, setAnalysis } = useOnboarding();

  const [stepStates, setStepStates] = useState<StepState[]>(
    PIPELINE_STEPS.map((_, i) => (i === 0 ? "active" : "pending")),
  );
  const [analysis, setLocalAnalysis] = useState<OnboardingAnalysis | null>(null);
  const completedRef = useRef(false);

  // Advance pipeline steps on a timer, gated by file completion
  useEffect(() => {
    const totalFiles = files.length || 1;
    const msPerStep = Math.max(800, (totalFiles * 3000) / PIPELINE_STEPS.length);

    let current = 0;
    const advance = () => {
      current += 1;
      if (current >= PIPELINE_STEPS.length) {
        setStepStates(PIPELINE_STEPS.map(() => "done"));
        return;
      }
      setStepStates((prev) =>
        prev.map((s, i) => {
          if (i < current) return "done";
          if (i === current) return "active";
          return "pending";
        }),
      );
      timerId = setTimeout(advance, msPerStep);
    };

    let timerId = setTimeout(advance, msPerStep);
    return () => clearTimeout(timerId);
  }, [files.length]);

  // Poll for all files completed, then fetch analysis
  useEffect(() => {
    const check = async () => {
      const allDone = files.length > 0 && files.every((f) => f.status === "completed" || f.status === "failed");
      if (!allDone || completedRef.current) return;
      completedRef.current = true;

      try {
        const result = await api.onboardingAnalysis();
        setLocalAnalysis(result);
        setAnalysis(result);
        setStepStates(PIPELINE_STEPS.map(() => "done"));
        setTimeout(() => navigate("/onboarding/ready"), 1800);
      } catch {
        setTimeout(() => navigate("/onboarding/ready"), 2000);
      }
    };

    const interval = setInterval(check, 800);
    return () => clearInterval(interval);
  }, [files, navigate, setAnalysis]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Analyzing your library</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ScholarAI is processing your documents and building your knowledge workspace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_280px]">
          {/* Pipeline steps */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Processing Pipeline
            </p>
            <div className="space-y-3">
              {PIPELINE_STEPS.map((step, i) => {
                const state = stepStates[i];
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        state === "done"
                          ? "bg-success-soft text-success"
                          : state === "active"
                          ? "bg-violet-soft text-primary"
                          : "bg-muted text-muted-foreground/40"
                      }`}
                    >
                      {state === "done" ? (
                        <CheckCircle2 className="size-4" />
                      ) : state === "active" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        state === "done"
                          ? "text-foreground"
                          : state === "active"
                          ? "font-medium text-foreground"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Live discovery */}
          <div className="space-y-4">
            {/* Topics */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Detected Topics
              </p>
              <div className="flex flex-wrap items-start content-start gap-1.5 min-h-[60px]">
                <AnimatePresence>
                  {(analysis?.topics ?? []).map((t) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-full border border-primary/30 bg-violet-soft px-2.5 py-0.5 text-xs text-primary"
                    >
                      {t}
                    </motion.span>
                  ))}
                  {!analysis && (
                    <span className="text-xs text-muted-foreground/40">Scanning…</span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Concepts */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Detected Concepts
              </p>
              <div className="flex flex-wrap items-start content-start gap-1.5 min-h-[60px]">
                <AnimatePresence>
                  {(analysis?.concepts ?? []).map((c) => (
                    <motion.span
                      key={c}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {c}
                    </motion.span>
                  ))}
                  {!analysis && (
                    <span className="text-xs text-muted-foreground/40">Extracting…</span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Stats */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <StatCounter label="Documents" value={analysis.documents} />
                <StatCounter label="Pages" value={analysis.pages} />
                <StatCounter label="Concepts" value={analysis.concepts.length} />
                <StatCounter label="Sources" value={analysis.sources} />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
```

## File: src/app/pages/onboarding/OnboardingReady.tsx
```typescript
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Network,
  BookOpen,
  Sparkles,
  Notebook,
  Layers,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { useOnboarding } from "../../context/OnboardingContext";

const STARTING_POINTS = [
  { icon: Network, label: "Explore Knowledge Graph", to: "/knowledge" },
  { icon: BookOpen, label: "Open Reading Mode", to: "/reading" },
  { icon: Sparkles, label: "Ask Your Library", to: "/ask" },
  { icon: Notebook, label: "Create Notebook", to: "/notebooks" },
  { icon: Layers, label: "Generate Flashcards", to: "/flashcards" },
];

function completeOnboarding(navigate: ReturnType<typeof useNavigate>, to = "/") {
  localStorage.setItem("scholar_onboarding_done", "1");
  navigate(to, { replace: true });
}

export function OnboardingReady() {
  const navigate = useNavigate();
  const { analysis } = useOnboarding();
  const [modalOpen, setModalOpen] = useState(true);

  const docs = analysis?.documents ?? 0;
  const topics = analysis?.topics ?? [];
  const concepts = analysis?.concepts ?? [];
  const collections = topics.slice(0, 5);

  useEffect(() => {
    if (!analysis) {
      // Arrived directly (e.g. refresh) — send to hero
      navigate("/onboarding", { replace: true });
    }
  }, [analysis, navigate]);

  if (!analysis) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      {/* Welcome modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <DialogTitle className="text-xl">Library Ready</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              ScholarAI analyzed your documents and created an initial knowledge workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            {topics.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Detected Topics
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-primary/30 bg-violet-soft px-2.5 py-0.5 text-xs text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Generated
              </p>
              <div className="space-y-1">
                {["Knowledge Graph", "Source Index", "Collections", "Notebook Structure"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-3.5 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setModalOpen(false)}
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-success-soft text-success"
          >
            <CheckCircle2 className="size-7" />
          </motion.div>
          <h2 className="text-2xl font-semibold tracking-tight">Your workspace is ready.</h2>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="mb-4 text-sm font-medium text-muted-foreground">Library Summary</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Documents Imported", value: docs },
              { label: "Detected Topics", value: topics.length },
              { label: "Detected Concepts", value: concepts.length },
              { label: "Collections", value: collections.length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {/* Collections */}
          {collections.length > 0 && (
            <div className="mt-5 border-t border-border pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Auto-generated Collections
              </p>
              <div className="flex flex-wrap gap-2">
                {collections.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg border border-border bg-muted px-3 py-1 text-sm text-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggested starting points */}
        <div className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Suggested Starting Points
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {STARTING_POINTS.map(({ icon: Icon, label, to }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                onClick={() => completeOnboarding(navigate, to)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <span className="flex-1 text-sm text-foreground">{label}</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Primary action */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="gap-2 bg-primary px-10 text-primary-foreground hover:bg-primary/90"
            onClick={() => completeOnboarding(navigate)}
          >
            Open Workspace
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
```

## File: src/app/stores/useUIStore.ts
```typescript
import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandOpen: (open) => set({ commandOpen: open }),
}));
```

## File: src/app/stores/useChatStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import type { ChatMessage } from "../lib/types";
import { api } from "../lib/api";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  course: string | null;
  document: string | null;
  setCourse: (course: string | null) => void;
  setDocument: (document: string | null) => void;
  ask: (question: string, opts?: { stream?: boolean }) => Promise<void>;
  reset: () => void;
}

let controller: AbortController | null = null;

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  course: null,
  document: null,
  setCourse: (course) => set({ course }),
  setDocument: (document) => set({ document }),
  reset: () => {
    controller?.abort();
    controller = null;
    set({ messages: [], isStreaming: false });
  },
  ask: async (question: string, opts?: { stream?: boolean }) => {
    if (get().isStreaming) return;
    const stream = opts?.stream ?? true;
    const course = get().course;
    const document = get().document;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: question,
    };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      sources: [],
      streaming: true,
    };
    set((s) => ({
      messages: [...s.messages, userMsg, assistantMsg],
      isStreaming: true,
    }));

    const patch = (fields: Partial<ChatMessage>) =>
      set((s) => ({
        messages: s.messages.map((m) => (m.id === assistantId ? { ...m, ...fields } : m)),
      }));

    try {
      if (stream) {
        controller = new AbortController();
        let acc = "";
        await api.askStream(question, course, document, {
          signal: controller.signal,
          onToken: (chunk) => {
            acc += chunk;
            patch({ content: acc, streaming: true });
          },
          onDone: (meta) => {
            patch({
              content: acc,
              streaming: false,
              sources: meta.sources,
              confidence: meta.confidence ?? undefined,
            });
          },
          onError: (msg) => {
            patch({ content: acc || `⚠️ ${msg}`, streaming: false });
            toast.error("Answer failed", { description: msg });
          },
        });
      } else {
        const res = await api.ask(question, course, document);
        patch({
          content: res.content,
          streaming: false,
          sources: res.sources,
          confidence: res.confidence ?? undefined,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Request failed";
      patch({ content: `⚠️ ${msg}`, streaming: false });
      toast.error("Answer failed", { description: msg });
    } finally {
      controller = null;
      set({ isStreaming: false });
    }
  },
}));
```

## File: src/app/stores/useRevisionStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../lib/api";

export type RevisionFormat = "notes" | "concepts" | "formulas" | "summary";

export interface SavedRevision {
  id: string;
  title: string;
  topic: string;
  course: string;
  format: RevisionFormat;
  content: string;
  timestamp: number;
}

/** Heuristic: detect a backend "this topic isn't in your documents" message. */
function looksNotCovered(markdown: string): boolean {
  const text = markdown.trim().toLowerCase();
  if (!text) return true;
  return (
    text.includes("not covered") ||
    text.includes("no relevant") ||
    text.includes("couldn't find") ||
    text.includes("could not find") ||
    text.includes("no information") ||
    text.includes("not found in")
  );
}

interface RevisionState {
  // Inputs (kept in the store so selections survive navigation too).
  format: RevisionFormat;
  topic: string;
  course: string; // "none" or a course name
  document: string | null;
  // Generation state — lives in the store, NOT the component, so an in-flight
  // generation keeps running and its result is preserved across page changes.
  loading: boolean;
  output: string | null;
  title: string | null;
  ungrounded: boolean;
  savedRevisions: SavedRevision[];
  setField: <K extends keyof RevisionState>(key: K, value: RevisionState[K]) => void;
  generate: () => Promise<void>;
  stop: () => void;
  saveRevision: (auto?: boolean) => void;
  loadRevision: (id: string) => void;
}

// Module-scoped so the stream survives component unmount (page navigation).
let controller: AbortController | null = null;

export const useRevisionStore = create<RevisionState>((set, get) => ({
  format: "notes",
  topic: "",
  course: "none",
  document: null,
  loading: false,
  output: null,
  title: null,
  ungrounded: false,
  savedRevisions: [],
  setField: (key, value) => set({ [key]: value } as Partial<RevisionState>),
  stop: () => {
    controller?.abort();
    controller = null;
    set({ loading: false });
  },
  saveRevision: (auto = false) => {
    const { output, title, topic, course, format, savedRevisions } = get();
    if (!output) return;
    
    // Prevent duplicate saves if we just auto-saved this output
    if (auto && savedRevisions.length > 0 && savedRevisions[0].content === output) {
      return;
    }

    const newRev: SavedRevision = {
      id: Date.now().toString(),
      title: title || "Untitled Revision",
      topic,
      course,
      format,
      content: output,
      timestamp: Date.now(),
    };
    set({ savedRevisions: [newRev, ...savedRevisions] });
    if (!auto) {
      toast.success("Revision saved");
    }
  },
  loadRevision: (id: string) => {
    const { savedRevisions } = get();
    const rev = savedRevisions.find((r) => r.id === id);
    if (rev) {
      set({
        output: rev.content,
        title: rev.title,
        topic: rev.topic,
        course: rev.course,
        format: rev.format,
        ungrounded: false,
      });
      toast.success("Revision loaded");
    }
  },
  generate: async () => {
    const { topic, course, document, format, loading } = get();
    if (loading) return;
    const t = topic.trim();
    const selectedCourse = course === "none" ? null : course;
    if (!t && !selectedCourse) {
      toast.error("Enter a topic or pick a course to generate a study sheet");
      return;
    }

    controller?.abort();
    const ctrl = new AbortController();
    controller = ctrl;

    set({ loading: true, output: null, title: null, ungrounded: false });

    let streamed = "";
    try {
      await api.revisionStream(
        { topic: t || undefined, course: selectedCourse, document, format },
        {
          signal: ctrl.signal,
          onToken: (chunk) => {
            streamed += chunk;
            set({ output: streamed });
          },
          onDone: ({ grounded, title }) => {
            const notCovered = !grounded || looksNotCovered(streamed);
            set({ title: title || null, ungrounded: notCovered });
            if (notCovered) {
              toast.warning("This topic may not be covered by your uploaded documents");
            } else {
              toast.success("Study sheet generated and auto-saved");
            }
            get().saveRevision(true);
          },
          onError: (msg) => {
            toast.error(msg || "Failed to generate study sheet");
          },
        },
      );
    } catch (err) {
      if ((err as any)?.name !== "AbortError") {
        toast.error(err instanceof Error ? err.message : "Failed to generate study sheet");
      }
    } finally {
      if (controller === ctrl) controller = null;
      set({ loading: false });
    }
  },
}));
```

## File: src/app/stores/useMindmapStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import { api, type GeneratedMindmap } from "../lib/api";

export const ALL_COURSES = "__all__";

interface MindmapState {
  // Inputs + generation result live in the store so an in-flight generation
  // keeps running and its result is preserved across page navigation.
  topic: string;
  course: string; // ALL_COURSES or a course name
  document: string | null;
  loading: boolean;
  mindmap: GeneratedMindmap | null;
  setField: <K extends keyof MindmapState>(key: K, value: MindmapState[K]) => void;
  generate: () => Promise<void>;
}

export const useMindmapStore = create<MindmapState>((set, get) => ({
  topic: "",
  course: ALL_COURSES,
  document: null,
  loading: false,
  mindmap: null,
  setField: (key, value) => set({ [key]: value } as Partial<MindmapState>),
  generate: async () => {
    const { topic, course, document, loading } = get();
    if (loading) return;
    const trimmed = topic.trim();
    if (!trimmed) {
      toast.error("Enter a topic to generate a mind map");
      return;
    }
    set({ loading: true });
    try {
      const result = await api.generateMindmap(trimmed, course === ALL_COURSES ? null : course, document);
      if (!result.grounded || !result.text?.trim()) {
        toast.error("No grounded mind map could be generated for this topic");
        set({ mindmap: null });
        return;
      }
      set({ mindmap: result });
      toast.success("Mind map generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate mind map");
    } finally {
      set({ loading: false });
    }
  },
}));
```

## File: src/app/stores/useQuizStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import type { Quiz } from "../lib/types";
import { api } from "../lib/api";

export type QuizStage = "builder" | "player" | "results";
export type Difficulty = Quiz["difficulty"];

const GROUNDED_ERROR =
  "Couldn't generate a grounded quiz — try a different topic or upload documents";

interface QuizState {
  // Flow state — lives in the store so it survives page navigation.
  stage: QuizStage;
  active: Quiz | null;
  // Player progress.
  idx: number;
  answers: Record<string, string>;
  // Generation flag — kept in the store, NOT the component, so an in-flight
  // generation keeps running and its result is preserved across unmount.
  generating: boolean;
  // Builder inputs — persisted so the user returns to the same selections.
  topic: string;
  course: string; // "all" or a course name
  document: string | null;
  difficulty: Difficulty;

  setField: <K extends keyof QuizState>(key: K, value: QuizState[K]) => void;
  generate: () => Promise<void>;
  start: (quiz: Quiz) => void;
  answer: (qid: string, value: string) => void;
  goTo: (idx: number) => void;
  submit: (answers: Record<string, string>) => void;
  backToBuilder: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  stage: "builder",
  active: null,
  idx: 0,
  answers: {},
  generating: false,
  topic: "",
  course: "all",
  document: null,
  difficulty: "Medium",

  setField: (key, value) => set({ [key]: value } as Partial<QuizState>),

  generate: async () => {
    const { topic, course, document, difficulty, generating } = get();
    if (generating) return;
    const value = topic.trim();
    if (!value) return;

    set({ generating: true });
    try {
      const quiz = await api.generateQuiz(
        value,
        course === "all" ? null : course,
        document,
        difficulty,
      );
      if (!quiz.grounded || quiz.questions.length === 0) {
        toast.error(GROUNDED_ERROR);
        return;
      }
      set({ active: quiz, answers: {}, idx: 0, stage: "player" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate quiz");
    } finally {
      set({ generating: false });
    }
  },

  start: (quiz) => set({ active: quiz, answers: {}, idx: 0, stage: "player" }),

  answer: (qid, value) =>
    set((s) => ({ answers: { ...s.answers, [qid]: value } })),

  goTo: (idx) => set({ idx }),

  submit: (answers) => set({ answers, stage: "results" }),

  backToBuilder: () => set({ stage: "builder" }),

  reset: () => set({ stage: "builder", active: null, answers: {}, idx: 0 }),
}));
```

## File: src/app/stores/useConceptActionStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import { api, type ConceptInspector } from "../lib/api";

interface ActionResult {
  title: string;
  body: string;
  mono: boolean;
}

interface ConceptActionState {
  // The in-flight action + its produced text result live in the store so they
  // survive navigating away from the Knowledge page and back. Both are tagged
  // with the concept id they belong to, so the panel only shows for that concept.
  running: string | null; // action label
  runningConceptId: string | null;
  result: ActionResult | null;
  resultConceptId: string | null;
  clearResult: () => void;
  runAction: (
    concept: ConceptInspector,
    conceptId: string,
    label: string,
    navigate: (to: string) => void,
  ) => Promise<void>;
}

export const useConceptActionStore = create<ConceptActionState>((set, get) => ({
  running: null,
  runningConceptId: null,
  result: null,
  resultConceptId: null,
  clearResult: () => set({ result: null, resultConceptId: null }),
  runAction: async (concept, conceptId, label, navigate) => {
    if (get().running) return;
    const name = concept.name;
    set({ running: label, runningConceptId: conceptId, result: null, resultConceptId: null });
    const open = (to: string) => ({ label: "Open", onClick: () => navigate(to) });
    try {
      if (label === "Explain Concept") {
        const r = await api.ask(`Explain the concept: ${name}`);
        set({ result: { title: `Explain: ${name}`, body: r.content, mono: false }, resultConceptId: conceptId });
      } else if (label === "Generate Summary") {
        const r = await api.generateRevision({ topic: name, format: "summary" });
        set({ result: { title: `Summary: ${name}`, body: r.markdown, mono: false }, resultConceptId: conceptId });
      } else if (label === "Generate Mind Map") {
        const r = await api.generateMindmap(name);
        set({ result: { title: `Mind Map: ${name}`, body: r.text, mono: true }, resultConceptId: conceptId });
      } else if (label === "Generate Flashcards") {
        const r = await api.generateFlashcards(name);
        if (!r.cards.length) {
          toast.error("No grounded flashcards for this concept");
        } else {
          await api.saveDeck(name, null, r.cards);
          toast.success(`${r.cards.length} flashcards saved`, { action: open("/flashcards") });
        }
      } else if (label === "Generate Quiz") {
        const r = await api.generateQuiz(name);
        if (!r.questions.length) {
          toast.error("No grounded quiz for this concept");
        } else {
          await api.saveQuiz({ title: name, difficulty: r.difficulty, questions: r.questions });
          toast.success("Quiz saved", { action: open("/quiz") });
        }
      } else if (label === "Generate Diagram") {
        const r = await api.generateDiagram(name);
        if (!r.grounded || !r.mermaid.trim()) {
          toast.error("Couldn't generate a diagram");
        } else {
          toast.success("Diagram generated", { action: open("/diagrams") });
        }
      } else if (label === "Add To Notebook") {
        const ex = await api.ask(`Explain the concept: ${name}`);
        const nb = await api.createNotebook(name);
        await api.updateNotebook(nb.id, {
          blocks: [
            { type: "heading", level: 1, text: name },
            { type: "ai-answer", question: `Explain ${name}`, answer: ex.content, confidence: 1, sources: 0 },
          ],
        });
        toast.success("Added to notebook", { action: open("/notebooks") });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `${label} failed`);
    } finally {
      set({ running: null, runningConceptId: null });
    }
  },
}));
```

## File: src/app/stores/useFlashcardGenStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import type { Flashcard } from "../lib/types";
import { api } from "../lib/api";

const NO_GROUNDED_MESSAGE =
  "No grounded flashcards — try uploading documents or a different topic.";

type View = "grid" | "list" | "study";

interface FlashcardGenState {
  // View mode + generation inputs kept in the store so they survive navigation.
  view: View;
  topic: string;
  course: string | null; // null = all courses
  document: string | null;
  // Generation state — lives in the store, NOT the component, so an in-flight
  // generation keeps running and its result is preserved across page changes.
  generating: boolean;
  // The freshly generated (unsaved) cards. The empty array means "no generated
  // set is currently active".
  cards: Flashcard[];
  ungrounded: boolean;
  // The deck name proposed by the generate flow (used as default save name).
  generatedDeckName: string | null;
  // Name of the deck the generated cards were saved as, or null while unsaved.
  // Kept here so the page can distinguish an unsaved generated set from a saved
  // one even after navigation.
  activeDeck: string | null;
  setField: <K extends keyof FlashcardGenState>(key: K, value: FlashcardGenState[K]) => void;
  setCards: (cards: Flashcard[]) => void;
  generate: () => Promise<void>;
  clearGenerated: () => void;
}

export const useFlashcardGenStore = create<FlashcardGenState>((set, get) => ({
  view: "grid",
  topic: "",
  course: null,
  document: null,
  generating: false,
  cards: [],
  ungrounded: false,
  generatedDeckName: null,
  activeDeck: null,
  setField: (key, value) => set({ [key]: value } as Partial<FlashcardGenState>),
  setCards: (cards) => set({ cards }),
  clearGenerated: () =>
    set({ cards: [], ungrounded: false, generatedDeckName: null, activeDeck: null }),
  generate: async () => {
    const { topic, course, document, generating } = get();
    const value = topic.trim();
    if (!value || generating) return;
    set({ generating: true, ungrounded: false });
    try {
      const result = await api.generateFlashcards(value, course, document);
      if (!result.grounded || result.cards.length === 0) {
        set({
          cards: [],
          activeDeck: null,
          generatedDeckName: null,
          ungrounded: true,
        });
        toast.error(NO_GROUNDED_MESSAGE);
        return;
      }
      set({
        cards: result.cards,
        activeDeck: null,
        generatedDeckName: result.deck,
        ungrounded: false,
      });
      toast.success(`Generated ${result.cards.length} flashcards`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate flashcards");
    } finally {
      set({ generating: false });
    }
  },
}));
```

## File: src/app/stores/useDiagramGenStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../lib/api";
import type { DiagramItem } from "../lib/types";

interface DiagramGenState {
  // Generation inputs + in-flight flag + last produced diagram live in the
  // store, so a generation started here keeps running and its result is
  // preserved when navigating away from the page and back.
  topic: string;
  course: string; // "none" or a course name
  document: string | null;
  type: string;
  generating: boolean;
  generated: DiagramItem | null; // most recent successful generation
  activeId: string | null; // id of the diagram open in the viewer (survives nav)
  setField: <K extends keyof DiagramGenState>(key: K, value: DiagramGenState[K]) => void;
  generate: () => Promise<DiagramItem | null>;
}

export const useDiagramGenStore = create<DiagramGenState>((set, get) => ({
  topic: "",
  course: "none",
  document: null,
  type: "flowchart",
  generating: false,
  generated: null,
  activeId: null,
  setField: (key, value) => set({ [key]: value } as Partial<DiagramGenState>),
  generate: async () => {
    const { topic, course, document, type, generating } = get();
    if (generating) return null;
    const t = topic.trim();
    if (!t) {
      toast.error("Enter a topic to generate a diagram");
      return null;
    }
    set({ generating: true });
    try {
      const result = await api.generateDiagram(t, course === "none" ? null : course, document, type);
      if (!result.grounded || !result.mermaid?.trim()) {
        toast.error(
          !result.grounded ? "Couldn't ground a diagram for that topic" : "The generated diagram was empty",
        );
        return null;
      }
      const diagram: DiagramItem = {
        id: result.id,
        title: result.title,
        course: result.course,
        kind: result.kind,
        mermaid: result.mermaid,
      };
      set({ generated: diagram, activeId: diagram.id });
      toast.success("Diagram generated");
      return diagram;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate diagram");
      return null;
    } finally {
      set({ generating: false });
    }
  },
}));
```

## File: src/app/stores/useKnowledgeBaseStore.ts
```typescript
import { create } from "zustand";

interface KnowledgeBaseState {
  // Exploration/session state — kept in the store so the user's research
  // session (selected concept, search text, collection/filters, course filter,
  // panel layout) survives navigating away from the Knowledge page and back.
  // `graph`, `loading`, `building`, `courses` and `sidebar` deliberately stay
  // local in the component since they are re-fetched on mount.
  selectedId: string | null;
  drawerConceptId: string | null;
  searchQuery: string;
  activeCollection: string | null;
  course: string | null;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  // Stored as a plain array (not a Set) to keep it serializable/simple; the
  // component derives a Set locally where membership checks are needed.
  activeFilters: string[];
  // Whether the source-type filter defaults have been seeded for this session.
  // Lets `loadSidebar` apply "enable all filters" only on a fresh session and
  // never clobber a restored selection on remount.
  initializedFilters: boolean;
  setField: <K extends keyof KnowledgeBaseState>(key: K, value: KnowledgeBaseState[K]) => void;
  toggleFilter: (name: string) => void;
}

export const useKnowledgeBaseStore = create<KnowledgeBaseState>((set) => ({
  selectedId: null,
  drawerConceptId: null,
  searchQuery: "",
  activeCollection: null,
  course: null,
  leftCollapsed: false,
  rightCollapsed: false,
  activeFilters: [],
  initializedFilters: false,
  setField: (key, value) => set({ [key]: value } as Partial<KnowledgeBaseState>),
  toggleFilter: (name) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(name)
        ? state.activeFilters.filter((f) => f !== name)
        : [...state.activeFilters, name],
    })),
}));
```

## File: src/app/stores/useExamStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import { api, type ExamResult, type ExamSession } from "../lib/api";

export type ExamStage = "builder" | "session" | "results";

/** Generated questions arrive as the API `ExamQuestionOut` shape; it matches `ExamQuestion`. */
type GeneratedQuestion = ExamSession["questions"][number];

interface ExamState {
  // ---- Stage / session state (must survive navigation) ----
  stage: ExamStage;
  sessionId: string | null;
  questions: GeneratedQuestion[];
  answers: Record<string, string>;
  difficultyLabel: string;
  result: ExamResult | null;

  // ---- Progress within a session (so position resumes) ----
  idx: number;
  flagged: string[];
  visited: string[];
  /** Absolute epoch-ms timestamp at which the timer hits zero. Source of truth
   * for the countdown so navigating away and back resumes the correct remaining
   * time (the component derives seconds-left from this each render/tick). */
  deadline: number | null;

  // ---- In-flight flags ----
  generating: boolean;
  submitting: boolean;

  // ---- Builder inputs (kept here so selections survive navigation too) ----
  topic: string;
  course: string; // "all" or a course name
  document: string | null;
  difficulty: string;
  count: number;
  minutes: number;
  coverage: string;
  types: string[];
  /** When set, the backend mirrors this course's PYQ topic/difficulty mix and
   * records per-topic accuracy on submit. Seeded by the PYQ Analysis page. */
  pyqCourse: string | null;

  setField: <K extends keyof ExamState>(key: K, value: ExamState[K]) => void;
  answer: (qid: string, value: string) => void;
  toggleFlag: (qid: string) => void;
  goto: (i: number) => void;
  generate: () => Promise<void>;
  submit: () => Promise<void>;
  reset: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  stage: "builder",
  sessionId: null,
  questions: [],
  answers: {},
  difficultyLabel: "Adaptive",
  result: null,

  idx: 0,
  flagged: [],
  visited: [],
  deadline: null,

  generating: false,
  submitting: false,

  topic: "",
  course: "all",
  document: null,
  difficulty: "Adaptive",
  count: 8,
  minutes: 20,
  coverage: "Entire Course",
  types: ["mcq"],
  pyqCourse: null,

  setField: (key, value) => set({ [key]: value } as Partial<ExamState>),

  answer: (qid, value) =>
    set((s) => ({ answers: { ...s.answers, [qid]: value } })),

  toggleFlag: (qid) =>
    set((s) => ({
      flagged: s.flagged.includes(qid)
        ? s.flagged.filter((id) => id !== qid)
        : [...s.flagged, qid],
    })),

  goto: (i) =>
    set((s) => {
      const q = s.questions[i];
      if (!q) return {};
      return {
        idx: i,
        visited: s.visited.includes(q.id) ? s.visited : [...s.visited, q.id],
      };
    }),

  generate: async () => {
    const { generating, topic, course, document, difficulty, count, minutes, types, pyqCourse } = get();
    if (generating) return;
    set({ generating: true });
    try {
      const session = await api.generateExam({
        topic: topic.trim() || undefined,
        course: course === "all" ? null : course,
        document,
        // "Adaptive" is a UI-only option; the backend expects a concrete level.
        difficulty:
          difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard"
            ? difficulty
            : undefined,
        count,
        types,
        pyqCourse,
      });
      if (!session.grounded || session.questions.length === 0) {
        toast.error(
          "Couldn't generate a grounded exam from your materials. Try another topic or course.",
        );
        return;
      }
      toast.success(`Generated ${session.questions.length} questions`);
      set({
        sessionId: session.sessionId,
        questions: session.questions,
        difficultyLabel: difficulty,
        answers: {},
        result: null,
        idx: 0,
        flagged: [],
        visited: [session.questions[0].id],
        deadline: Date.now() + minutes * 60 * 1000,
        stage: "session",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate exam");
    } finally {
      set({ generating: false });
    }
  },

  submit: async () => {
    const { submitting, sessionId, answers, minutes, deadline } = get();
    if (submitting || !sessionId) return;
    set({ submitting: true });
    const totalSecs = minutes * 60;
    const secsLeft = deadline
      ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      : 0;
    const timeSpent = totalSecs - secsLeft;
    try {
      const result = await api.submitExam(sessionId, answers, timeSpent);
      set({ result, stage: "results", submitting: false });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit exam");
      set({ submitting: false });
    }
  },

  reset: () =>
    set({
      stage: "builder",
      sessionId: null,
      questions: [],
      answers: {},
      result: null,
      idx: 0,
      flagged: [],
      visited: [],
      deadline: null,
      submitting: false,
      pyqCourse: null,
    }),
}));
```

## File: src/app/stores/usePyqStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import { api, type PyqAnalysis, type PyqDifferenceSuggestion, type PyqPaper, type PyqQuestion } from "../lib/api";

export interface PyqFilters {
  year?: number;
  topic?: string;
  difficulty?: string;
  type?: string;
  q?: string;
}

interface PyqState {
  course: string; // selected course (never "all" — analysis is per-course)
  analysis: PyqAnalysis | null;
  papers: PyqPaper[];
  questions: PyqQuestion[];
  differences: PyqDifferenceSuggestion[];
  filters: PyqFilters;

  // UI
  selectedTopic: string | null;
  selectedPattern: string | null;

  // in-flight
  loading: boolean;
  uploading: boolean;

  setField: <K extends keyof PyqState>(key: K, value: PyqState[K]) => void;
  setFilter: <K extends keyof PyqFilters>(key: K, value: PyqFilters[K]) => void;
  selectCourse: (course: string) => Promise<void>;
  refresh: () => Promise<void>;
  fetchQuestions: () => Promise<void>;
  uploadPaper: (file: File, year?: number | null) => Promise<void>;
  deletePaper: (id: number) => Promise<void>;
}

export const usePyqStore = create<PyqState>((set, get) => ({
  course: "",
  analysis: null,
  papers: [],
  questions: [],
  differences: [],
  filters: {},
  selectedTopic: null,
  selectedPattern: null,
  loading: false,
  uploading: false,

  setField: (key, value) => set({ [key]: value } as Partial<PyqState>),
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value || undefined } })),

  selectCourse: async (course) => {
    set({ course, analysis: null, papers: [], questions: [], differences: [], filters: {}, selectedTopic: null, selectedPattern: null });
    if (course) await get().refresh();
  },

  refresh: async () => {
    const { course } = get();
    if (!course) return;
    set({ loading: true });
    try {
      const [analysis, papers, differences] = await Promise.all([
        api.getPyqAnalysis(course),
        api.listPyqPapers(course),
        api.getPyqDifferenceSuggestions(course),
      ]);
      set({ analysis, papers, differences });
      await get().fetchQuestions();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load PYQ analysis");
    } finally {
      set({ loading: false });
    }
  },

  fetchQuestions: async () => {
    const { course, filters } = get();
    if (!course) return;
    try {
      const questions = await api.listPyqQuestions(course, filters);
      set({ questions });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load questions");
    }
  },

  uploadPaper: async (file, year) => {
    const { course } = get();
    if (!course) {
      toast.error("Select a course first");
      return;
    }
    set({ uploading: true });
    try {
      const res = await api.uploadPyqPaper(file, course, year);
      toast.success(`Extracted ${res.extracted} questions from ${res.paper.title}`);
      await get().refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      set({ uploading: false });
    }
  },

  deletePaper: async (id) => {
    try {
      await api.deletePyqPaper(id);
      toast.success("Paper removed");
      await get().refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete paper");
    }
  },
}));
```

## File: src/app/stores/useTeachStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import {
  api,
  type FlashcardSet,
  type GeneratedQuiz,
  type GeneratedDiagram,
  type GeneratedMindmap,
  type GeneratedRevision,
} from "../lib/api";
import type { GeneratedDifference, Source, Course, DocumentItem } from "../lib/types";

export type Depth = "quick" | "standard" | "deep";

// The lazily-generated artifacts (Overview + Sources are handled separately).
export type ArtifactKey = "notes" | "flashcards" | "quiz" | "mindmap" | "diagram" | "difference";

export type ViewKey = "overview" | ArtifactKey | "sources";

export type SlotStatus = "idle" | "queued" | "loading" | "done" | "error";

export const ARTIFACT_KEYS: ArtifactKey[] = [
  "notes",
  "flashcards",
  "quiz",
  "mindmap",
  "diagram",
  "difference",
];

interface ArtifactSlot {
  status: SlotStatus;
  data: unknown | null;
  error: string | null;
}

const idleSlot = (): ArtifactSlot => ({ status: "idle", data: null, error: null });

function freshArtifacts(): Record<ArtifactKey, ArtifactSlot> {
  return {
    notes: idleSlot(),
    flashcards: idleSlot(),
    quiz: idleSlot(),
    mindmap: idleSlot(),
    diagram: idleSlot(),
    difference: idleSlot(),
  };
}

const DEPTH_COUNT: Record<Depth, number> = { quick: 6, standard: 8, deep: 12 };
const DEPTH_DIFFICULTY: Record<Depth, "Easy" | "Medium" | "Hard"> = {
  quick: "Easy",
  standard: "Medium",
  deep: "Hard",
};

interface TeachState {
  phase: "input" | "workspace";
  topic: string;
  depth: Depth;
  course: string;
  document: string | null;
  selected: Record<ArtifactKey, boolean>;

  courses: Course[];
  documents: DocumentItem[];
  _listsLoaded: boolean;

  packageId: string | null;
  activeView: ViewKey;

  overview: GeneratedRevision | null; // { title, markdown, grounded }
  overviewStatus: SlotStatus;
  sources: Source[];

  artifacts: Record<ArtifactKey, ArtifactSlot>;

  // Live progress for the "what's generating now" UI.
  generating: boolean;
  currentTask: ViewKey | null;

  saving: boolean;

  setField: <K extends keyof TeachState>(key: K, value: TeachState[K]) => void;
  toggleArtifact: (key: ArtifactKey) => void;
  startGenerate: () => Promise<void>;
  retryArtifact: (key: ArtifactKey) => Promise<void>;
  openView: (view: ViewKey) => void;
  savePackage: () => Promise<void>;
  loadPackage: (id: string) => Promise<void>;
  reset: () => void;

  setCourse: (c: string) => void;
  setDocument: (d: string | null) => void;
  fetchCoursesAndDocs: () => void;
}

export const useTeachStore = create<TeachState>((set, get) => ({
  phase: "input",
  topic: "",
  depth: "standard",
  course: "none",
  document: null,
  courses: [],
  documents: [],
  _listsLoaded: false,
  selected: {
    notes: true,
    flashcards: true,
    quiz: true,
    mindmap: true,
    diagram: true,
    difference: true,
  },

  packageId: null,
  activeView: "overview",

  overview: null,
  overviewStatus: "idle",
  sources: [],

  artifacts: freshArtifacts(),

  generating: false,
  currentTask: null,

  saving: false,

  setField: (key, value) => set({ [key]: value } as Partial<TeachState>),

  setCourse: (c) => set({ course: c, document: null }),
  setDocument: (d) => set({ document: d }),

  fetchCoursesAndDocs: () => {
    if (get()._listsLoaded) return;
    Promise.all([api.listCourses(), api.listDocuments()])
      .then(([courses, documents]) => set({ courses, documents, _listsLoaded: true }))
      .catch(() => {});
  },

  toggleArtifact: (key) =>
    set((s) => ({ selected: { ...s.selected, [key]: !s.selected[key] } })),

  startGenerate: async () => {
    const { topic, depth, selected } = get();
    const trimmed = topic.trim();
    if (!trimmed) {
      toast.error("Enter a topic to teach");
      return;
    }

    // Seed the workspace: overview loading, selected artifacts queued.
    const artifacts = freshArtifacts();
    for (const key of ARTIFACT_KEYS) {
      if (selected[key]) artifacts[key].status = "queued";
    }
    set({
      phase: "workspace",
      activeView: "overview",
      packageId: null,
      overview: null,
      overviewStatus: "loading",
      sources: [],
      artifacts,
      generating: true,
      currentTask: "overview",
    });

    // 1) Overview (and the sources that drive the Sources view).
    try {
      const selectedCourse = get().course === "none" ? null : get().course;
      const result = await api.generateOverview(trimmed, depth, selectedCourse, get().document);
      set({
        overview: { title: result.title, markdown: result.markdown, grounded: result.grounded },
        sources: result.sources,
        overviewStatus: "done",
      });
    } catch (err) {
      set({ overviewStatus: "error" });
      toast.error(err instanceof Error ? err.message : "Failed to generate overview");
    }

    // 2) Each selected artifact, one at a time (clear progress + one model
    //    loaded at a time on local Ollama).
    for (const key of ARTIFACT_KEYS) {
      if (!get().selected[key]) continue;
      set({ currentTask: key });
      await generateArtifact(key, set, get);
    }

    set({ generating: false, currentTask: null });
  },

  retryArtifact: async (key) => {
    if (get().artifacts[key].status === "loading") return;
    await generateArtifact(key, set, get);
  },

  openView: (view) => {
    set({ activeView: view });
  },

  savePackage: async () => {
    const { topic, depth, overview, sources, artifacts, saving } = get();
    if (saving) return;
    if (!overview) {
      toast.error("Nothing to save yet");
      return;
    }
    set({ saving: true });
    try {
      const artifactPayload: Record<string, unknown> = {};
      for (const key of ARTIFACT_KEYS) {
        if (artifacts[key].data) artifactPayload[key] = artifacts[key].data;
      }
      const saved = await api.savePackage({
        title: topic.trim(),
        depth,
        overview: { markdown: overview.markdown, grounded: overview.grounded },
        artifacts: artifactPayload,
        sources,
      });
      set({ packageId: saved.id });
      toast.success("Learning package saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save package");
    } finally {
      set({ saving: false });
    }
  },

  loadPackage: async (id) => {
    try {
      const pkg = await api.getPackage(id);
      const artifacts = freshArtifacts();
      const selected: Record<ArtifactKey, boolean> = {
        notes: false,
        flashcards: false,
        quiz: false,
        mindmap: false,
        diagram: false,
        difference: false,
      };
      for (const key of ARTIFACT_KEYS) {
        const data = pkg.artifacts?.[key];
        if (data) {
          artifacts[key] = { status: "done", data, error: null };
          selected[key] = true;
        }
      }
      set({
        phase: "workspace",
        topic: pkg.title,
        depth: (pkg.depth as Depth) || "standard",
        packageId: pkg.id,
        activeView: "overview",
        overview: {
          title: pkg.title,
          markdown: pkg.overview?.markdown ?? "",
          grounded: pkg.overview?.grounded ?? false,
        },
        overviewStatus: "done",
        sources: pkg.sources ?? [],
        artifacts,
        selected,
        generating: false,
        currentTask: null,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open package");
    }
  },

  reset: () =>
    set({
      phase: "input",
      packageId: null,
      activeView: "overview",
      overview: null,
      overviewStatus: "idle",
      sources: [],
      artifacts: freshArtifacts(),
      generating: false,
      currentTask: null,
    }),
}));

// Generate a single artifact and store it in its slot. Kept outside the store
// object so the pipeline, retry and loadPackage can share it.
async function generateArtifact(
  key: ArtifactKey,
  set: (partial: Partial<TeachState> | ((s: TeachState) => Partial<TeachState>)) => void,
  get: () => TeachState,
): Promise<void> {
  const { topic, depth } = get();
  const t = topic.trim();
  const setSlot = (slot: Partial<ArtifactSlot>) =>
    set((s) => ({ artifacts: { ...s.artifacts, [key]: { ...s.artifacts[key], ...slot } } }));

  setSlot({ status: "loading", error: null });
  try {
    const selectedCourse = get().course === "none" ? null : get().course;
    const doc = get().document;
    let data: FlashcardSet | GeneratedQuiz | GeneratedDiagram | GeneratedMindmap | GeneratedRevision | GeneratedDifference;
    switch (key) {
      case "notes":
        data = await api.generateRevision({ topic: t, course: selectedCourse, document: doc, format: "notes" });
        break;
      case "flashcards":
        data = await api.generateFlashcards(t, selectedCourse, doc, DEPTH_COUNT[depth]);
        break;
      case "quiz":
        data = await api.generateQuiz(t, selectedCourse, doc, DEPTH_DIFFICULTY[depth]);
        break;
      case "mindmap":
        data = await api.generateMindmap(t, selectedCourse, doc);
        break;
      case "diagram":
        data = await api.generateDiagram(t, selectedCourse, doc);
        break;
      case "difference":
        data = await api.generateDifference(t, selectedCourse, doc);
        break;
    }
    setSlot({ status: "done", data });
  } catch (err) {
    setSlot({ status: "error", error: err instanceof Error ? err.message : "Generation failed" });
  }
}
```

## File: src/app/stores/useSettingsStore.ts
```typescript
import { create } from "zustand";
import { api, type BackendSettings } from "../lib/api";

interface SettingsState {
  fastModel: string;
  reasoningModel: string;
  embeddingModel: string;
  visionModel: string;
  temperature: number;
  topK: number;
  similarityThreshold: number;
  streaming: boolean;
  citationsInline: boolean;
  accent: "violet" | "cyan" | "green";
  density: "comfortable" | "compact";
  industry: string;
  role: string;
  goals: string;
  interests: string;
  learningPreferences: string;
  hydrated: boolean;
  set: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  hydrate: () => Promise<void>;
}

const PERSISTED: (keyof BackendSettings)[] = [
  "fastModel",
  "reasoningModel",
  "embeddingModel",
  "visionModel",
  "temperature",
  "topK",
  "similarityThreshold",
  "streaming",
  "citationsInline",
  "accent",
  "density",
  "industry",
  "role",
  "goals",
  "interests",
  "learningPreferences",
];

export const useSettingsStore = create<SettingsState>((set) => ({
  fastModel: "qwen3:8b",
  reasoningModel: "gemma4:12b",
  embeddingModel: "qwen3-embedding:0.6b",
  visionModel: "qwen2.5vl:3b",
  temperature: 0.4,
  topK: 5,
  similarityThreshold: 0.45,
  streaming: true,
  citationsInline: true,
  accent: "violet",
  density: "comfortable",
  industry: "",
  role: "",
  goals: "",
  interests: "",
  learningPreferences: "",
  hydrated: false,
  set: (key, value) => {
    set({ [key]: value } as Partial<SettingsState>);
    // Persist the single changed field to the backend (fire-and-forget).
    if (PERSISTED.includes(key as keyof BackendSettings)) {
      api.updateSettings({ [key]: value } as Partial<BackendSettings>).catch(() => {});
    }
  },
  hydrate: async () => {
    try {
      const remote = await api.getSettings();
      set({ ...remote, accent: remote.accent as SettingsState["accent"], density: remote.density as SettingsState["density"], hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
}));
```

## File: src/app/stores/useDifferencesStore.ts
```typescript
import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../lib/api";
import type { Course, DifferenceTableItem, DocumentItem, GeneratedDifference } from "../lib/types";

interface DifferencesState {
  topic: string;
  course: string;       // "none" or course name
  document: string | null;
  loading: boolean;
  output: GeneratedDifference | null;
  showRaw: boolean;
  suggestions: string[];
  saved: DifferenceTableItem[];
  courses: Course[];
  documents: DocumentItem[];
  _suggestionsLoaded: boolean;
  _listsLoaded: boolean;

  setTopic: (t: string) => void;
  setCourse: (c: string) => void;
  setDocument: (d: string | null) => void;
  setShowRaw: (v: boolean) => void;
  generate: () => Promise<void>;
  fetchSuggestions: () => void;
  fetchSaved: () => void;
  fetchCoursesAndDocs: () => void;
  saveTable: () => Promise<void>;
  deleteTable: (id: number) => Promise<void>;
  loadSaved: (item: DifferenceTableItem) => void;
}

export const useDifferencesStore = create<DifferencesState>((set, get) => ({
  topic: "",
  course: "none",
  document: null,
  loading: false,
  output: null,
  showRaw: false,
  suggestions: [],
  saved: [],
  courses: [],
  documents: [],
  _suggestionsLoaded: false,
  _listsLoaded: false,

  setTopic: (t) => set({ topic: t }),
  setCourse: (c) => set({ course: c, document: null }),
  setDocument: (d) => set({ document: d }),
  setShowRaw: (v) => set({ showRaw: v }),

  fetchSuggestions: () => {
    if (get()._suggestionsLoaded) return;
    api
      .getDifferenceSuggestions()
      .then((s) => set({ suggestions: s, _suggestionsLoaded: true }))
      .catch(() => {});
  },

  fetchSaved: () => {
    api
      .listDifferences()
      .then((s) => set({ saved: s }))
      .catch(() => {});
  },

  fetchCoursesAndDocs: () => {
    if (get()._listsLoaded) return;
    Promise.all([api.listCourses(), api.listDocuments()])
      .then(([courses, documents]) => set({ courses, documents, _listsLoaded: true }))
      .catch(() => {});
  },

  generate: async () => {
    const { topic, course, document, loading } = get();
    const t = topic.trim();
    if (!t || loading) return;
    const selectedCourse = course === "none" ? null : course;
    set({ loading: true, output: null });
    try {
      const result = await api.generateDifference(t, selectedCourse, document);
      set({ output: result });
    } catch {
      toast.error("Failed to generate comparison");
    } finally {
      set({ loading: false });
    }
  },

  saveTable: async () => {
    const { output, course } = get();
    if (!output) return;
    const selectedCourse = course === "none" ? null : course;
    try {
      const item = await api.saveDifference(output.title, output.content, selectedCourse);
      set({ saved: [item, ...get().saved] });
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    }
  },

  deleteTable: async (id) => {
    try {
      await api.deleteDifference(id);
      set({ saved: get().saved.filter((s) => s.id !== id) });
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  },

  loadSaved: (item) => {
    set({
      output: { title: item.title, content: item.content, grounded: true },
      topic: item.title,
    });
  },
}));
```

## File: src/app/context/OnboardingContext.tsx
```typescript
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { api } from "../lib/api";

export type ImportFileStatus = "queued" | "processing" | "completed" | "failed";

export interface ImportFile {
  id: string;
  file: File;
  status: ImportFileStatus;
  error?: string;
}

export interface OnboardingAnalysis {
  documents: number;
  pages: number;
  topics: string[];
  concepts: string[];
  sources: number;
}

interface OnboardingState {
  files: ImportFile[];
  analysis: OnboardingAnalysis | null;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  startImport: () => Promise<void>;
  setAnalysis: (a: OnboardingAnalysis) => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [analysis, setAnalysis] = useState<OnboardingAnalysis | null>(null);
  const importingRef = useRef(false);

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.file.name));
      const toAdd = newFiles
        .filter((f) => !existingNames.has(f.name))
        .map((f) => ({
          id: `${f.name}-${f.size}`,
          file: f,
          status: "queued" as ImportFileStatus,
        }));
      return [...prev, ...toAdd];
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const startImport = async () => {
    if (importingRef.current) return;
    importingRef.current = true;

    for (const item of files) {
      if (item.status === "completed") continue;

      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "processing" } : f)),
      );

      try {
        await api.uploadDocument(item.file, "Library");
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: "completed" } : f)),
        );
      } catch (err) {
        const error = err instanceof Error ? err.message : "Upload failed";
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: "failed", error } : f)),
        );
      }
    }

    importingRef.current = false;
  };

  return (
    <OnboardingContext.Provider
      value={{ files, analysis, addFiles, removeFile, startImport, setAnalysis }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
```

## File: src/styles/index.css
```css
@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
```

## File: src/styles/tailwind.css
```css
@import 'tailwindcss' source(none);
@source '../**/*.{js,ts,jsx,tsx}';

@import 'tw-animate-css';
```

## File: src/styles/fonts.css
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..500&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400..600&family=JetBrains+Mono:wght@400;500&display=swap');
```

## File: src/styles/theme.css
```css
@custom-variant dark (&:is(.dark *));

/* ============================================================
   ScholarAI — Editorial / academic light theme
   Warm paper, ink type, hairline borders, a single muted
   indigo accent. Designed to read like a study journal,
   not a SaaS dashboard.
   ============================================================ */

:root {
  --font-size: 15px;

  /* Surfaces */
  --background: #f6f5f1;        /* warm paper */
  --foreground: #211f1b;        /* ink */
  --card: #fffefb;             /* sheet white */
  --card-foreground: #211f1b;
  --popover: #fffefb;
  --popover-foreground: #211f1b;

  /* Primary = ink */
  --primary: #211f1b;
  --primary-foreground: #f6f5f1;

  --secondary: #efece5;
  --secondary-foreground: #211f1b;

  --muted: #efece5;
  --muted-foreground: #79736a;

  --accent: #ebe8e0;
  --accent-foreground: #211f1b;

  --destructive: #9f3a36;
  --destructive-foreground: #ffffff;

  --border: #e4e0d6;
  --input: #e4e0d6;
  --input-background: #fffefb;
  --switch-background: #d4cfc2;

  --ring: #211f1b;

  /* Single restrained accent + muted semantic tones.
     Names kept from the previous palette so components
     update automatically. */
  --violet: #4f4d7a;            /* the accent: muted indigo */
  --violet-soft: rgba(79, 77, 122, 0.10);
  --cyan: #3f6b6f;              /* muted teal, used sparingly */
  --cyan-soft: rgba(63, 107, 111, 0.10);
  --success: #3f7a4e;
  --success-soft: rgba(63, 122, 78, 0.12);
  --warning: #a3771f;
  --warning-soft: rgba(163, 119, 31, 0.14);
  --danger: #9f3a36;
  --danger-soft: rgba(159, 58, 54, 0.10);

  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-normal: 400;

  --chart-1: #4f4d7a;
  --chart-2: #3f6b6f;
  --chart-3: #3f7a4e;
  --chart-4: #a3771f;
  --chart-5: #9f3a36;

  --radius: 0.5rem;

  /* Sidebar — quiet, slightly deeper than the page */
  --sidebar: #ffffff;
  --sidebar-foreground: #4a453d;
  --sidebar-primary: #211f1b;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #efece5;
  --sidebar-accent-foreground: #211f1b;
  --sidebar-border: #e4e0d6;
  --sidebar-ring: #211f1b;
}

/* The app shell still applies `.dark`; keep it identical to the
   light theme so the editorial look is enforced everywhere. */
.dark {
  --background: #f6f5f1;
  --foreground: #211f1b;
  --card: #fffefb;
  --card-foreground: #211f1b;
  --popover: #fffefb;
  --popover-foreground: #211f1b;
  --primary: #211f1b;
  --primary-foreground: #f6f5f1;
  --secondary: #efece5;
  --secondary-foreground: #211f1b;
  --muted: #efece5;
  --muted-foreground: #79736a;
  --accent: #ebe8e0;
  --accent-foreground: #211f1b;
  --destructive: #9f3a36;
  --destructive-foreground: #ffffff;
  --border: #e4e0d6;
  --input: #e4e0d6;
  --input-background: #fffefb;
  --switch-background: #d4cfc2;
  --ring: #211f1b;
}

@theme inline {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);

  --color-violet: var(--violet);
  --color-violet-soft: var(--violet-soft);
  --color-cyan: var(--cyan);
  --color-cyan-soft: var(--cyan-soft);
  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
  --color-warning: var(--warning);
  --color-warning-soft: var(--warning-soft);
  --color-danger: var(--danger);
  --color-danger-soft: var(--danger-soft);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 2px);
  --radius-xl: calc(var(--radius) + 6px);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/40;
  }

  html {
    font-size: var(--font-size);
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  /* Editorial headings — serif display for the big type,
     clean sans for compact UI headers. */
  h1 {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  h2 {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.015em;
  }

  h3 {
    font-size: var(--text-lg);
    font-weight: var(--font-weight-semibold);
    line-height: 1.4;
    letter-spacing: -0.01em;
  }

  h4 {
    font-size: var(--text-base);
    font-weight: var(--font-weight-semibold);
    line-height: 1.5;
  }

  label {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  button {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  input {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-normal);
    line-height: 1.5;
  }
}

/* Quiet scrollbars */
@layer base {
  * {
    scrollbar-width: thin;
    scrollbar-color: #d4cfc2 transparent;
  }
  *::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }
  *::-webkit-scrollbar-thumb {
    background: #ddd8cc;
    border-radius: 9999px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  *::-webkit-scrollbar-thumb:hover {
    background: #cfc9bb;
    background-clip: content-box;
  }
  *::-webkit-scrollbar-track {
    background: transparent;
  }
}

@layer utilities {
  /* Editorial display type helper */
  .font-display {
    font-family: var(--font-serif);
    letter-spacing: -0.02em;
  }
  .font-reading {
    font-family: var(--font-serif);
  }
  /* Long-form reading (textbooks / papers) */
  .font-book {
    font-family: 'IBM Plex Serif', Georgia, serif;
  }
  /* Highlighter mark — a student touch */
  .study-mark {
    background: linear-gradient(transparent 60%, rgba(163, 119, 31, 0.28) 60%);
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  /* Faint paper texture for hero surfaces */
  .paper {
    background-image: radial-gradient(rgba(33, 31, 27, 0.025) 1px, transparent 1px);
    background-size: 20px 20px;
  }
}
```

## File: src/styles/globals.css
```css

```

## File: guidelines/Guidelines.md
```md
**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
```

