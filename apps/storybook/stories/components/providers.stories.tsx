import React, { useState, useCallback, useRef } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  ThemeProvider,
  useTheme,
  OverlayProvider,
  DialogProvider,
  TooltipProvider,
  ToastProvider,
  useToast,
} from '@paper-ui/components/providers';
import { SketchBorder } from '@paper-ui/core';
import { PaperButton, SketchButton } from '@paper-ui/components/buttons';
import { PaperCard } from '@paper-ui/core';
import { SectionHeader } from '@paper-ui/core';
import { Sun, Moon, X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const meta = {
  title: 'Components/Providers',
  parameters: {
    layout: 'padded',
    docs: {
      toc: {
        disable: false,
        headingSelector: 'h2, h3',
      },
      description: {
        component: `## Providers

Context providers for global application state. Compose them together to enable dark mode, overlay stacking, modal dialogs, tooltips, and toast notifications across the entire component tree.

### Providers
- **ThemeProvider** — light/dark theme with \`useTheme()\` consumer
- **OverlayProvider** — z-index stacking context for overlays
- **DialogProvider** — accessible modal dialog with focus trap, Escape key, and aria-modal
- **TooltipProvider** — hover-triggered tooltips with configurable delay
- **ToastProvider** — notification toast queue with auto-dismiss`,
      },
    },
  },
  argTypes: {
    defaultTheme: { control: 'radio', options: ['light', 'dark'] },
    delayDuration: { control: 'number', min: 0, max: 2000, step: 100 },
    closeOnBackdrop: { control: 'boolean' },
  },
  subcomponents: {
    'DialogProvider.Trigger': DialogProvider.Trigger,
    'DialogProvider.Portal': DialogProvider.Portal,
    'DialogProvider.Overlay': DialogProvider.Overlay,
    'DialogProvider.Content': DialogProvider.Content,
    'DialogProvider.Title': DialogProvider.Title,
    'DialogProvider.Description': DialogProvider.Description,
    'DialogProvider.Close': DialogProvider.Close,
    'TooltipProvider.Tooltip': TooltipProvider.Tooltip,
    'TooltipProvider.Trigger': TooltipProvider.Trigger,
    'TooltipProvider.Content': TooltipProvider.Content,
    'ToastProvider.Viewport': ToastProvider.Viewport,
  },
  tags: ['autodocs', '!dev'],
} satisfies Meta;

export default meta;

/* ------------------------------------------------------------------ */
/* 1. ThemeToggle                                                        */
/* ------------------------------------------------------------------ */

const ThemeToggleInner = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="text-5xl select-none cursor-pointer transition-transform hover:scale-110 active:scale-95"
        onClick={toggleTheme}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleTheme(); }}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
      <PaperButton onClick={toggleTheme} size="sm">
        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        {theme === 'dark' ? 'Light' : 'Dark'}
      </PaperButton>
      <span className="font-kalam text-sm text-[var(--paper-ink-muted)]">
        theme = <code className="font-mono bg-[var(--paper-panel)] px-1 rounded">{theme}</code>
      </span>
    </div>
  );
};

export const ThemeToggle = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
    <SectionHeader title="Theme Provider" marker />
    <p className="font-architect text-xs uppercase text-[var(--paper-ink-muted)] max-w-md">
      Wrap with ThemeProvider. useTheme() returns theme / toggleTheme.
    </p>
    <div className="flex flex-wrap gap-8">
      <div className="relative rounded-2xl overflow-hidden">
        <SketchBorder fill="#fffdf9" stroke="#3a3733" shadow={4} radius={14} />
        <div className="relative z-[1] p-6 w-64">
          <span className="font-architect text-[10px] uppercase text-[var(--paper-ink-muted)]">defaultTheme=light</span>
          <ThemeProvider defaultTheme="light">
            <ThemeToggleInner />
          </ThemeProvider>
        </div>
      </div>
      <div className="relative rounded-2xl overflow-hidden">
        <SketchBorder fill="#252422" stroke="#6b6560" shadow={4} radius={14} />
        <div className="relative z-[1] p-6 w-64">
          <span className="font-architect text-[10px] uppercase text-[var(--paper-ink-muted)]">defaultTheme=dark</span>
          <ThemeProvider defaultTheme="dark">
            <ThemeToggleInner />
          </ThemeProvider>
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* 2. DialogExample                                                      */
/* ------------------------------------------------------------------ */

export const Dialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
      <SectionHeader title="Dialog Provider" marker />
      <p className="font-architect text-xs uppercase text-[var(--paper-ink-muted)] max-w-md">
        DialogProvider manages open/close, focus trap, Escape key, aria-modal.
      </p>

      <OverlayProvider>
        <DialogProvider open={open} onOpenChange={setOpen}>
          <DialogProvider.Trigger>
            <SketchButton>Open Dialog</SketchButton>
          </DialogProvider.Trigger>

          <DialogProvider.Portal>
            <DialogProvider.Overlay />
            <DialogProvider.Content>
              <DialogProvider.Title>Study Reminder</DialogProvider.Title>
              <DialogProvider.Description>
                You have 12 flashcards due in your Operating Systems deck.
                Spaced repetition works best on schedule.
              </DialogProvider.Description>
              <div className="flex gap-2 justify-end mt-4">
                <PaperButton size="sm" onClick={() => setOpen(false)}>Later</PaperButton>
                <SketchButton size="sm" onClick={() => setOpen(false)}>Study Now</SketchButton>
              </div>
              <DialogProvider.Close />
            </DialogProvider.Content>
          </DialogProvider.Portal>
        </DialogProvider>
      </OverlayProvider>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 3. TooltipGallery                                                     */
/* ------------------------------------------------------------------ */

export const TooltipGallery = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
    <SectionHeader title="Tooltip Provider" marker />
    <p className="font-architect text-xs uppercase text-[var(--paper-ink-muted)] max-w-md">
      TooltipProvider wraps tooltips. Each Tooltip has Trigger + Content sub-components.
    </p>

    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap gap-8 mt-8 justify-center">
        <TooltipProvider.Tooltip>
          <TooltipProvider.Trigger>
            <div className="w-10 h-10 rounded-full bg-[var(--paper-panel)] border-2 border-[var(--paper-stroke-sm)] flex items-center justify-center cursor-help hover:border-[var(--paper-stroke)] transition-colors">
              <Info size={18} className="text-[var(--paper-ink-muted)]" />
            </div>
          </TooltipProvider.Trigger>
          <TooltipProvider.Content>
            Hover tooltip with SketchBorder doodle style
          </TooltipProvider.Content>
        </TooltipProvider.Tooltip>

        <TooltipProvider.Tooltip>
          <TooltipProvider.Trigger>
            <div className="w-10 h-10 rounded-full bg-[var(--paper-panel)] border-2 border-[var(--paper-stroke-sm)] flex items-center justify-center cursor-help hover:border-[var(--paper-stroke)] transition-colors">
              <CheckCircle size={18} className="text-[var(--paper-success)]" />
            </div>
          </TooltipProvider.Trigger>
          <TooltipProvider.Content>
            Success tooltip — all good!
          </TooltipProvider.Content>
        </TooltipProvider.Tooltip>

        <TooltipProvider.Tooltip>
          <TooltipProvider.Trigger>
            <div className="w-10 h-10 rounded-full bg-[var(--paper-panel)] border-2 border-[var(--paper-stroke-sm)] flex items-center justify-center cursor-help hover:border-[var(--paper-stroke)] transition-colors">
              <AlertTriangle size={18} className="text-[var(--paper-warning)]" />
            </div>
          </TooltipProvider.Trigger>
          <TooltipProvider.Content>
            Warning tooltip — heads up!
          </TooltipProvider.Content>
        </TooltipProvider.Tooltip>

        <TooltipProvider.Tooltip>
          <TooltipProvider.Trigger>
            <div className="w-10 h-10 rounded-full bg-[var(--paper-panel)] border-2 border-[var(--paper-stroke-sm)] flex items-center justify-center cursor-help hover:border-[var(--paper-stroke)] transition-colors">
              <XCircle size={18} className="text-[var(--paper-danger)]" />
            </div>
          </TooltipProvider.Trigger>
          <TooltipProvider.Content>
            Error tooltip — something broke!
          </TooltipProvider.Content>
        </TooltipProvider.Tooltip>
      </div>
    </TooltipProvider>
  </div>
);

/* ------------------------------------------------------------------ */
/* 4. ToastDemo                                                           */
/* ------------------------------------------------------------------ */

const toastIcons = {
  default: <Info size={16} />,
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
} as const;

const toastVariants = ['default', 'success', 'error', 'warning'] as const;

const ToastDemoInner = () => {
  const { addToast } = useToast();
  const nextId = useRef(0);
  const [queue, setQueue] = useState<{ id: number; variant: string; time: string }[]>([]);

  const fireToast = useCallback((variant: string) => {
    const id = ++nextId.current;
    setQueue((q) => [...q, { id, variant, time: new Date().toLocaleTimeString() }]);
    addToast({
      variant: variant as any,
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
      description: `Toast #${id} — ${new Date().toLocaleTimeString()}`,
    });
    setTimeout(() => setQueue((q) => q.filter((t) => t.id !== id)), 3500);
  }, [addToast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {toastVariants.map((v) => (
          <SketchButton key={v} size="sm" onClick={() => fireToast(v)}>
            {toastIcons[v]} {v.charAt(0).toUpperCase() + v.slice(1)}
          </SketchButton>
        ))}
      </div>

      <div className="flex gap-6 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <span className="font-architect text-xs uppercase text-[var(--paper-ink-muted)]">Queue</span>
          <div className="mt-2 space-y-2">
            {queue.length === 0 ? (
              <p className="font-kalam text-sm text-[var(--paper-ink-faint)]">No toasts queued</p>
            ) : (
              queue.map((t) => (
                <div key={t.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--paper-panel)]">
                  <span className="text-[var(--paper-ink-muted)]">{toastIcons[t.variant as keyof typeof toastIcons]}</span>
                  <span className="font-kalam text-sm text-[var(--paper-ink)]">{t.variant}</span>
                  <span className="font-mono text-xs text-[var(--paper-ink-faint)] ml-auto">{t.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <span className="font-architect text-xs uppercase text-[var(--paper-ink-muted)]">Static preview</span>
          <div className="mt-2 space-y-2">
            {toastVariants.map((v) => (
              <div key={v} className="relative rounded-xl overflow-hidden">
                <SketchBorder
                  fill="#fffdf9"
                  stroke={v === 'error' ? '#9f3a36' : v === 'warning' ? '#8a6d00' : '#3a3733'}
                  shadow={3}
                  radius={10}
                />
                <div className="relative z-[1] px-4 py-3 flex items-start gap-3 min-w-[260px]">
                  <span className="text-[var(--paper-ink-muted)] mt-0.5">
                    {toastIcons[v as keyof typeof toastIcons]}
                  </span>
                  <div>
                    <p className="font-architect text-sm text-[var(--paper-ink)] uppercase">{v}</p>
                    <p className="font-kalam text-xs text-[var(--paper-ink-muted)]">
                      {v === 'error' ? 'Something went wrong. Try again.' :
                       v === 'warning' ? 'Your session expires in 5 minutes.' :
                       v === 'success' ? 'Changes saved successfully.' :
                       'A new version is available.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ToastDemo = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
    <SectionHeader title="Toast Provider" marker />
    <p className="font-architect text-xs uppercase text-[var(--paper-ink-muted)] max-w-md">
      ToastProvider + useToast().addToast() queue with auto-dismiss. Four variants.
    </p>
    <ToastProvider>
      <ToastDemoInner />
      <ToastProvider.Viewport />
    </ToastProvider>
  </div>
);

/* ------------------------------------------------------------------ */
/* 5. OverlayStack                                                       */
/* ------------------------------------------------------------------ */

const OverlayStackInner = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <SketchButton onClick={() => setSheetOpen(true)}>
          Open Sheet (z-40)
        </SketchButton>
        <SketchButton onClick={() => setDialogOpen(true)} disabled={!sheetOpen}>
          Open Dialog (z-50)
        </SketchButton>
        <SketchButton tone="red" size="sm" onClick={() => { setSheetOpen(false); setDialogOpen(false); }}>
          Dismiss All
        </SketchButton>
      </div>

      <div className="relative rounded-xl overflow-hidden">
        <SketchBorder fill="transparent" stroke="#a39e93" strokeWidth={1} roughness={0.4} />
        <div className="relative z-[1] p-6">
          <p className="font-architect text-xs uppercase text-[var(--paper-ink-muted)] mb-4">Z-Index layers</p>
          <div className="flex gap-4 items-end h-32">
            {[
              { label: 'Content', z: '10', h: 'h-20', w: 'w-16' },
              { label: 'Sheet', z: '40', h: 'h-28', w: 'w-20', active: sheetOpen },
              { label: 'Dialog', z: '50', h: 'h-32', w: 'w-24', active: dialogOpen },
            ].map((layer) => (
              <div key={layer.z} className="flex flex-col items-center gap-1">
                <div
                  className={`${layer.w} ${layer.h} rounded-t-lg border-2 flex items-center justify-center transition-all ${
                    layer.active
                      ? 'bg-[#fde68a]/40 border-[#d97706] -translate-y-2'
                      : 'bg-[var(--paper-panel)] border-[var(--paper-stroke-sm)]'
                  }`}
                >
                  <span className="font-mono text-xs text-[var(--paper-ink-muted)]">z-{layer.z}</span>
                </div>
                <span className="font-kalam text-xs text-[var(--paper-ink-muted)]">{layer.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogProvider open={sheetOpen} onOpenChange={setSheetOpen} closeOnBackdrop={false}>
        <DialogProvider.Trigger>
          <span />
        </DialogProvider.Trigger>

        <DialogProvider.Portal>
          <DialogProvider.Content>
            <DialogProvider.Title>Sheet layer (via DialogProvider)</DialogProvider.Title>
            <DialogProvider.Description>
              This uses DialogProvider for focus trap + Escape key.
              Open a dialog on top.
            </DialogProvider.Description>
            <SketchButton size="sm" onClick={() => setDialogOpen(true)} className="mt-3">
              Open Dialog on top
            </SketchButton>
            <DialogProvider.Close />
          </DialogProvider.Content>
        </DialogProvider.Portal>
      </DialogProvider>

      <DialogProvider open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogProvider.Trigger>
          <span />
        </DialogProvider.Trigger>

        <DialogProvider.Portal>
          <DialogProvider.Overlay />
          <DialogProvider.Content>
            <DialogProvider.Title>Top layer — above sheet</DialogProvider.Title>
            <DialogProvider.Description>
              DialogProvider.Content gets z+1 on overlay base z. Always above.
            </DialogProvider.Description>
            <SketchButton size="sm" onClick={() => { setDialogOpen(false); setSheetOpen(false); }} className="mt-3">
              Dismiss All
            </SketchButton>
            <DialogProvider.Close />
          </DialogProvider.Content>
        </DialogProvider.Portal>
      </DialogProvider>
    </div>
  );
};

export const OverlayStack = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
    <SectionHeader title="Overlay Stack" marker />
    <p className="font-architect text-xs uppercase text-[var(--paper-ink-muted)] max-w-lg">
      OverlayProvider + DialogProvider manage z-index stacking. Open sheet, then dialog on top.
    </p>
    <OverlayProvider>
      <OverlayStackInner />
    </OverlayProvider>
  </div>
);

/* ------------------------------------------------------------------ */
/* 6. FullComposition                                                     */
/* ------------------------------------------------------------------ */

const FullCompositionInner = () => {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastAction, setLastAction] = useState('');

  return (
    <div className="bg-[#f4f1ea] dark:bg-[#1c1b1a]">
      <header className="flex items-center justify-between pb-6 border-b-2 border-dashed border-[var(--paper-stroke-sm)] mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📓</span>
          <div>
            <h1 className="font-caveat text-3xl text-[var(--paper-ink)] leading-none">ScholarCLI</h1>
            <p className="font-architect text-[10px] uppercase text-[var(--paper-ink-faint)]">All Providers Composed</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PaperButton onClick={toggleTheme} size="sm" tone={theme === 'dark' ? 'paper' : 'dark'}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </PaperButton>
          <span className="font-mono text-xs text-[var(--paper-ink-muted)]">{theme}</span>
        </div>
      </header>

      <div className="flex flex-wrap justify-center gap-6">
        <PaperCard className="w-60 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span className="font-architect text-xs uppercase text-[var(--paper-ink)]">Theme</span>
          </div>
          <p className="font-kalam text-sm text-[var(--paper-ink-muted)]">current: <strong>{theme}</strong></p>
          <SketchButton size="sm" onClick={toggleTheme}>Toggle Theme</SketchButton>
        </PaperCard>

        <PaperCard className="w-60 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <span className="font-architect text-xs uppercase text-[var(--paper-ink)]">Toast</span>
          </div>
          <p className="font-kalam text-sm text-[var(--paper-ink-muted)]">Queue notification.</p>
          <div className="flex flex-wrap gap-1">
            {(['success', 'error', 'warning', 'default'] as const).map((v) => (
              <PaperButton
                key={v}
                size="sm"
                onClick={() => {
                  addToast({ variant: v, title: v, description: 'Composed demo toast.' });
                  setLastAction(`Toast: ${v}`);
                }}
              >
                {v}
              </PaperButton>
            ))}
          </div>
        </PaperCard>

        <PaperCard className="w-60 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <span className="font-architect text-xs uppercase text-[var(--paper-ink)]">Dialog</span>
          </div>
          <p className="font-kalam text-sm text-[var(--paper-ink-muted)]">Open a paper-style modal.</p>
          <SketchButton size="sm" onClick={() => { setDialogOpen(true); setLastAction('Dialog opened'); }}>
            Open Dialog
          </SketchButton>
        </PaperCard>

        <PaperCard className="w-60 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <span className="font-architect text-xs uppercase text-[var(--paper-ink)]">Tooltip</span>
          </div>
          <p className="font-kalam text-sm text-[var(--paper-ink-muted)]">Hover for contextual info.</p>
          <TooltipProvider.Tooltip>
            <TooltipProvider.Trigger>
              <div className="w-8 h-8 rounded-full bg-[var(--paper-panel)] border-2 border-[var(--paper-stroke-sm)] flex items-center justify-center cursor-help hover:border-[var(--paper-stroke)] transition-colors">
                <Info size={14} className="text-[var(--paper-ink-muted)]" />
              </div>
            </TooltipProvider.Trigger>
            <TooltipProvider.Content>
              You found the tooltip!
            </TooltipProvider.Content>
          </TooltipProvider.Tooltip>
        </PaperCard>
      </div>

      {lastAction && (
        <div className="mt-8 text-center">
          <span className="font-kalam text-sm text-[var(--paper-ink-muted)] bg-[var(--paper-panel)] px-4 py-1 rounded-full">
            Last action: {lastAction}
          </span>
        </div>
      )}

      <div className="mt-10 p-5 border-2 border-dashed border-[var(--paper-stroke-sm)] rounded-xl">
        <div className="relative inline-block rounded-lg overflow-hidden">
          <SketchBorder fill="transparent" stroke="var(--paper-stroke)" strokeWidth={1.2} roughness={0.6} />
          <span className="relative z-[1] block px-3 py-1 font-architect text-xs uppercase text-[var(--paper-ink)]">
            Composition Layers
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 font-kalam text-sm text-[var(--paper-ink-muted)]">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#fde047]" />ThemeProvider</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#86efac]" />ToastProvider</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#93c5fd]" />DialogProvider</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#c084fc]" />TooltipProvider</div>
        </div>
      </div>

      <DialogProvider open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogProvider.Portal>
          <DialogProvider.Overlay />
          <DialogProvider.Content>
            <DialogProvider.Title>Need to Study?</DialogProvider.Title>
            <DialogProvider.Description>
              All providers composed: ThemeProvider for dark mode,
              ToastProvider for notifications, DialogProvider for modals,
              TooltipProvider for contextual hints.
            </DialogProvider.Description>
            <SketchButton size="sm" onClick={() => setDialogOpen(false)} className="mt-4">Got it!</SketchButton>
            <DialogProvider.Close />
          </DialogProvider.Content>
        </DialogProvider.Portal>
      </DialogProvider>

      <ToastProvider.Viewport />
    </div>
  );
};

export const FullComposition = () => (
  <ThemeProvider defaultTheme="light">
    <OverlayProvider>
      <ToastProvider>
        <TooltipProvider>
          <FullCompositionInner />
        </TooltipProvider>
      </ToastProvider>
    </OverlayProvider>
  </ThemeProvider>
);
