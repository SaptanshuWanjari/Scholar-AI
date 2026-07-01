import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  PaperButton,
  SketchButton,
  StickyButton,
  IconButton,
  FloatingActionButton,
  ChipButton,
  ToggleButton,
  GhostButton,
  PaperSheetButton,
} from '@paper-ui/components/buttons';
import { Plus, Search, Star, Bell, Bookmark, Pencil, Trash2, Download } from 'lucide-react';

const meta = {
  title: 'Components/Buttons',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const PaperButtonVariants = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">PaperButton — tones</h2>
    <div className="flex flex-wrap gap-4 items-center">
      <PaperButton tone="paper">Paper</PaperButton>
      <PaperButton tone="dark">Dark</PaperButton>
      <PaperButton tone="green">Green</PaperButton>
      <PaperButton tone="red">Red</PaperButton>
    </div>

    <h2 className="font-serif text-xl font-bold">PaperButton — sizes</h2>
    <div className="flex flex-wrap gap-4 items-end">
      <PaperButton size="sm">Small</PaperButton>
      <PaperButton size="md">Medium</PaperButton>
      <PaperButton size="lg">Large</PaperButton>
    </div>

    <h2 className="font-serif text-xl font-bold">PaperButton — with icons</h2>
    <div className="flex flex-wrap gap-4 items-center">
      <PaperButton tone="dark"><Plus size={16} /> New Document</PaperButton>
      <PaperButton tone="green"><Download size={16} /> Export</PaperButton>
      <PaperButton tone="paper"><Pencil size={16} /> Edit</PaperButton>
    </div>
  </div>
);

export const SketchButtonExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">SketchButton</h2>
    <p className="font-mono text-sm text-gray-600">Alias for PaperButton with paper tone.</p>
    <div className="flex flex-wrap gap-4">
      <SketchButton>Default</SketchButton>
      <SketchButton size="sm">Small</SketchButton>
      <SketchButton size="lg"><Search size={16} /> Search</SketchButton>
      <SketchButton disabled>Disabled</SketchButton>
    </div>
  </div>
);

export const StickyButtonExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StickyButton</h2>
    <p className="font-mono text-sm text-gray-600">Taped-down button — ideal for "Ask AI" / "Teach Me" CTAs.</p>
    <div className="flex flex-wrap gap-8 items-end pt-4">
      <StickyButton>Ask AI</StickyButton>
      <StickyButton tone="dark">Teach Me</StickyButton>
      <StickyButton tone="green" taped={false}>No Tape</StickyButton>
    </div>
  </div>
);

export const IconButtonExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">IconButton</h2>
    <p className="font-mono text-sm text-gray-600">Minimal circular icon buttons for toolbars.</p>
    <div className="flex gap-3 items-center">
      <IconButton label="Search"><Search size={18} /></IconButton>
      <IconButton label="Bookmark"><Bookmark size={18} /></IconButton>
      <IconButton label="Star"><Star size={18} /></IconButton>
      <IconButton label="Bell"><Bell size={18} /></IconButton>
      <IconButton label="Delete"><Trash2 size={18} /></IconButton>
    </div>
  </div>
);

export const FloatingActionButtonExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">FloatingActionButton — tones & sizes</h2>
    <div className="flex flex-wrap gap-6 items-end">
      <div className="flex flex-col items-center gap-2">
        <FloatingActionButton label="Add small" size="sm" tone="dark"><Plus size={16} /></FloatingActionButton>
        <span className="font-mono text-xs text-gray-500">sm / dark</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FloatingActionButton label="Add medium" size="md" tone="paper"><Plus size={20} /></FloatingActionButton>
        <span className="font-mono text-xs text-gray-500">md / paper</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FloatingActionButton label="Add large" size="lg" tone="green"><Plus size={24} /></FloatingActionButton>
        <span className="font-mono text-xs text-gray-500">lg / green</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FloatingActionButton label="Edit" size="md" tone="red"><Pencil size={20} /></FloatingActionButton>
        <span className="font-mono text-xs text-gray-500">md / red</span>
      </div>
    </div>
  </div>
);

export const ChipButtonExample = () => {
  const [selected, setSelected] = useState<string[]>(['React']);
  const tags = ['React', 'TypeScript', 'Tailwind', 'Storybook', 'Vite'];
  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ChipButton — filter chips</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <ChipButton
            key={tag}
            selected={selected.includes(tag)}
            onClick={() =>
              setSelected(s => s.includes(tag) ? s.filter(t => t !== tag) : [...s, tag])
            }
          >
            {tag}
          </ChipButton>
        ))}
      </div>
      <p className="font-mono text-xs text-gray-500">Selected: {selected.join(', ') || 'none'}</p>
    </div>
  );
};

export const ToggleButtonExample = () => {
  const [pressed, setPressed] = useState(false);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(true);
  return (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ToggleButton</h2>
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <ToggleButton pressed={bold} onPressedChange={setBold} size="sm"><strong>B</strong></ToggleButton>
          <ToggleButton pressed={italic} onPressedChange={setItalic} size="sm"><em>I</em></ToggleButton>
          <ToggleButton pressed={pressed} onPressedChange={setPressed}>
            {pressed ? 'ON' : 'OFF'}
          </ToggleButton>
        </div>
        <p className="font-mono text-xs text-gray-500">Bold: {String(bold)}, Italic: {String(italic)}, Toggle: {String(pressed)}</p>
      </div>
    </div>
  );
};

export const GhostButtonExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">GhostButton</h2>
    <p className="font-mono text-sm text-gray-600">Transparent border, muted text — secondary actions.</p>
    <div className="flex flex-wrap gap-4">
      <GhostButton>Cancel</GhostButton>
      <GhostButton size="sm"><Trash2 size={14} /> Delete</GhostButton>
      <GhostButton size="lg">View All →</GhostButton>
    </div>
  </div>
);
