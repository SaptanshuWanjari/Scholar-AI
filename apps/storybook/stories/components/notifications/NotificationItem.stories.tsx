import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationItem, type NotificationItemData } from '@paper-ui/components/notifications';

const meta: Meta<typeof NotificationItem> = {
  title: 'Components/Notifications/NotificationItem',
  component: NotificationItem as any,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotificationItem>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-80">
      <div className="bg-white rounded-lg border border-dashed border-[#d4cfc4] overflow-hidden">
        <NotificationItem
          notification={{ id: '1', variant: 'info', title: 'New material', description: 'Chapter 7 uploaded', timestamp: '2 min ago', read: false }}
          onDismiss={() => console.log('Dismiss')}
        />
      </div>
    </div>
  ),
};

export const Unread: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-80">
      <div className="bg-white rounded-lg border border-dashed border-[#d4cfc4] overflow-hidden">
        <NotificationItem
          notification={{ id: '1', variant: 'success', title: 'Flashcards ready', description: '42 cards generated', timestamp: 'Just now', read: false }}
          onDismiss={() => console.log('Dismiss')}
        />
      </div>
    </div>
  ),
};

export const Composed: Story = {
  render: () => {
    const items: NotificationItemData[] = [
      { id: '1', variant: 'info', title: 'New material', description: 'Chapter 7', timestamp: '2 min ago', read: false },
      { id: '2', variant: 'success', title: 'Flashcards', description: '42 cards', timestamp: '10 min ago', read: false },
      { id: '3', variant: 'warning', title: 'Storage low', description: '200MB left', timestamp: '1 hour ago', read: true },
      { id: '4', variant: 'error', title: 'Sync failed', description: 'Timeout', timestamp: '3 hours ago', read: true },
    ];
    return (
      <div className="p-8 bg-[#f4f1ea] w-80">
        <div className="bg-white rounded-lg border border-dashed border-[#d4cfc4] overflow-hidden">
          {items.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onDismiss={() => console.log(`Dismiss ${n.id}`)}
            />
          ))}
        </div>
      </div>
    );
  },
};
