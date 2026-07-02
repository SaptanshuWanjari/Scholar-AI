import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { DocumentIcon, FolderIcon, BookmarkIcon, EnvelopeIcon } from '@paper-ui/icons';

const meta = {
  title: 'Icons/Paper Icons',
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

export const AllPaperIcons = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="flex flex-wrap gap-4 justify-center max-w-2xl mx-auto">
      <IconCard label="Document"><DocumentIcon size={28} /></IconCard>
      <IconCard label="Folder"><FolderIcon size={28} /></IconCard>
      <IconCard label="Bookmark"><BookmarkIcon size={28} /></IconCard>
      <IconCard label="Envelope"><EnvelopeIcon size={28} /></IconCard>
    </div>
  </div>
);

export const Sizes = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="space-y-2 max-w-xs">
      {[16, 24, 32, 48].map(s => (
        <div key={s} className="flex items-center gap-2">
          <span className="text-xs w-6">{s}px</span>
          <DocumentIcon size={s} />
          <FolderIcon size={s} />
          <BookmarkIcon size={s} />
        </div>
      ))}
    </div>
  </div>
);

export const InContext = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="space-y-3 max-w-xs">
      <div className="flex gap-2 flex-wrap">
        <PaperButton size="sm"><DocumentIcon size={14} /> Document</PaperButton>
        <PaperButton size="sm"><FolderIcon size={14} /> Folder</PaperButton>
        <PaperButton size="sm"><EnvelopeIcon size={14} /> Send</PaperButton>
      </div>
      <div className="flex gap-2 flex-wrap">
        <PaperBadge tone="sage"><DocumentIcon size={12} /> PDF</PaperBadge>
        <PaperBadge tone="sky"><FolderIcon size={12} /> Folder</PaperBadge>
        <PaperBadge tone="ochre"><BookmarkIcon size={12} /> Saved</PaperBadge>
      </div>
    </div>
  </div>
);
