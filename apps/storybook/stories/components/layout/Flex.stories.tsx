import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '@paper-ui/components/layout';

const meta: Meta<typeof Flex> = {
  title: 'Components/Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Flex>;

export const Default: Story = {
  render: () => (
    <Flex className="p-8 bg-[#f4f1ea] gap-4">
      <div className="flex-1 p-4 bg-white border border-ink/20 rounded text-center">
        <div className="font-kalam text-ink-muted">Item 1</div>
      </div>
      <div className="flex-1 p-4 bg-sky-soft/20 border border-ink/20 rounded text-center">
        <div className="font-kalam text-ink-muted">Item 2</div>
      </div>
      <div className="flex-1 p-4 bg-sage-soft/20 border border-ink/20 rounded text-center">
        <div className="font-kalam text-ink-muted">Item 3</div>
      </div>
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex direction="column" className="p-8 bg-[#f4f1ea] gap-3 max-w-sm">
      <div className="p-3 bg-white border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Stacked Item 1</div>
      </div>
      <div className="p-3 bg-white border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Stacked Item 2</div>
      </div>
      <div className="p-3 bg-white border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Stacked Item 3</div>
      </div>
    </Flex>
  ),
};

export const CenteredItems: Story = {
  render: () => (
    <Flex align="center" justify="center" className="p-8 bg-[#f4f1ea] gap-4 min-h-[200px]">
      <div className="p-4 bg-ochre-soft/20 border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Aligned</div>
      </div>
      <div className="p-4 bg-brick-soft/20 border border-ink/20 rounded">
        <div className="font-kalam text-ink-muted">Centered</div>
      </div>
    </Flex>
  ),
};
