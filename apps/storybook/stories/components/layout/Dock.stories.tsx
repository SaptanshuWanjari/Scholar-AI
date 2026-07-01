import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dock } from '@paper-ui/components/layout';
import { PaperCard, SketchBorder, PaperIconCircle } from '@paper-ui/core';
import { PushPin, Tape, StickyNote } from '@paper-ui/components/decorations';
import { Home, FileText, Folder, CheckSquare, HelpCircle, MoreHorizontal, Pencil, Paperclip, Trash2, Code } from 'lucide-react';

const meta: Meta<typeof Dock> = {
  title: 'Components/Layout/Dock',
  component: Dock,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Dock>;

const DOCK_ITEMS = [
  { label: 'Home', tone: 'sky' as const, Icon: Home },
  { label: 'Notes', tone: 'ochre' as const, Icon: FileText },
  { label: 'Files', tone: 'sage' as const, Icon: Folder },
  { label: 'Tasks', tone: 'lavender' as const, Icon: CheckSquare },
  { label: 'Help', tone: 'brick' as const, Icon: HelpCircle },
  { label: 'More', tone: 'ink' as const, Icon: MoreHorizontal },
];

export const PaperDock: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea] min-h-[500px] flex flex-col justify-end">
      <PaperCard className="p-4 rounded-t-xl" surface="#fcfaf8" shadow="md" border={{ stroke: '#3a3733', strokeWidth: 1, bleed: 2 }}>
        <Dock className="w-full" gap={20}>
          {DOCK_ITEMS.map(({ label, tone, Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 cursor-pointer group" role="button" tabIndex={0}>
              <PaperIconCircle tone={tone} size={48}>
                <Icon size={22} />
              </PaperIconCircle>
              <span className="font-kalam text-[11px] text-ink-muted/60 opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
            </div>
          ))}
        </Dock>
      </PaperCard>
    </div>
  ),
};

export const SketchyDock: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea] min-h-[500px] flex flex-col justify-end">
      <div className="relative px-6 py-4 bg-paper">
        <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.8} shadow={6} bleed={3} radius={8} />
        <Tape corner="top-left" width={50} />
        <PushPin color="var(--color-sky)" position="top-right" size={22} />
        <Dock className="w-full relative z-[1]" gap={12}>
          {DOCK_ITEMS.map(({ label, tone, Icon }, i) => (
            <div key={label} className="flex flex-col items-center gap-1 cursor-pointer group" role="button" tabIndex={0}>
              <StickyNote color={i === 0 ? '#fdf6b5' : i === 3 ? '#fde8e8' : '#e8f0fe'} size={56} rotate={(i - 2) * 1.5} pin="none">
                <Icon size={20} color="var(--color-ink)" />
              </StickyNote>
              <span className="font-kalam text-[10px] text-ink-muted/70 opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
            </div>
          ))}
        </Dock>
      </div>
    </div>
  ),
};

export const MiniToolbar: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea] min-h-[400px] flex flex-col justify-center items-center">
      <PaperCard className="p-4 rounded-2xl" surface="#faf8f4" shadow="md" border={{ stroke: '#3a3733', strokeWidth: 1, bleed: 2 }}>
        <Dock className="w-full" gap={10}>
          {[
            { label: 'Code', tone: 'sky' as const, Icon: Code },
            { label: 'Write', tone: 'ochre' as const, Icon: Pencil },
            { label: 'Attach', tone: 'lavender' as const, Icon: Paperclip },
            { label: 'Trash', tone: 'brick' as const, Icon: Trash2 },
          ].map(({ label, tone, Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 cursor-pointer group" role="button" tabIndex={0}>
              <PaperIconCircle tone={tone} size={42}>
                <Icon size={20} />
              </PaperIconCircle>
              <span className="font-kalam text-[10px] text-ink-muted/70 opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
            </div>
          ))}
        </Dock>
      </PaperCard>
    </div>
  ),
};
