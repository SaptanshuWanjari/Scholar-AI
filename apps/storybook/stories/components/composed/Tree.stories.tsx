import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { Tree } from '@paper-ui/components/tree';
import { Paper } from '@paper-ui/components/paper';
import { SunDoodle, StarDoodle, ArrowDoodle, CompassDoodle, PushPinDoodle, TapeDoodle } from '@paper-ui/components/doodles';
import { Tape, PushPin } from '@paper-ui/components/decorations';
import { SketchBorder } from '@paper-ui/core';
import { FileText, Code, Image, FolderOpen, Folder, BookOpen, Settings, Palette, File, Archive } from 'lucide-react';
import { cn } from '@paper-ui/utils';

const meta = {
  title: 'Components/Composed/Tree',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const FILES = {
  src: (
    <Tree.Branch id="src" label="src" defaultExpanded>
      <Tree.Branch id="components" label="components">
        <Tree.Leaf id="button" label="Button.tsx" icon={<Code size={14} />} />
        <Tree.Leaf id="card" label="Card.tsx" icon={<Code size={14} />} />
        <Tree.Leaf id="input" label="Input.tsx" icon={<Code size={14} />} />
      </Tree.Branch>
      <Tree.Branch id="hooks" label="hooks" defaultExpanded>
        <Tree.Leaf id="useToggle" label="useToggle.ts" icon={<Code size={14} />} />
        <Tree.Leaf id="useFetch" label="useFetch.ts" icon={<Code size={14} />} />
      </Tree.Branch>
      <Tree.Leaf id="app" label="App.tsx" icon={<Code size={14} />} />
      <Tree.Leaf id="main" label="main.tsx" icon={<Code size={14} />} />
    </Tree.Branch>
  ),
  docs: (
    <Tree.Branch id="docs" label="docs">
      <Tree.Leaf id="readme" label="README.md" icon={<FileText size={14} />} />
      <Tree.Leaf id="contributing" label="CONTRIBUTING.md" icon={<FileText size={14} />} />
    </Tree.Branch>
  ),
  assets: (
    <Tree.Branch id="assets" label="assets">
      <Tree.Leaf id="logo" label="logo.svg" icon={<Image size={14} />} />
      <Tree.Leaf id="hero" label="hero.png" icon={<Image size={14} />} />
      <Tree.Leaf id="favicon" label="favicon.ico" icon={<Image size={14} />} />
    </Tree.Branch>
  ),
};

export const HandDrawn = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-center">
    <div className="w-[320px]">
      <Tree variant="hand-drawn">
        {FILES.src}
        {FILES.docs}
        {FILES.assets}
      </Tree>
    </div>
  </div>
);

export const OutlineBox = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-center">
    <div className="w-[400px]">
      <Tree variant="outline">
        {FILES.src}
        {FILES.docs}
        {FILES.assets}
      </Tree>
    </div>
  </div>
);

const DeepTree = () => (
  <Tree.Branch id="project" label="my-project" defaultExpanded>
    <Tree.Branch id="src2" label="src" defaultExpanded>
      <Tree.Branch id="app2" label="app" defaultExpanded>
        <Tree.Branch id="features" label="features" defaultExpanded>
          <Tree.Branch id="auth" label="auth">
            <Tree.Leaf id="login" label="LoginPage.tsx" icon={<Code size={14} />} />
            <Tree.Leaf id="register" label="RegisterPage.tsx" icon={<Code size={14} />} />
          </Tree.Branch>
          <Tree.Branch id="dashboard" label="dashboard">
            <Tree.Leaf id="overview" label="Overview.tsx" icon={<Code size={14} />} />
            <Tree.Leaf id="analytics" label="Analytics.tsx" icon={<Code size={14} />} />
          </Tree.Branch>
        </Tree.Branch>
        <Tree.Leaf id="router" label="router.ts" icon={<Code size={14} />} />
      </Tree.Branch>
      <Tree.Branch id="lib" label="lib">
        <Tree.Leaf id="api" label="api.ts" icon={<Code size={14} />} />
        <Tree.Leaf id="utils" label="utils.ts" icon={<Code size={14} />} />
      </Tree.Branch>
    </Tree.Branch>
    <Tree.Leaf id="package" label="package.json" icon={<Code size={14} />} />
    <Tree.Leaf id="tsconfig" label="tsconfig.json" icon={<Code size={14} />} />
  </Tree.Branch>
);

export const DeepNesting = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-center">
    <div className="w-[400px]">
      <Tree variant="hand-drawn">
        <DeepTree />
      </Tree>
    </div>
  </div>
);

export const WithSearch = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-center">
    <div className="w-[360px]">
      <Tree variant="outline">
        <Tree.Search placeholder="Filter files..." />
        <Tree.Branch id="src3" label="src" defaultExpanded>
          <Tree.Branch id="components3" label="components" defaultExpanded>
            <Tree.Leaf id="button3" label="Button.tsx" icon={<Code size={14} />} />
            <Tree.Leaf id="card3" label="Card.tsx" icon={<Code size={14} />} />
            <Tree.Leaf id="modal3" label="Modal.tsx" icon={<Code size={14} />} />
            <Tree.Leaf id="tooltip3" label="Tooltip.tsx" icon={<Code size={14} />} />
          </Tree.Branch>
          <Tree.Branch id="hooks3" label="hooks">
            <Tree.Leaf id="useToggle3" label="useToggle.ts" icon={<Code size={14} />} />
            <Tree.Leaf id="useDebounce3" label="useDebounce.ts" icon={<Code size={14} />} />
          </Tree.Branch>
          <Tree.Leaf id="index3" label="index.ts" icon={<Code size={14} />} />
        </Tree.Branch>
        <Tree.Branch id="docs3" label="docs">
          <Tree.Leaf id="readme3" label="README.md" icon={<FileText size={14} />} />
          <Tree.Leaf id="changelog3" label="CHANGELOG.md" icon={<FileText size={14} />} />
        </Tree.Branch>
        <Tree.Branch id="tests3" label="tests">
          <Tree.Leaf id="buttonTest" label="Button.test.tsx" icon={<Code size={14} />} />
          <Tree.Leaf id="cardTest" label="Card.test.tsx" icon={<Code size={14} />} />
        </Tree.Branch>
      </Tree>
    </div>
  </div>
);

export const DoodleLayout = () => (
  <div className="min-h-screen bg-[#f4f1ea] p-6 md:p-10 relative overflow-hidden">
    {/* --- Doodle decorations scattered --- */}
    <SunDoodle size={64} color="#e8c84a" className="absolute top-6 right-10 opacity-70 -rotate-6 z-0" />
    <StarDoodle size={28} color="#c9954f" className="absolute top-32 right-32 opacity-50 rotate-12 z-0" />
    <StarDoodle size={18} color="#9c9484" className="absolute top-40 right-56 opacity-40 -rotate-12 z-0" />
    <ArrowDoodle size={28} color="#3f7a4e" className="absolute top-1/3 left-8 opacity-50 rotate-45 z-0" />
    <CompassDoodle size={48} color="#4a6f91" className="absolute bottom-20 left-8 opacity-40 z-0" />
    <TapeDoodle size={36} color="#9c9484" className="absolute bottom-32 right-16 opacity-30 -rotate-12 z-0" />
    <PushPinDoodle size={24} color="#b5685e" className="absolute top-20 left-1/4 opacity-50 rotate-12 z-0" />

    {/* --- Header --- */}
    <div className="relative z-10 mb-10 text-center">
      <div className="inline-flex items-center gap-3 mb-2">
        <Tape corner="top-left" width={70} color="#e8c84a" />
        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight">
          File Explorer
        </h1>
        <Tape corner="top-right" width={60} color="#b5685e" />
      </div>
      <p className="font-kalam text-base text-ink-muted/70 max-w-md mx-auto">
        Compound Tree components with hand-drawn and outline variants, search filtering, and deep nesting.
      </p>
    </div>

    {/* --- Cards grid --- */}
    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Card 1 — Hand-drawn variant */}
      <Paper className="p-0 relative" shadowVariant="sketch">
        <PushPin position="top-center" color="#b5685e" />
        <Tape corner="top-right" width={52} />
        <div className="px-4 pt-5 pb-1">
          <h3 className="font-caveat text-lg text-ink-muted/70 mb-1 flex items-center gap-2">
            <FolderOpen size={16} className="text-ink-muted/60" />
            Hand-Drawn
          </h3>
        </div>
        <div className="px-2 pb-3">
          <Tree variant="hand-drawn">
            {FILES.src}
            {FILES.docs}
            {FILES.assets}
          </Tree>
        </div>
      </Paper>

      {/* Card 2 — Outline variant */}
      <Paper
        className="p-0 relative"
        shadowVariant="soft"
        style={{ transform: 'rotate(-1deg)' }}
      >
        <Tape corner="top-left" width={56} color="#8fa68a" />
        <div className="absolute -top-3 -right-3 text-yellow-500 rotate-12">
          <StarDoodle size={32} color="#c9954f" />
        </div>
        <div className="px-4 pt-5 pb-1">
          <h3 className="font-caveat text-lg text-ink-muted/70 mb-1 flex items-center gap-2">
            <Archive size={16} className="text-ink-muted/60" />
            Outline Box
          </h3>
        </div>
        <div className="px-2 pb-3">
          <Tree variant="outline">
            {FILES.src}
            {FILES.docs}
            {FILES.assets}
          </Tree>
        </div>
        <div className="absolute -bottom-2 -left-2">
          <ArrowDoodle size={22} color="#3a3733" className="rotate-[30deg] opacity-60" />
        </div>
      </Paper>

      {/* Card 3 — Deep nesting */}
      <Paper
        className="p-0 relative rotate-1"
        shadowVariant="sketch"
        style={{ transform: 'rotate(1deg)' }}
      >
        <PushPin position="top-left" color="#4a6f91" />
        <Tape corner="top-right" width={48} color="#d4a76a" />
        <div className="px-4 pt-5 pb-1">
          <h3 className="font-caveat text-lg text-ink-muted/70 mb-1 flex items-center gap-2">
            <Folder size={16} className="text-ink-muted/60" />
            Deep Nesting
          </h3>
        </div>
        <div className="px-2 pb-3">
          <Tree variant="hand-drawn">
            <DeepTree />
          </Tree>
        </div>
        <div className="absolute -bottom-4 -right-4">
          <TapeDoodle size={36} color="#9c9484" className="opacity-50 -rotate-3" />
        </div>
      </Paper>

      {/* Card 4 — With search */}
      <Paper
        className="p-0 relative -rotate-1 lg:col-start-2"
        shadowVariant="soft"
        style={{ transform: 'rotate(-0.5deg)' }}
      >
        <Tape corner="top-left" width={60} color="#b5685e" />
        <Tape corner="bottom-right" width={44} color="#8fa68a" />
        <div className="px-4 pt-5 pb-1">
          <h3 className="font-caveat text-lg text-ink-muted/70 mb-1 flex items-center gap-2">
            <BookOpen size={16} className="text-ink-muted/60" />
            Searchable
          </h3>
        </div>
        <div className="px-2 pb-3">
          <Tree variant="outline">
            <Tree.Search placeholder="Filter files..." />
            <Tree.Branch id="s_src" label="src" defaultExpanded>
              <Tree.Branch id="s_components" label="components" defaultExpanded>
                <Tree.Leaf id="s_button" label="Button.tsx" icon={<Code size={14} />} />
                <Tree.Leaf id="s_card" label="Card.tsx" icon={<Code size={14} />} />
                <Tree.Leaf id="s_modal" label="Modal.tsx" icon={<Code size={14} />} />
                <Tree.Leaf id="s_tooltip" label="Tooltip.tsx" icon={<Code size={14} />} />
              </Tree.Branch>
              <Tree.Branch id="s_hooks" label="hooks">
                <Tree.Leaf id="s_useToggle" label="useToggle.ts" icon={<Code size={14} />} />
                <Tree.Leaf id="s_useDebounce" label="useDebounce.ts" icon={<Code size={14} />} />
              </Tree.Branch>
              <Tree.Leaf id="s_index" label="index.ts" icon={<Code size={14} />} />
            </Tree.Branch>
            <Tree.Branch id="s_tests" label="tests">
              <Tree.Leaf id="s_buttonTest" label="Button.test.tsx" icon={<Code size={14} />} />
              <Tree.Leaf id="s_cardTest" label="Card.test.tsx" icon={<Code size={14} />} />
            </Tree.Branch>
          </Tree>
        </div>
      </Paper>

      {/* Card 5 — Simple config tree */}
      <Paper
        className="p-0 relative rotate-1"
        shadowVariant="sketch"
        style={{ transform: 'rotate(1deg)' }}
      >
        <PushPin position="top-center" color="#4a6f91" />
        <div className="px-4 pt-5 pb-1">
          <h3 className="font-caveat text-lg text-ink-muted/70 mb-1 flex items-center gap-2">
            <Settings size={16} className="text-ink-muted/60" />
            Configuration
          </h3>
        </div>
        <div className="px-2 pb-3">
          <Tree variant="hand-drawn">
            <Tree.Branch id="config" label="config" defaultExpanded>
              <Tree.Branch id="env" label="env">
                <Tree.Leaf id="development" label="development.ts" icon={<Code size={14} />} />
                <Tree.Leaf id="production" label="production.ts" icon={<Code size={14} />} />
              </Tree.Branch>
              <Tree.Branch id="theme" label="theme">
                <Tree.Leaf id="colors" label="colors.ts" icon={<Palette size={14} />} />
                <Tree.Leaf id="typography" label="typography.ts" icon={<File size={14} />} />
              </Tree.Branch>
            </Tree.Branch>
            <Tree.Leaf id="env_file" label=".env" icon={<File size={14} />} />
            <Tree.Leaf id="gitignore" label=".gitignore" icon={<File size={14} />} />
          </Tree>
        </div>
        <div className="absolute -bottom-2 -right-2">
          <StarDoodle size={22} color="#c9954f" className="opacity-60" />
        </div>
      </Paper>
    </div>

    {/* --- Footer note --- */}
    <div className="relative z-10 mt-10 text-center">
      <span className="inline-flex items-center gap-2 font-caveat text-sm text-ink-muted/50">
        <StarDoodle size={14} color="#9c9484" />
        Compound pattern &middot; Search filtering &middot; Deep nesting
        <StarDoodle size={14} color="#9c9484" />
      </span>
    </div>
  </div>
);
