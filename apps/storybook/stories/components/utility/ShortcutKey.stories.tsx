import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShortcutKey } from '@paper-ui/components/utility';

const meta: Meta<typeof ShortcutKey> = {
  title: 'Components/Utility/ShortcutKey',
  component: ShortcutKey,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => <div className="p-10 bg-[#f4f1ea]">{Story()}</div>,
  ],
};
export default meta;
type Story = StoryObj<typeof ShortcutKey>;

export const Default: Story = {
  args: { keys: ['⌘', 'K'] },
};

export const ThreeKeys: Story = {
  args: { keys: ['Ctrl', 'Shift', 'P'] },
};

export const SingleKey: Story = {
  args: { keys: ['Esc'] },
};

export const CompoundChildren: Story = {
  render: () => (
    <ShortcutKey keys={['⌘', 'Shift', 'F']}>
      <ShortcutKey.Key>
        <span className="text-[13px]">⌘</span>
      </ShortcutKey.Key>
      <ShortcutKey.Plus />
      <ShortcutKey.Key>Shift</ShortcutKey.Key>
      <ShortcutKey.Plus />
      <ShortcutKey.Key>F</ShortcutKey.Key>
    </ShortcutKey>
  ),
};

export const InlineExample: Story = {
  render: () => (
    <div className="space-y-3">
      <p className="font-architect text-sm text-ink-muted">
        Press <ShortcutKey keys={['⌘', 'K']} /> to open command bar
      </p>
      <p className="font-architect text-sm text-ink-muted">
        Use <ShortcutKey keys={['Ctrl', 'C']} /> to copy and{' '}
        <ShortcutKey keys={['Ctrl', 'V']} /> to paste
      </p>
      <p className="font-architect text-sm text-ink-muted">
        Dismiss with <ShortcutKey keys={['Esc']} />
      </p>
    </div>
  ),
};
