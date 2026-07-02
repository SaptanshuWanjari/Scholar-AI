import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChipButton } from '@paper-ui/components/buttons';

const meta: Meta<typeof ChipButton> = {
  title: 'Components/Buttons/ChipButton',
  component: ChipButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ChipButton>;

const TAGS = ['React', 'TypeScript', 'Tailwind', 'Storybook', 'Vite'];

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ChipButton>React</ChipButton>
    </div>
  ),
};

export const Removable: Story = {
  render: () => {
    const [chips, setChips] = useState(TAGS);
    return (
      <div className="p-8 bg-[#f4f1ea] space-y-4">
        <div className="flex flex-wrap gap-2">
          {chips.map(tag => (
            <ChipButton key={tag} onClick={() => setChips(chips.filter(t => t !== tag))}>
              {tag} ×
            </ChipButton>
          ))}
        </div>
      </div>
    );
  },
};

export const Selected: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['React']);
    return (
      <div className="p-8 bg-[#f4f1ea] space-y-4">
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <ChipButton
              key={tag}
              selected={selected.includes(tag)}
              onClick={() =>
                setSelected(s => s.includes(tag) ? s.filter(t => t !== tag) : [...s, tag])
              }
            >
              {tag}
            </ChipButton>
          ))}
        </div>
        <p className="text-sm font-mono text-gray-600">Selected: {selected.join(', ') || 'none'}</p>
      </div>
    );
  },
};
