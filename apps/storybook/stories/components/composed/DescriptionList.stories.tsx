import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DescriptionList, DescriptionListItem } from '@paper-ui/components/dataDisplay';

const meta = {
  title: 'Components/Composed/DescriptionList',
  component: DescriptionList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj;

const data = [
  { label: 'Full name', value: 'Jane Doe' },
  { label: 'Role', value: 'Lead Designer' },
  { label: 'Email address', value: 'jane.doe@example.com' },
  { label: 'Bio', value: 'Enjoys sketching out ideas on physical paper before digitizing them. Loves coffee and sticky notes.' },
];

export const Minimal: Story = {
  render: () => (
    <div className="w-[600px] max-w-full">
      <DescriptionList variant="minimal">
        {data.map((item, idx) => (
          <DescriptionListItem key={idx} label={item.label} value={item.value} />
        ))}
      </DescriptionList>
    </div>
  ),
};

export const Notebook: Story = {
  render: () => (
    <div className="w-[600px] max-w-full">
      <DescriptionList variant="notebook">
        {data.map((item, idx) => (
          <DescriptionListItem key={idx} label={item.label} value={item.value} />
        ))}
      </DescriptionList>
    </div>
  ),
};

export const StickyNoteVariant: Story = {
  render: () => (
    <div className="w-[400px] max-w-full">
      <DescriptionList variant="sticky-note">
        {data.map((item, idx) => (
          <DescriptionListItem key={idx} label={item.label} value={item.value} />
        ))}
      </DescriptionList>
    </div>
  ),
};
