import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { MenuIcon, CloseIcon, SearchIcon, PlusIcon, SettingsIcon, InfoIcon } from '@paper-ui/icons';

const meta = {
  title: 'Icons/UI Icons',
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

export const AllUIIcons = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="flex flex-wrap gap-4 justify-center max-w-2xl mx-auto">
      <IconCard label="Menu"><MenuIcon size={28} /></IconCard>
      <IconCard label="Close"><CloseIcon size={28} /></IconCard>
      <IconCard label="Search"><SearchIcon size={28} /></IconCard>
      <IconCard label="Plus"><PlusIcon size={28} /></IconCard>
      <IconCard label="Settings"><SettingsIcon size={28} /></IconCard>
      <IconCard label="Info"><InfoIcon size={28} /></IconCard>
    </div>
  </div>
);

export const Sizes = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="space-y-2 max-w-xs">
      {[12, 20, 32].map(s => (
        <div key={s} className="flex items-center gap-2">
          <span className="text-xs w-6">{s}px</span>
          <MenuIcon size={s} />
          <SearchIcon size={s} />
          <PlusIcon size={s} />
          <SettingsIcon size={s} />
        </div>
      ))}
    </div>
  </div>
);

export const InContext = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="space-y-3 max-w-sm">
      <div className="flex gap-2 flex-wrap">
        <PaperButton size="sm"><SearchIcon size={14} /> Search</PaperButton>
        <PaperButton size="sm"><PlusIcon size={14} /> Add</PaperButton>
        <PaperButton size="sm"><SettingsIcon size={14} /> Settings</PaperButton>
      </div>
      <div className="flex gap-2 flex-wrap">
        <PaperBadge tone="sky"><InfoIcon size={12} /> Info</PaperBadge>
        <PaperBadge tone="brick">Warning</PaperBadge>
      </div>
      <Paper className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PaperButton size="sm" className="p-1"><MenuIcon size={14} /></PaperButton>
          <span className="font-architect text-sm font-semibold">Menu</span>
        </div>
        <div className="flex gap-1">
          <PaperButton size="sm" className="p-1"><SearchIcon size={14} /></PaperButton>
          <PaperButton size="sm" className="p-1"><PlusIcon size={14} /></PaperButton>
        </div>
      </Paper>
    </div>
  </div>
);
