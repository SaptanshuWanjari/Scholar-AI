import React from 'react';
import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { PushPin } from '@paper-ui/components/decorations';
import {
  NotebookIcon, SpiralIcon, TabDividerIcon, StickyNoteIcon,
  PushPinIcon, TapeIcon, HighlighterIcon,
} from '@paper-ui/icons';

const meta = {
  title: 'Icons/Notebook Icons',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const IconCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Paper className="w-28 h-28 flex flex-col items-center justify-center gap-2">
    {children}
    <span className="font-architect text-[13px] text-ink-muted">{label}</span>
  </Paper>
);

export const AllNotebookIcons = () => (
  <div className="p-8">
    <div className="flex flex-wrap gap-6 justify-center max-w-3xl mx-auto">
      <IconCard label="Notebook"><NotebookIcon size={32} /></IconCard>
      <IconCard label="Spiral"><SpiralIcon size={32} /></IconCard>
      <IconCard label="Tab Divider"><TabDividerIcon size={32} /></IconCard>
      <IconCard label="Sticky Note"><StickyNoteIcon size={32} /></IconCard>
      <IconCard label="Push Pin"><PushPinIcon size={32} /></IconCard>
      <IconCard label="Tape"><TapeIcon size={32} /></IconCard>
      <IconCard label="Highlighter"><HighlighterIcon size={32} /></IconCard>
    </div>
  </div>
);

export const Sizes = () => {
  const sizes = [16, 20, 24, 32, 48] as const;
  return (
    <div className="p-8 space-y-4 max-w-md mx-auto">
      {sizes.map(s => (
        <div key={s} className="flex items-center gap-4 font-architect text-[13px] text-ink-muted">
          <span className="w-12 text-right">{s}px</span>
          <div className="flex gap-3 items-center">
            <NotebookIcon size={s} />
            <StickyNoteIcon size={s} />
            <PushPinIcon size={s} />
            <HighlighterIcon size={s} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const Colors = () => {
  const tones = [
    { name: 'Ink', color: '#3a3733' },
    { name: 'Sage', color: '#3f7a4e' },
    { name: 'Ochre', color: '#b07a2e' },
    { name: 'Sky', color: '#4a6f91' },
    { name: 'Lavender', color: '#6f63a3' },
    { name: 'Brick', color: '#a3544a' },
  ];
  return (
    <div className="p-8 space-y-3 max-w-lg mx-auto">
      {tones.map(t => (
        <div key={t.name} className="flex items-center gap-4 font-architect text-[13px]" style={{ color: t.color }}>
          <span className="w-20">{t.name}</span>
          <div className="flex gap-3 items-center">
            <NotebookIcon size={22} color={t.color} />
            <StickyNoteIcon size={22} color={t.color} />
            <PushPinIcon size={22} color={t.color} />
            <HighlighterIcon size={22} color={t.color} />
            <TabDividerIcon size={22} color={t.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const InContext = () => (
  <div className="p-8 space-y-6 max-w-lg mx-auto">
    <div className="flex flex-wrap gap-3">
      <PaperButton size="md"><NotebookIcon size={16} /> Open Notebook</PaperButton>
      <PaperButton size="sm"><StickyNoteIcon size={14} /> Add Note</PaperButton>
      <PaperButton size="sm"><PushPinIcon size={14} /> Pin</PaperButton>
      <PaperButton size="md"><HighlighterIcon size={16} /> Highlight</PaperButton>
    </div>
    <div className="flex flex-wrap gap-2">
      <PaperBadge tone="sage"><NotebookIcon size={12} color="#3f7a4e" /> Notebook</PaperBadge>
      <PaperBadge tone="ochre"><StickyNoteIcon size={12} color="#b07a2e" /> Sticky</PaperBadge>
      <PaperBadge tone="sky"><PushPinIcon size={12} color="#4a6f91" /> Pinned</PaperBadge>
      <PaperBadge tone="lavender"><HighlighterIcon size={12} color="#6f63a3" /> Highlighted</PaperBadge>
    </div>
    <div className="flex gap-4">
      <Paper className="w-56 p-5 flex flex-col gap-3 relative" surface="#f0f4ed">
        <div className="absolute -top-2 -right-2"><PushPinIcon size={14} color="#a3544a" strokeWidth={2} /></div>
        <div className="flex items-center gap-2">
          <NotebookIcon size={18} color="#3a3733" />
          <span className="font-architect text-[15px] text-ink font-semibold">Study Notes</span>
        </div>
        <span className="font-architect text-[12px] text-ink-muted">Linear Algebra · Chapter 4</span>
        <div className="flex items-center gap-2">
          <HighlighterIcon size={14} color="#b07a2e" />
          <span className="font-architect text-[12px] text-ink-muted">3 highlighted sections</span>
        </div>
      </Paper>
      <Paper className="w-56 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <TabDividerIcon size={18} color="#3f7a4e" />
          <span className="font-architect text-[15px] text-ink font-semibold">Flashcards</span>
        </div>
        <span className="font-architect text-[12px] text-ink-muted">12 due for review</span>
        <PaperBadge tone="sage"><SpiralIcon size={12} color="#3f7a4e" /> 24 cards</PaperBadge>
      </Paper>
    </div>
  </div>
);
