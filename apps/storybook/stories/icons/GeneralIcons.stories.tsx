import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { HomeIcon, UserIcon, BellIcon, HeartIcon, EditIcon, TrashIcon, DownloadIcon, SettingsIcon } from '@paper-ui/icons';

const meta = {
  title: 'Icons/General Icons',
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

export const AllGeneralIcons = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="flex flex-wrap gap-4 justify-center max-w-2xl mx-auto">
      <IconCard label="Home"><HomeIcon size={28} /></IconCard>
      <IconCard label="User"><UserIcon size={28} /></IconCard>
      <IconCard label="Bell"><BellIcon size={28} /></IconCard>
      <IconCard label="Heart"><HeartIcon size={28} /></IconCard>
      <IconCard label="Edit"><EditIcon size={28} /></IconCard>
      <IconCard label="Trash"><TrashIcon size={28} /></IconCard>
      <IconCard label="Download"><DownloadIcon size={28} /></IconCard>
      <IconCard label="Settings"><SettingsIcon size={28} /></IconCard>
    </div>
  </div>
);

export const Sizes = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="space-y-2 max-w-xs">
      {[16, 24, 32, 48].map(s => (
        <div key={s} className="flex items-center gap-2">
          <span className="text-xs w-6">{s}px</span>
          <HomeIcon size={s} />
          <UserIcon size={s} />
          <BellIcon size={s} />
        </div>
      ))}
    </div>
  </div>
);

export const Toolbar = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <Paper className="w-full max-w-xs p-2 flex justify-between">
      <div className="flex gap-1">
        <PaperButton size="sm" className="p-1.5"><EditIcon size={14} /></PaperButton>
        <PaperButton size="sm" className="p-1.5"><TrashIcon size={14} /></PaperButton>
        <PaperButton size="sm" className="p-1.5"><DownloadIcon size={14} /></PaperButton>
      </div>
      <div className="flex gap-1">
        <PaperButton size="sm" className="p-1.5"><BellIcon size={14} /></PaperButton>
        <PaperButton size="sm" className="p-1.5"><SettingsIcon size={14} /></PaperButton>
      </div>
    </Paper>
  </div>
);
