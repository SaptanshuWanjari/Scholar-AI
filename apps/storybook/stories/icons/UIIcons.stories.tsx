import React from 'react';
import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import {
  ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon,
  MenuIcon, CloseIcon, SearchIcon, PlusIcon, MinusIcon,
  ExternalLinkIcon, InfoIcon, AlertTriangleIcon, HelpCircleIcon, SettingsIcon,
} from '@paper-ui/icons';

const meta = {
  title: 'Icons/UI Icons',
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

export const AllUIIcons = () => (
  <div className="p-8">
    <div className="flex flex-wrap gap-6 justify-center max-w-3xl mx-auto">
      <IconCard label="Chevron Down"><ChevronDownIcon size={28} /></IconCard>
      <IconCard label="Chevron Up"><ChevronUpIcon size={28} /></IconCard>
      <IconCard label="Chevron Left"><ChevronLeftIcon size={28} /></IconCard>
      <IconCard label="Chevron Right"><ChevronRightIcon size={28} /></IconCard>
      <IconCard label="Menu"><MenuIcon size={28} /></IconCard>
      <IconCard label="Close"><CloseIcon size={28} /></IconCard>
      <IconCard label="Search"><SearchIcon size={28} /></IconCard>
      <IconCard label="Plus"><PlusIcon size={28} /></IconCard>
      <IconCard label="Minus"><MinusIcon size={28} /></IconCard>
      <IconCard label="External Link"><ExternalLinkIcon size={28} /></IconCard>
      <IconCard label="Info"><InfoIcon size={28} /></IconCard>
      <IconCard label="Alert"><AlertTriangleIcon size={28} /></IconCard>
      <IconCard label="Help"><HelpCircleIcon size={28} /></IconCard>
      <IconCard label="Settings"><SettingsIcon size={28} /></IconCard>
    </div>
  </div>
);

export const Sizes = () => {
  const sizes = [12, 16, 20, 24, 32] as const;
  return (
    <div className="p-8 space-y-4 max-w-md mx-auto">
      {sizes.map(s => (
        <div key={s} className="flex items-center gap-4 font-architect text-[13px] text-ink-muted">
          <span className="w-12 text-right">{s}px</span>
          <div className="flex gap-3 items-center">
            <ChevronDownIcon size={s} />
            <MenuIcon size={s} />
            <CloseIcon size={s} />
            <SearchIcon size={s} />
            <PlusIcon size={s} />
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
            <InfoIcon size={22} color={t.color} />
            <AlertTriangleIcon size={22} color={t.color} />
            <HelpCircleIcon size={22} color={t.color} />
            <SettingsIcon size={22} color={t.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const InContext = () => (
  <div className="p-8 space-y-6 max-w-lg mx-auto">
    <div className="flex flex-wrap gap-3">
      <PaperButton size="sm"><ChevronDownIcon size={14} /> Select</PaperButton>
      <PaperButton size="md"><PlusIcon size={16} /> Add New</PaperButton>
      <PaperButton size="md" tone="green"><SearchIcon size={16} /> Search</PaperButton>
      <PaperButton size="lg"><SettingsIcon size={18} /> Settings</PaperButton>
    </div>
    <div className="flex flex-wrap gap-2">
      <PaperBadge tone="sky"><ExternalLinkIcon size={12} color="#4a6f91" /> Link</PaperBadge>
      <PaperBadge tone="brick"><AlertTriangleIcon size={12} color="#a3544a" /> Warning</PaperBadge>
      <PaperBadge tone="ochre"><InfoIcon size={12} color="#b07a2e" /> Info</PaperBadge>
      <PaperBadge tone="ink"><SettingsIcon size={12} /> Options</PaperBadge>
    </div>
    <Paper className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <PaperButton size="sm" className="p-1.5"><MenuIcon size={16} /></PaperButton>
        <span className="font-architect text-[15px] text-ink font-semibold">My Notebook</span>
      </div>
      <div className="flex items-center gap-2">
        <PaperButton size="sm" className="p-1.5"><SearchIcon size={16} /></PaperButton>
        <PaperButton size="sm" className="p-1.5"><PlusIcon size={16} /></PaperButton>
        <PaperButton size="sm" className="p-1.5"><SettingsIcon size={16} /></PaperButton>
      </div>
    </Paper>
    <div className="flex flex-col gap-3">
      {[
        { icon: AlertTriangleIcon, color: '#a3544a', text: 'You have 3 overdue assignments' },
        { icon: InfoIcon, color: '#4a6f91', text: 'New study materials available' },
        { icon: HelpCircleIcon, color: '#6f63a3', text: 'Need help? Check the guide' },
      ].map(({ icon: Icon, color, text }) => (
        <div key={text} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: color, backgroundColor: `${color}12` }}>
          <Icon size={18} color={color} />
          <span className="font-architect text-[13px]" style={{ color }}>{text}</span>
        </div>
      ))}
    </div>
  </div>
);
