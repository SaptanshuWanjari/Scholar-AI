import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Center } from '@paper-ui/components/layout';

const meta: Meta<typeof Center> = {
  title: 'Components/Layout/Center',
  component: Center,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Center>;

export const Default: Story = {
  render: () => (
    <Center className="p-8 bg-[#f4f1ea] min-h-[300px]">
      <div className="p-6 bg-white border-2 border-ink/20 rounded text-center">
        <div className="font-architect text-lg font-bold">Centered Content</div>
        <p className="font-kalam text-ink-muted mt-2">This content is perfectly centered both horizontally and vertically.</p>
      </div>
    </Center>
  ),
};

export const WithBackground: Story = {
  render: () => (
    <Center className="p-8 bg-gradient-to-br from-sky-soft/30 to-lavender-soft/30 min-h-[300px]">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <div className="font-architect text-2xl font-bold">✓</div>
        <p className="font-kalam text-ink-muted mt-2">Center works great with various backgrounds</p>
      </div>
    </Center>
  ),
};
