import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from '@paper-ui/components/utility';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/Utility/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => <div className="p-10 bg-[#fffdf9]">{Story()}</div>,
  ],
};
export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const LightDefault: Story = {
  args: { theme: 'light' },
};

export const DarkDefault: Story = {
  args: { theme: 'dark' },
  decorators: [
    (Story) => <div className="p-10 bg-[#1a1817]">{Story()}</div>,
  ],
};

export const Small: Story = {
  args: { theme: 'light', size: 'sm' },
};

export const Interactive: Story = {
  render: () => {
    const Comp = () => {
      const [theme, setTheme] = useState<'light' | 'dark'>('light');
      const isLight = theme === 'light';
      return (
        <div
          className="p-10 min-h-[120px] flex items-center justify-center transition-colors"
          style={{ background: isLight ? '#f4f1ea' : '#1a1817' }}
        >
          <ThemeToggle theme={theme} onToggle={setTheme} />
        </div>
      );
    };
    return <Comp />;
  },
};

export const SunMoonIcons: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <ThemeToggle.Sun size={24} />
      <ThemeToggle.Moon size={24} />
    </div>
  ),
};
