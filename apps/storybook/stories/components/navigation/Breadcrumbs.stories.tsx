import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from '@paper-ui/components/navigation';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', onClick: () => {} },
      { label: 'Library', onClick: () => {} },
      { label: 'Data' }
    ]
  }
};

export const DeepPath: Story = {
  args: {
    items: [
      { label: 'Home', onClick: () => {} },
      { label: 'Projects', onClick: () => {} },
      { label: 'Study CLI', onClick: () => {} },
      { label: 'Settings' }
    ]
  }
};

export const Simple: Story = {
  args: {
    items: [
      { label: 'Dashboard', onClick: () => {} },
      { label: 'Current' }
    ]
  }
};
