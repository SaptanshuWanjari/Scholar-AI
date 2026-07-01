import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  VisuallyHidden,
  FocusRing,
  FocusScope,
  SkipNavigation,
  LiveRegion,
  Announcer,
  useAnnouncer,
} from '@paper-ui/components/accessibility';
import { SketchBorder } from '@paper-ui/core';
import { PaperButton } from '@paper-ui/components/buttons';
import { Settings, Plus, Minus } from 'lucide-react';

const meta = {
  title: 'Components/Accessibility',
  parameters: {
    layout: 'padded',
    docs: {
      toc: {
        disable: false,
        headingSelector: 'h2, h3',
      },
    },
  },
  argTypes: {
    trapped: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    restoreFocus: { control: 'boolean' },
    polite: { control: 'boolean' },
    atomic: { control: 'boolean' },
    asChild: { control: 'boolean' },
  },
  subcomponents: {
    'FocusRing.Target': FocusRing.Target,
    'FocusScope.Child': FocusScope.Child,
  },
  tags: ['autodocs', '!dev'],
} satisfies Meta;

export default meta;

export const VisuallyHiddenDemo = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
    <h2 className="font-caveat text-2xl font-bold">VisuallyHidden</h2>

    <div className="relative p-6 max-w-md bg-white/60 dark:bg-white/5 rounded-lg">
      <SketchBorder stroke="#3a3733" strokeWidth={1.4} roughness={1.2} radius={8} />
      <p className="relative z-10 font-kalam text-base">
        Click the{' '}
        <VisuallyHidden asChild>
          <span>settings</span>
        </VisuallyHidden>
        button below
      </p>
      <div className="relative z-10 mt-3">
        <PaperButton tone="paper" aria-label="Open settings">
          <Settings size={16} />
          <span className="ml-2">Gear Button</span>
        </PaperButton>
      </div>
    </div>

    <p className="font-architect text-xs uppercase tracking-wider text-[var(--paper-ink-muted,#888)] max-w-md">
      Inspect the DOM to see hidden labels.
    </p>
  </div>
);

export const FocusRingGallery = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
    <h2 className="font-caveat text-2xl font-bold">FocusRing</h2>

    <div className="relative p-6 max-w-sm bg-[#fff9db] dark:bg-[#3d3920] -rotate-[0.5deg]">
      <SketchBorder stroke="#c9b84f" strokeWidth={1.2} roughness={1.6} radius={4} fill="#fff9db" />
      <p className="relative z-10 font-architect text-sm uppercase tracking-wide text-[#5a4e1c] mb-4">
        Press Tab to see focus rings
      </p>

      <div className="relative z-10 flex flex-col gap-4">
        <FocusRing>
          <PaperButton tone="paper">Focused PaperButton</PaperButton>
        </FocusRing>

        <FocusRing within>
          <input
            type="text"
            placeholder="Type here..."
            className="w-full px-3 py-2 bg-white/70 border border-dashed border-[#3a3733] rounded font-kalam text-sm
                       focus-visible:outline-none
                       dark:bg-white/10 dark:border-gray-500 dark:text-gray-200"
          />
        </FocusRing>

        <FocusRing.Target>
          <a
            href="#"
            onClick={e => e.preventDefault()}
            className="inline-block font-caveat text-lg text-[#3a3733] underline decoration-dotted underline-offset-4
                       dark:text-gray-200"
          >
            A focused link
          </a>
        </FocusRing.Target>
      </div>
    </div>
  </div>
);

export const FocusScopeTrap = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
    <h2 className="font-caveat text-2xl font-bold">FocusScope — Trap</h2>

    <div className="flex flex-col gap-6">
      <div className="relative p-6 max-w-sm bg-white/60 dark:bg-white/5 rounded-lg">
        <SketchBorder stroke="#3a3733" strokeWidth={1.6} roughness={1.3} radius={8} />
        <p className="relative z-10 font-architect text-xs uppercase tracking-wide text-[var(--paper-ink-muted,#888)] mb-1">
          Outside the scope
        </p>
        <PaperButton tone="paper" size="sm" className="relative z-10">
          Outside Button
        </PaperButton>
      </div>

      <FocusScope autoFocus className="relative p-6 max-w-sm bg-white/80 dark:bg-white/10 rounded-lg">
        <SketchBorder stroke="#7fa37b" strokeWidth={1.8} roughness={1.4} radius={8} fill="rgba(127,163,123,0.08)" />

        <h3 className="relative z-10 font-caveat text-lg font-bold mb-3">Scoped Panel</h3>

        <div className="relative z-10 flex flex-col gap-3">
          <PaperButton tone="paper">First Button</PaperButton>
          <input
            type="text"
            placeholder="Input inside scope"
            className="w-full px-3 py-2 bg-white/70 border border-dashed border-[#3a3733] rounded font-kalam text-sm
                       focus-visible:outline-none
                       dark:bg-white/10 dark:border-gray-500 dark:text-gray-200"
          />
          <PaperButton tone="dark">Middle Button</PaperButton>
          <PaperButton tone="green">Last Button</PaperButton>
        </div>

        <p className="relative z-10 mt-3 font-architect text-xs uppercase tracking-wide text-[var(--paper-ink-muted,#888)]">
          Tab is trapped inside this scope
        </p>
      </FocusScope>
    </div>
  </div>
);

export const SkipNavigationDemo = () => (
  <div className="bg-[#f4f1ea] dark:bg-[#1c1b1a]">
    <SkipNavigation targetId="main-content-example" />

    <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 bg-[#f4f1ea]/95 dark:bg-[#1c1b1a]/95
                        border-b-2 border-dashed border-[#3a3733]/20">
      <div className="relative px-4 py-1">
        <SketchBorder stroke="#3a3733" strokeWidth={1} roughness={1.5} radius={4} />
        <h1 className="relative z-10 font-caveat text-2xl font-bold">ScholarCLI</h1>
      </div>
      <nav className="flex gap-4 ml-auto">
        <span className="font-architect text-sm uppercase tracking-wide text-[var(--paper-ink-muted,#888)]">Docs</span>
        <span className="font-architect text-sm uppercase tracking-wide text-[var(--paper-ink-muted,#888)]">Courses</span>
        <span className="font-architect text-sm uppercase tracking-wide text-[var(--paper-ink-muted,#888)]">Settings</span>
      </nav>
    </header>

    <main id="main-content-example" className="p-10 pt-6">
      <div className="relative p-6 max-w-lg bg-white/60 dark:bg-white/5 rounded-lg">
        <SketchBorder stroke="#3a3733" strokeWidth={1.4} roughness={1.2} radius={8} />
        <h2 className="relative z-10 font-caveat text-xl font-bold mb-2">Main Content</h2>
        <p className="relative z-10 font-kalam text-sm text-[var(--paper-ink-muted,#555)]">
          Press <strong>Tab</strong> to reveal the "Skip to main content" link at the top.
          Then press <strong>Enter</strong> to scroll here.
        </p>
      </div>
    </main>
  </div>
);

export const LiveRegionDemo = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
      <h2 className="font-caveat text-2xl font-bold">LiveRegion</h2>

      <div className="relative p-6 max-w-xs bg-white/60 dark:bg-white/5 rounded-lg text-center">
        <SketchBorder stroke="#3a3733" strokeWidth={1.4} roughness={1.3} radius={8} />

        <p className="relative z-10 font-architect text-xs uppercase tracking-wide text-[var(--paper-ink-muted,#888)] mb-2">
          Counter
        </p>

        <LiveRegion>
          <span>The counter is now {count}</span>
        </LiveRegion>

        <p className="relative z-10 font-caveat text-5xl font-bold my-3">{count}</p>

        <div className="relative z-10 flex justify-center gap-3">
          <button
            onClick={() => setCount(c => c - 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/80 border border-dashed border-[#3a3733]
                       rounded font-caveat text-base hover:bg-white
                       dark:bg-white/10 dark:border-gray-500 dark:hover:bg-white/20"
          >
            <Minus size={14} /> Decrement
          </button>
          <button
            onClick={() => setCount(c => c + 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/80 border border-dashed border-[#3a3733]
                       rounded font-caveat text-base hover:bg-white
                       dark:bg-white/10 dark:border-gray-500 dark:hover:bg-white/20"
          >
            <Plus size={14} /> Increment
          </button>
        </div>
      </div>

      <p className="font-architect text-xs uppercase tracking-wide text-[var(--paper-ink-muted,#888)] max-w-xs">
        Screen readers will announce counter changes.
      </p>
    </div>
  );
};

export const AnnouncerDemo = () => {
  const [last, setLast] = useState('');

  return (
    <Announcer>
      <InnerAnnouncerDemo last={last} setLast={setLast} />
    </Announcer>
  );
};

function InnerAnnouncerDemo({ last, setLast }: { last: string; setLast: (v: string) => void }) {
  const { announce } = useAnnouncer();

  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea] dark:bg-[#1c1b1a]">
      <h2 className="font-caveat text-2xl font-bold">Announcer</h2>

      <div className="flex flex-col gap-6 max-w-sm">
        <div className="flex flex-wrap gap-3">
          <PaperButton
            tone="green"
            size="sm"
            onClick={() => {
              announce('Item saved successfully', true);
              setLast('polite: Item saved successfully');
            }}
          >
            Announce success
          </PaperButton>
          <PaperButton
            tone="red"
            size="sm"
            onClick={() => {
              announce('Error: could not save the item', false);
              setLast('assertive: Error: could not save the item');
            }}
          >
            Announce error
          </PaperButton>
          <PaperButton
            tone="paper"
            size="sm"
            onClick={() => {
              announce('Loading results…', true);
              setLast('polite: Loading results…');
            }}
          >
            Announce loading
          </PaperButton>
        </div>

        {last && (
          <div className="relative px-4 py-2 bg-[#fff9db] dark:bg-[#3d3920] rounded-lg max-w-xs">
            <SketchBorder stroke="#c9b84f" strokeWidth={1} roughness={1.6} radius={6} />
            <p className="relative z-10 font-architect text-xs uppercase tracking-wide text-[#5a4e1c] dark:text-[#e8d87a]">
              Doodle speech bubble
            </p>
            <p className="relative z-10 font-kalam text-sm mt-1 text-[#3a3733] dark:text-gray-200">
              &ldquo;{last}&rdquo;
            </p>
            <div className="absolute -bottom-2 left-6 w-3 h-3 bg-[#fff9db] dark:bg-[#3d3920] rotate-45 border-r border-b border-dashed border-[#c9b84f]" />
          </div>
        )}
      </div>
    </div>
  );
};
