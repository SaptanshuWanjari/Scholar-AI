import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CourseTag } from '@paper-ui/components/badges';

const meta: Meta<typeof CourseTag> = {
  title: 'Components/Badges/CourseTag',
  component: CourseTag,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CourseTag>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <CourseTag course="Machine Learning" />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-3">
        <CourseTag course="Machine Learning" />
        <CourseTag course="Linear Algebra" tone="sky" />
        <CourseTag course="Data Structures" tone="sage" />
        <CourseTag course="Operating Systems" tone="lavender" />
      </div>
    </div>
  ),
};
