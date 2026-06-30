import React from 'react';
import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { SketchProgress } from '@paper-ui/components/progress';
import {
  CheckCircleIcon, ClockIcon, TargetIcon, FlagIcon,
  BarChartIcon, CalendarIcon, StarIcon, TimerIcon,
} from '@paper-ui/icons';

const meta = {
  title: 'Icons/Productivity Icons',
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

export const AllProductivityIcons = () => (
  <div className="p-8">
    <div className="flex flex-wrap gap-6 justify-center max-w-3xl mx-auto">
      <IconCard label="Check Circle"><CheckCircleIcon size={32} /></IconCard>
      <IconCard label="Clock"><ClockIcon size={32} /></IconCard>
      <IconCard label="Target"><TargetIcon size={32} /></IconCard>
      <IconCard label="Flag"><FlagIcon size={32} /></IconCard>
      <IconCard label="Bar Chart"><BarChartIcon size={32} /></IconCard>
      <IconCard label="Calendar"><CalendarIcon size={32} /></IconCard>
      <IconCard label="Star"><StarIcon size={32} /></IconCard>
      <IconCard label="Timer"><TimerIcon size={32} /></IconCard>
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
            <CheckCircleIcon size={s} />
            <ClockIcon size={s} />
            <TargetIcon size={s} />
            <StarIcon size={s} />
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
            <CheckCircleIcon size={22} color={t.color} />
            <ClockIcon size={22} color={t.color} />
            <FlagIcon size={22} color={t.color} />
            <CalendarIcon size={22} color={t.color} />
            <StarIcon size={22} color={t.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const InContext = () => (
  <div className="p-8 space-y-6 max-w-xl mx-auto">
    <div className="flex flex-wrap gap-3">
      <PaperButton size="sm" tone="green"><CheckCircleIcon size={14} /> Complete</PaperButton>
      <PaperButton size="md"><ClockIcon size={16} /> Start Timer</PaperButton>
      <PaperButton size="md"><TargetIcon size={16} /> Set Goal</PaperButton>
      <PaperButton size="lg"><FlagIcon size={18} /> Milestone</PaperButton>
      <PaperButton size="sm"><StarIcon size={14} /> Favorite</PaperButton>
    </div>
    <div className="flex flex-wrap gap-2">
      <PaperBadge tone="sage"><CheckCircleIcon size={12} color="#3f7a4e" /> Done</PaperBadge>
      <PaperBadge tone="ochre"><ClockIcon size={12} color="#b07a2e" /> 25 min</PaperBadge>
      <PaperBadge tone="sky"><TargetIcon size={12} color="#4a6f91" /> Goal</PaperBadge>
      <PaperBadge tone="lavender"><StarIcon size={12} color="#6f63a3" /> Featured</PaperBadge>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Paper className="p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ClockIcon size={18} color="#3a3733" />
          <span className="font-architect text-[15px] text-ink">Study Time</span>
        </div>
        <span className="text-[24px] text-ink font-bold font-architect">12.5h</span>
        <span className="font-architect text-[12px] text-ink-muted">+2.3h vs last week</span>
      </Paper>
      <Paper className="p-5 flex flex-col gap-2" surface="#f0f4ed">
        <div className="flex items-center gap-2">
          <TargetIcon size={18} color="#3f7a4e" />
          <span className="font-architect text-[15px] text-ink">Completion</span>
        </div>
        <span className="text-[24px] text-ink font-bold font-architect">78%</span>
        <SketchProgress value={78} />
      </Paper>
    </div>
  </div>
);

export const ReviewList = () => (
  <Paper className="w-80 p-5 mx-auto font-architect">
    <div className="flex items-center gap-2 mb-4">
      <CalendarIcon size={18} color="#3a3733" />
      <span className="text-[15px] text-ink font-semibold">Today's Review</span>
    </div>
    <div className="flex flex-col gap-3">
      {[
        { label: 'Vector Spaces', done: true },
        { label: 'Matrix Operations', done: true },
        { label: 'Eigenvalues', done: false },
        { label: 'Diagonalization', done: false },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-2">
          {item.done ? (
            <CheckCircleIcon size={16} color="#3f7a4e" />
          ) : (
            <TimerIcon size={16} color="#a39e93" />
          )}
          <span className={`text-[14px] ${item.done ? 'text-ink-muted line-through' : 'text-ink'}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  </Paper>
);
