import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { PaperButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { CheckCircleIcon, ClockIcon, TargetIcon, StarIcon } from '@paper-ui/icons';

const meta = {
  title: 'Icons/Productivity Icons',
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

export const AllProductivityIcons = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="flex flex-wrap gap-4 justify-center max-w-2xl mx-auto">
      <IconCard label="Check"><CheckCircleIcon size={28} /></IconCard>
      <IconCard label="Clock"><ClockIcon size={28} /></IconCard>
      <IconCard label="Target"><TargetIcon size={28} /></IconCard>
      <IconCard label="Star"><StarIcon size={28} /></IconCard>
    </div>
  </div>
);

export const Sizes = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="space-y-2 max-w-xs">
      {[16, 24, 32, 48].map(s => (
        <div key={s} className="flex items-center gap-2">
          <span className="text-xs w-6">{s}px</span>
          <CheckCircleIcon size={s} />
          <ClockIcon size={s} />
          <TargetIcon size={s} />
        </div>
      ))}
    </div>
  </div>
);

export const InContext = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="space-y-3 max-w-xs">
      <div className="flex gap-2 flex-wrap">
        <PaperButton size="sm"><CheckCircleIcon size={14} /> Complete</PaperButton>
        <PaperButton size="sm"><ClockIcon size={14} /> Timer</PaperButton>
        <PaperButton size="sm"><StarIcon size={14} /> Favorite</PaperButton>
      </div>
      <div className="flex gap-2 flex-wrap">
        <PaperBadge tone="sage"><CheckCircleIcon size={12} /> Done</PaperBadge>
        <PaperBadge tone="sky"><TargetIcon size={12} /> Goal</PaperBadge>
        <PaperBadge tone="lavender"><StarIcon size={12} /> Featured</PaperBadge>
      </div>
    </div>
  </div>
);
