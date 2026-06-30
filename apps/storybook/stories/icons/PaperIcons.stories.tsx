import React from 'react';
import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import {
  DocumentIcon, NotebookPageIcon, FolderIcon, BookmarkIcon,
  ClipboardIcon, StampIcon, PaperSheetIcon, EnvelopeIcon,
} from '@paper-ui/icons';

const meta = {
  title: 'Icons/Paper Icons',
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

export const AllPaperIcons = () => (
  <div className="p-8">
    <div className="flex flex-wrap gap-6 justify-center max-w-3xl mx-auto">
      <IconCard label="Document"><DocumentIcon size={32} /></IconCard>
      <IconCard label="Notebook Page"><NotebookPageIcon size={32} /></IconCard>
      <IconCard label="Folder"><FolderIcon size={32} /></IconCard>
      <IconCard label="Bookmark"><BookmarkIcon size={32} /></IconCard>
      <IconCard label="Clipboard"><ClipboardIcon size={32} /></IconCard>
      <IconCard label="Stamp"><StampIcon size={32} /></IconCard>
      <IconCard label="Paper Sheet"><PaperSheetIcon size={32} /></IconCard>
      <IconCard label="Envelope"><EnvelopeIcon size={32} /></IconCard>
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
            <DocumentIcon size={s} />
            <FolderIcon size={s} />
            <ClipboardIcon size={s} />
            <BookmarkIcon size={s} />
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
            <DocumentIcon size={22} color={t.color} />
            <FolderIcon size={22} color={t.color} />
            <NotebookPageIcon size={22} color={t.color} />
            <BookmarkIcon size={22} color={t.color} />
            <EnvelopeIcon size={22} color={t.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const InContext = () => (
  <div className="p-8 space-y-6 max-w-lg mx-auto">
    <div className="flex flex-wrap gap-3">
      <PaperButton size="sm"><DocumentIcon size={14} /> Document</PaperButton>
      <PaperButton size="md"><FolderIcon size={16} /> Open Folder</PaperButton>
      <PaperButton size="lg"><EnvelopeIcon size={18} /> Send</PaperButton>
    </div>
    <div className="flex flex-wrap gap-2">
      <PaperBadge tone="sage"><DocumentIcon size={12} color="#3f7a4e" /> PDF</PaperBadge>
      <PaperBadge tone="sky"><FolderIcon size={12} color="#4a6f91" /> Folder</PaperBadge>
      <PaperBadge tone="ochre"><BookmarkIcon size={12} color="#b07a2e" /> Saved</PaperBadge>
      <PaperBadge tone="brick"><StampIcon size={12} color="#a3544a" /> Draft</PaperBadge>
    </div>
    <div className="flex gap-4">
      <Paper className="w-44 p-5 flex flex-col items-center gap-2">
        <DocumentIcon size={36} color="#3a3733" />
        <span className="font-architect text-[15px] text-ink">Blank Document</span>
        <span className="font-architect text-[12px] text-ink-muted">Create a new file</span>
      </Paper>
      <Paper className="w-44 p-5 flex flex-col items-center gap-2" surface="#f0f4ed">
        <FolderIcon size={36} color="#3f7a4e" />
        <span className="font-architect text-[15px] text-ink">Course Materials</span>
        <span className="font-architect text-[12px] text-ink-muted">12 files inside</span>
      </Paper>
    </div>
  </div>
);
