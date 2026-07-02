import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Spacer } from '@paper-ui/components/layout';

const meta: Meta<typeof Spacer> = {
  title: 'Components/Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Spacer>;

export const Default: Story = {
  render: () => (
    <Flex className="p-8 bg-[#f4f1ea] items-center gap-4">
      <div className="p-3 bg-white border border-ink/20 rounded">
        <div className="font-kalam text-sm text-ink-muted">Start</div>
      </div>
      <Spacer />
      <div className="p-3 bg-white border border-ink/20 rounded">
        <div className="font-kalam text-sm text-ink-muted">End</div>
      </div>
    </Flex>
  ),
};

export const ToolbarLayout: Story = {
  render: () => (
    <Flex className="p-8 bg-[#f4f1ea] items-center border-b border-ink/10">
      <div className="font-architect font-bold">Header</div>
      <Spacer />
      <Flex gap="xs" className="gap-2">
        <button className="px-3 py-1.5 bg-sky-soft border border-ink/20 rounded text-sm font-kalam hover:bg-sky-soft/80">Button 1</button>
        <button className="px-3 py-1.5 bg-sage-soft border border-ink/20 rounded text-sm font-kalam hover:bg-sage-soft/80">Button 2</button>
      </Flex>
    </Flex>
  ),
};
