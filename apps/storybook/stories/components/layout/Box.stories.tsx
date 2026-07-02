import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@paper-ui/components/layout';

const meta: Meta<typeof Box> = {
  title: 'Components/Layout/Box',
  component: Box,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  render: () => (
    <Box className="p-8 bg-[#f4f1ea]">
      <Box className="p-6 bg-white border-2 border-ink/20 rounded">
        <div className="font-architect text-lg font-bold">Basic Box</div>
        <p className="font-kalam text-ink-muted mt-2">A simple container component with customizable padding and spacing.</p>
      </Box>
    </Box>
  ),
};

export const WithBackground: Story = {
  render: () => (
    <Box className="p-8 bg-[#f4f1ea]">
      <Box className="p-6 bg-sky-soft/30 border border-ink/10 rounded">
        <div className="font-architect text-lg font-bold">Colored Box</div>
        <p className="font-kalam text-ink-muted mt-2">Box with background and border styling applied.</p>
      </Box>
    </Box>
  ),
};
