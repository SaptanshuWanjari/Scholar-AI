import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '@paper-ui/components/navigation';
import { Box } from '@paper-ui/components/layout';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('t1');
    return <Tabs items={[{ key: 't1', label: 'Overview' }, { key: 't2', label: 'Settings' }, { key: 't3', label: 'Billing' }]} active={active} onChange={setActive} />;
  }
};

export const BorderedContainer: Story = {
  render: () => {
    const [active, setActive] = useState('1');
    return (
      <Box className="p-4 border border-black/10 max-w-md bg-paper">
        <Tabs items={[{ key: '1', label: 'Code' }, { key: '2', label: 'Preview' }]} active={active} onChange={setActive} />
        <div className="mt-4 p-4 bg-black/5 font-kalam text-ink rounded">Content for {active}</div>
      </Box>
    );
  }
};

export const ManyTabs: Story = {
  render: () => {
    const [active, setActive] = useState('a');
    return <Tabs items={[
      { key: 'a', label: 'Section A' }, { key: 'b', label: 'Section B' },
      { key: 'c', label: 'Section C' }, { key: 'd', label: 'Section D' },
      { key: 'e', label: 'Section E' }
    ]} active={active} onChange={setActive} />;
  }
};
