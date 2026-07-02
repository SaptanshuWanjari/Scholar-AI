import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationCenter, type NotificationItemData } from '@paper-ui/components/notifications';

const data: NotificationItemData[] = [
  { id: '1', variant: 'info', title: 'New course material', description: 'Chapter 7 slides', timestamp: '2 min ago', read: false },
  { id: '2', variant: 'success', title: 'Flashcards generated', description: '42 cards for Data Structures', timestamp: '10 min ago', read: false },
  { id: '3', variant: 'warning', title: 'Storage running low', description: '200MB remaining', timestamp: '1 hour ago', read: false },
  { id: '4', variant: 'error', title: 'Sync failed', description: 'Connection timeout', timestamp: '3 hours ago', read: true },
];

const meta: Meta<typeof NotificationCenter> = {
  title: 'Components/Notifications/NotificationCenter',
  component: NotificationCenter as any,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotificationCenter>;

export const Default: Story = {
  render: () => {
    const [notifs, setNotifs] = useState(data);
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <NotificationCenter
          notifications={notifs}
          onDismiss={(id) => setNotifs((p) => p.filter((n) => n.id !== id))}
          onMarkAllRead={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))}
          maxItems={4}
          onViewAll={() => console.log('View all')}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <NotificationCenter notifications={[]} />
    </div>
  ),
};

export const Composed: Story = {
  render: () => {
    const [notifs, setNotifs] = useState(data);
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <NotificationCenter
          notifications={notifs}
          onDismiss={(id) => setNotifs((p) => p.filter((n) => n.id !== id))}
          onMarkAllRead={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))}
          maxItems={3}
        >
          <NotificationCenter.Header unreadCount={notifs.filter((n) => !n.read).length} onMarkAllRead={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))} />
          <NotificationCenter.List notifications={notifs.slice(0, 3)} onDismiss={(id) => setNotifs((p) => p.filter((n) => n.id !== id))} />
          {notifs.length === 0 && <NotificationCenter.Empty />}
        </NotificationCenter>
      </div>
    );
  },
};
