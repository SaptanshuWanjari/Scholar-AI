import React from 'react';
import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import {
  HomeIcon, UserIcon, BellIcon, HeartIcon, EditIcon,
  TrashIcon, DownloadIcon, UploadIcon, RefreshIcon, LockIcon, UsersIcon,
  SettingsIcon,
} from '@paper-ui/icons';

const meta = {
  title: 'Icons/General Icons',
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

export const AllGeneralIcons = () => (
  <div className="p-8">
    <div className="flex flex-wrap gap-6 justify-center max-w-3xl mx-auto">
      <IconCard label="Home"><HomeIcon size={32} /></IconCard>
      <IconCard label="User"><UserIcon size={32} /></IconCard>
      <IconCard label="Bell"><BellIcon size={32} /></IconCard>
      <IconCard label="Heart"><HeartIcon size={32} /></IconCard>
      <IconCard label="Edit"><EditIcon size={32} /></IconCard>
      <IconCard label="Trash"><TrashIcon size={32} /></IconCard>
      <IconCard label="Download"><DownloadIcon size={32} /></IconCard>
      <IconCard label="Upload"><UploadIcon size={32} /></IconCard>
      <IconCard label="Refresh"><RefreshIcon size={32} /></IconCard>
      <IconCard label="Lock"><LockIcon size={32} /></IconCard>
      <IconCard label="Users"><UsersIcon size={32} /></IconCard>
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
            <HomeIcon size={s} />
            <UserIcon size={s} />
            <BellIcon size={s} />
            <HeartIcon size={s} />
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
            <HomeIcon size={22} color={t.color} />
            <BellIcon size={22} color={t.color} />
            <HeartIcon size={22} color={t.color} />
            <LockIcon size={22} color={t.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const InContext = () => (
  <div className="p-8 space-y-6 max-w-xl mx-auto">
    <div className="flex flex-wrap gap-3">
      <PaperButton size="sm"><HomeIcon size={14} /> Home</PaperButton>
      <PaperButton size="md"><UserIcon size={16} /> Profile</PaperButton>
      <PaperButton size="md" tone="green"><DownloadIcon size={16} /> Export</PaperButton>
      <PaperButton size="md"><EditIcon size={16} /> Edit</PaperButton>
      <PaperButton size="sm"><RefreshIcon size={14} /> Sync</PaperButton>
    </div>
    <div className="flex flex-wrap gap-2">
      <PaperBadge tone="sage"><UserIcon size={12} color="#3f7a4e" /> Online</PaperBadge>
      <PaperBadge tone="brick"><HeartIcon size={12} color="#a3544a" /> Liked</PaperBadge>
      <PaperBadge tone="sky"><LockIcon size={12} color="#4a6f91" /> Private</PaperBadge>
      <PaperBadge tone="ochre"><EditIcon size={12} color="#b07a2e" /> Draft</PaperBadge>
      <PaperBadge tone="lavender"><BellIcon size={12} color="#6f63a3" /> 3 new</PaperBadge>
    </div>
    <Paper className="w-72 p-5 flex flex-col items-center gap-3 mx-auto">
      <div className="relative">
        <UserIcon size={48} color="#3a3733" strokeWidth={1.6} />
        <div className="absolute -bottom-1 -right-1">
          <PaperBadge tone="sage" className="px-1.5 py-0.5 text-[10px]"><EditIcon size={10} color="#3f7a4e" /></PaperBadge>
        </div>
      </div>
      <span className="font-architect text-[16px] text-ink font-semibold">Alex Rivera</span>
      <span className="font-architect text-[13px] text-ink-muted">Machine Learning · 4th Year</span>
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1 text-ink-muted">
          <HeartIcon size={14} color="#a3544a" />
          <span className="font-architect text-[12px]">24</span>
        </div>
        <div className="flex items-center gap-1 text-ink-muted">
          <LockIcon size={14} color="#4a6f91" />
          <span className="font-architect text-[12px]">Private</span>
        </div>
      </div>
    </Paper>
  </div>
);

export const Toolbar = () => (
  <Paper className="w-full max-w-sm p-2 mx-auto flex items-center justify-between">
    <div className="flex items-center gap-1">
      <PaperButton size="sm" className="p-1.5"><EditIcon size={15} /></PaperButton>
      <PaperButton size="sm" className="p-1.5"><TrashIcon size={15} /></PaperButton>
      <PaperButton size="sm" className="p-1.5"><DownloadIcon size={15} /></PaperButton>
      <PaperButton size="sm" className="p-1.5"><UploadIcon size={15} /></PaperButton>
      <PaperButton size="sm" className="p-1.5"><RefreshIcon size={15} /></PaperButton>
    </div>
    <div className="flex items-center gap-1">
      <PaperButton size="sm" className="p-1.5"><BellIcon size={15} /></PaperButton>
      <PaperButton size="sm" className="p-1.5"><SettingsIcon size={15} /></PaperButton>
    </div>
  </Paper>
);
