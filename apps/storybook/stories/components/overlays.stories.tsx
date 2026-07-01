import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  HoverCard,
  Sheet,
  FloatingToolbar,
  Inspector,
  ActionSheet,
} from '@paper-ui/components/overlays';
import { CommandDialog } from '@paper-ui/components/commands';
import { Text, Caption, Blockquote } from '@paper-ui/components/typography';
import { PaperButton, IconButton } from '@paper-ui/components/buttons';
import { BookOpen, FileText, Search, Settings, User, Trash2, Share2, Download, Edit3, Copy } from 'lucide-react';

const meta = {
  title: 'Components/Overlays',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

// ---- HoverCard ------------------------------------------------------------

export const HoverCardExample = () => (
  <div className="p-20 bg-[#f4f1ea] flex gap-12 justify-center">
    <HoverCard
      trigger={<span className="font-kalam text-sky underline cursor-help" style={{ color: '#4a6f91' }}>spaced repetition</span>}
      openDelay={300}
    >
      <div className="min-w-[220px]">
        <p className="font-bold text-[15px]">Spaced Repetition</p>
        <p className="mt-1 text-sm text-[#6b6055]">
          Study technique that reviews material at increasing intervals to
          exploit the spacing effect for long-term memory.
        </p>
      </div>
    </HoverCard>

    <HoverCard
      trigger={<span className="font-kalam text-sage underline cursor-help" style={{ color: '#3f7a4e' }}>active recall</span>}
      placement="top"
      openDelay={500}
      maxWidth={240}
    >
      <div>
        <p className="font-bold text-[15px]">Active Recall</p>
        <p className="mt-1 text-sm text-[#6b6055]">
          Retrieving information from memory strengthens neural connections
          more than passive review.
        </p>
      </div>
    </HoverCard>

    <HoverCard
      trigger={<span className="font-kalam text-ochre underline cursor-help" style={{ color: '#b07a2e' }}>Feynman Technique</span>}
      placement="bottom"
    >
      <div className="min-w-[200px]">
        <p className="font-bold text-[15px]">Feynman Technique</p>
        <p className="mt-1 text-sm text-[#6b6055]">
          Explain a concept in simple terms. Where you stumble is where
          you need to study more.
        </p>
      </div>
    </HoverCard>
  </div>
);

// ---- Sheet ----------------------------------------------------------------

const SheetExample = () => {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<'right' | 'bottom'>('right');

  return (
    <div className="p-10 bg-[#f4f1ea] space-y-4">
      <div className="flex gap-3">
        <PaperButton size="sm" onClick={() => { setSide('right'); setOpen(true); }}>
          Open Right Sheet
        </PaperButton>
        <PaperButton size="sm" onClick={() => { setSide('bottom'); setOpen(true); }}>
          Open Bottom Sheet
        </PaperButton>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} side={side} title="Study Session Details">
        <div className="space-y-4">
          <p className="font-kalam text-sm text-[#3a3733]">
            This sheet contains auxiliary information about your current study session.
          </p>
          <Blockquote tone="sage" attribution="Cal Newport">
            If you don't produce, you won't thrive — no matter how skilled or talented you are.
          </Blockquote>
          <div className="space-y-2">
            <p className="font-architect text-xs uppercase text-[#9c9484]">Session Stats</p>
            <div className="flex justify-between font-kalam text-sm text-[#3a3733]">
              <span>Cards reviewed</span><span>42</span>
            </div>
            <div className="flex justify-between font-kalam text-sm text-[#3a3733]">
              <span>Accuracy</span><span>87%</span>
            </div>
            <div className="flex justify-between font-kalam text-sm text-[#3a3733]">
              <span>Time spent</span><span>24 min</span>
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  );
};

// ---- CommandDialog --------------------------------------------------------

const CommandDialogExample = () => {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState('');

  const items = [
    { id: 'search', label: 'Search notes...', icon: <Search size={16} />, onSelect: () => setLast('Search notes') },
    { id: 'create', label: 'Create new flashcard deck', icon: <FileText size={16} />, onSelect: () => setLast('Create deck') },
    { id: 'topics', label: 'Browse all topics', icon: <BookOpen size={16} />, onSelect: () => setLast('Browse topics') },
    { id: 'settings', label: 'Open preferences', icon: <Settings size={16} />, onSelect: () => setLast('Preferences') },
    { id: 'profile', label: 'View profile', icon: <User size={16} />, onSelect: () => setLast('Profile') },
    { id: 'export', label: 'Export study data', icon: <Download size={16} />, onSelect: () => setLast('Export data') },
  ];

  return (
    <div className="p-10 bg-[#f4f1ea] space-y-4">
      <PaperButton size="sm" onClick={() => setOpen(true)}>
        Open Command Palette (⌘K)
      </PaperButton>
      {last && <Caption>Last selected: {last}</Caption>}
      <CommandDialog open={open} onClose={() => setOpen(false)} items={items} placeholder="Type a command..." />
    </div>
  );
};

// ---- FloatingToolbar ------------------------------------------------------

const FloatingToolbarExample = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <Caption>Select any text below to see the floating toolbar.</Caption>
    <div className="mt-4 p-6 bg-white border border-[#d4cfc2] rounded-lg max-w-2xl">
      <p className="font-kalam text-base text-[#3a3733] leading-relaxed">
        The transformer architecture, introduced in the paper
        <em> "Attention Is All You Need"</em>, revolutionized natural language
        processing by replacing recurrent connections with self-attention
        mechanisms. This allowed models to process entire sequences in parallel,
        dramatically improving training efficiency and enabling the scaling
        that led to modern large language models.
      </p>
      <p className="font-kalam text-base text-[#3a3733] leading-relaxed mt-3">
        Select any phrase to see formatting options appear. The toolbar follows
        text selection and positions itself near the highlighted text.
      </p>
    </div>
    <FloatingToolbar offsetY={8}>
      <IconButton aria-label="Bold"><strong>B</strong></IconButton>
      <IconButton aria-label="Italic"><em>I</em></IconButton>
      <IconButton aria-label="Copy"><Copy size={14} /></IconButton>
      <IconButton aria-label="Edit"><Edit3 size={14} /></IconButton>
    </FloatingToolbar>
  </div>
);

// ---- Inspector ------------------------------------------------------------

const InspectorExample = () => {
  const [open, setOpen] = useState(false);

  const fields = [
    { label: 'Title', value: 'Linear Algebra Final Review' },
    { label: 'Course', value: 'MATH 240' },
    { label: 'Cards', value: 128 },
    { label: 'Created', value: 'Mar 15, 2026' },
    { label: 'Last studied', value: 'Jun 28, 2026' },
    { label: 'Accuracy', value: '91% (avg)' },
    { label: 'Status', value: <span style={{ color: '#3f7a4e' }}>Active</span> },
  ];

  return (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperButton size="sm" onClick={() => setOpen(true)}>
        Inspect Deck
      </PaperButton>
      <Inspector open={open} onClose={() => setOpen(false)} title="Deck Inspector" fields={fields}>
        <div className="flex gap-2 mt-3">
          <PaperButton size="sm" tone="paper">
            Edit deck
          </PaperButton>
          <PaperButton size="sm" tone="red">
            Delete deck
          </PaperButton>
        </div>
      </Inspector>
    </div>
  );
};

// ---- ActionSheet ----------------------------------------------------------

const ActionSheetExample = () => {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState('');

  const items = [
    { id: 'share', label: 'Share deck', icon: <Share2 size={16} />, onSelect: () => setLastAction('Shared') },
    { id: 'edit', label: 'Rename deck', icon: <Edit3 size={16} />, onSelect: () => setLastAction('Renamed') },
    { id: 'export', label: 'Export as PDF', icon: <Download size={16} />, onSelect: () => setLastAction('Exported') },
    { id: 'duplicate', label: 'Duplicate deck', icon: <Copy size={16} />, onSelect: () => setLastAction('Duplicated') },
    {
      id: 'delete',
      label: 'Delete deck',
      icon: <Trash2 size={16} />,
      destructive: true,
      onSelect: () => setLastAction('Deleted'),
    },
  ];

  return (
    <div className="p-10 bg-[#f4f1ea] space-y-4">
      <PaperButton size="sm" onClick={() => setOpen(true)}>
        Show Actions
      </PaperButton>
      {lastAction && <Caption>Last action: {lastAction}</Caption>}
      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Deck Actions"
        items={items}
      />
    </div>
  );
};

// ---- Re-export interactive stories as named StoryObj -----------------------

export const SheetStory: StoryObj = {
  render: SheetExample,
  name: 'Sheet',
};

export const CommandDialogStory: StoryObj = {
  render: CommandDialogExample,
  name: 'CommandDialog',
};

export const FloatingToolbarStory: StoryObj = {
  render: FloatingToolbarExample,
  name: 'FloatingToolbar',
};

export const InspectorStory: StoryObj = {
  render: InspectorExample,
  name: 'Inspector',
};

export const ActionSheetStory: StoryObj = {
  render: ActionSheetExample,
  name: 'ActionSheet',
};
