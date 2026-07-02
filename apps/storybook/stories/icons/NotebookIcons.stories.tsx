import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { NotebookIcon, StickyNoteIcon, PushPinIcon, HighlighterIcon } from '@paper-ui/icons';

const meta = {
  title: 'Icons/Notebook Icons',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const IconCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Paper className="w-24 h-24 flex flex-col items-center justify-center gap-1">
    {children}
    <span className="font-architect text-xs text-ink-muted">{label}</span>
  </Paper>
);

export const AllNotebookIcons = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="flex flex-wrap gap-4 justify-center max-w-2xl mx-auto">
      <IconCard label="Notebook"><NotebookIcon size={28} /></IconCard>
      <IconCard label="Sticky"><StickyNoteIcon size={28} /></IconCard>
      <IconCard label="Pin"><PushPinIcon size={28} /></IconCard>
      <IconCard label="Highlighter"><HighlighterIcon size={28} /></IconCard>
    </div>
  </div>
);

export const Sizes = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="space-y-2 max-w-xs">
      {[16, 24, 32, 48].map(s => (
        <div key={s} className="flex items-center gap-2">
          <span className="text-xs w-6">{s}px</span>
          <NotebookIcon size={s} />
          <StickyNoteIcon size={s} />
          <PushPinIcon size={s} />
        </div>
      ))}
    </div>
  </div>
);

export const InContext = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="space-y-3 max-w-xs">
      <div className="flex gap-2 flex-wrap">
        <PaperButton size="sm"><NotebookIcon size={14} /> Notebook</PaperButton>
        <PaperButton size="sm"><StickyNoteIcon size={14} /> Note</PaperButton>
        <PaperButton size="sm"><HighlighterIcon size={14} /> Highlight</PaperButton>
      </div>
      <div className="flex gap-2 flex-wrap">
        <PaperBadge tone="sage"><NotebookIcon size={12} /> Notebook</PaperBadge>
        <PaperBadge tone="sky"><PushPinIcon size={12} /> Pinned</PaperBadge>
      </div>
    </div>
  </div>
);
