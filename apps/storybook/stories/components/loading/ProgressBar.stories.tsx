import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '@paper-ui/components/loading';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Loading/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Determinate: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">ProgressBar — Determinate</h2>
      <div className="max-w-md space-y-6">
        {[
          { value: 0, tone: 'sage' as const },
          { value: 25, tone: 'ochre' as const },
          { value: 50, tone: 'sky' as const },
          { value: 75, tone: 'ochre' as const },
          { value: 100, tone: 'sage' as const },
        ].map(({ value, tone }) => (
          <ProgressBar key={value} value={value} tone={tone} size="md">
            <ProgressBar.Label>Progress</ProgressBar.Label>
            <ProgressBar.Percentage value={value} tone={tone} />
          </ProgressBar>
        ))}
      </div>
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">ProgressBar — Indeterminate</h2>
      <div className="max-w-md space-y-6">
        <ProgressBar variant="indeterminate" tone="sky">
          <ProgressBar.Label>Loading course data…</ProgressBar.Label>
        </ProgressBar>
        <ProgressBar variant="indeterminate" tone="brick">
          <ProgressBar.Label>Indexing documents…</ProgressBar.Label>
        </ProgressBar>
      </div>
      <style>{`
        @keyframes slide-indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        .animate-slide-indeterminate {
          animation: slide-indeterminate 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">ProgressBar — Sizes</h2>
      <div className="max-w-md space-y-6">
        {(['sm', 'md', 'lg'] as const).map(size => (
          <ProgressBar key={size} value={65} size={size} tone="ochre">
            <ProgressBar.Label>Size: {size}</ProgressBar.Label>
            <ProgressBar.Percentage value={65} tone="ochre" size={size} />
          </ProgressBar>
        ))}
      </div>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">ProgressBar — Tones</h2>
      <div className="max-w-md space-y-6">
        {(['sage', 'ochre', 'sky', 'brick'] as const).map(tone => (
          <ProgressBar key={tone} value={50} tone={tone}>
            <ProgressBar.Label>{tone}</ProgressBar.Label>
            <ProgressBar.Percentage value={50} tone={tone} />
          </ProgressBar>
        ))}
      </div>
    </div>
  ),
};

export const Compound: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">ProgressBar — Compound Usage</h2>
      <div className="max-w-md space-y-6">
        <ProgressBar.Track>
          <ProgressBar.Fill value={72} tone="brick" />
        </ProgressBar.Track>
        <div className="flex justify-between">
          <ProgressBar.Label>Compound track + fill</ProgressBar.Label>
          <ProgressBar.Percentage value={72} tone="brick" />
        </div>
      </div>
    </div>
  ),
};
