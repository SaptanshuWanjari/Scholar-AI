import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@paper-ui/components/layout';

const meta: Meta<typeof Stack> = {
  title: 'Components/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  render: () => (
    <Stack className="p-8 bg-[#f4f1ea] max-w-sm gap-md">
      <div className="p-4 bg-white border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Item 1</div>
      </div>
      <div className="p-4 bg-white border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Item 2</div>
      </div>
      <div className="p-4 bg-white border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Item 3</div>
      </div>
    </Stack>
  ),
};

export const WithGap: Story = {
  render: () => (
    <Stack spacing="lg" className="p-8 bg-[#f4f1ea] max-w-sm">
      <div className="p-4 bg-sky-soft/20 border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Large spacing between</div>
      </div>
      <div className="p-4 bg-sky-soft/20 border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Stack items</div>
      </div>
      <div className="p-4 bg-sky-soft/20 border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Easy to see the gap</div>
      </div>
    </Stack>
  ),
};
