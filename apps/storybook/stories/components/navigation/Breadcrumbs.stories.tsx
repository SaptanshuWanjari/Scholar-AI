import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from '@paper-ui/components/navigation';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Breadcrumbs
        items={[
          { label: 'Courses', onClick: () => {} },
          { label: 'Mathematics', onClick: () => {} },
          { label: 'Calculus' }
        ]}
      />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => {} },
          { label: 'Documents', onClick: () => {} },
          { label: 'Notebooks', onClick: () => {} },
          { label: 'Study Notes' }
        ]}
      />
    </div>
  ),
};
