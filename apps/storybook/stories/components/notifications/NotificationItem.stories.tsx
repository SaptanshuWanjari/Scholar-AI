import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationItem, type NotificationItemData } from '@paper-ui/components/notifications';

const sampleNotification: NotificationItemData = {
  id: '1',
  variant: 'info',
  title: 'New course material available',
  description: 'Operating Systems — Chapter 7 slides have been uploaded',
  timestamp: '2 min ago',
  read: false,
};

const meta: Meta<typeof NotificationItem.Root> = {
  title: 'Components/Notifications/NotificationItem',
  component: NotificationItem.Root as any,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotificationItem.Root>;

export const Info: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      <NotificationItem.Root
        notification={{ ...sampleNotification, variant: 'info', title: 'New course material', description: 'Chapter 7 slides uploaded' }}
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      <NotificationItem.Root
        notification={{ ...sampleNotification, variant: 'success', title: 'Quiz completed', description: 'Score: 85% on Data Structures Quiz 3', read: true }}
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      <NotificationItem.Root
        notification={{ ...sampleNotification, variant: 'warning', title: 'Storage alert', description: 'You have 200MB remaining' }}
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      <NotificationItem.Root
        notification={{ ...sampleNotification, variant: 'error', title: 'Sync failed', description: 'Could not connect to backup server' }}
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const NoTimestamp: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      <NotificationItem.Root
        notification={{
          id: '5',
          variant: 'info',
          title: 'Welcome to ScholarCLI',
          description: 'Start by uploading your study materials',
          read: false,
        }}
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const ListExample: Story = {
  render: () => {
    const items: NotificationItemData[] = [
      { id: '1', variant: 'info', title: 'New course material', description: 'Chapter 7 uploaded', timestamp: '2 min ago', read: false },
      { id: '2', variant: 'success', title: 'Flashcards generated', description: '42 cards for Data Structures', timestamp: '10 min ago', read: false },
      { id: '3', variant: 'warning', title: 'Storage running low', description: '200MB remaining', timestamp: '1 hour ago', read: true },
      { id: '4', variant: 'error', title: 'Sync failed', description: 'Connection timeout', timestamp: '3 hours ago', read: true },
      { id: '5', variant: 'info', title: 'Quiz results ready', description: 'Your score: 92%', timestamp: 'Yesterday', read: true },
    ];

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden border border-dashed border-[#d4cfc4]">
        {items.map(n => (
          <NotificationItem.Root key={n.id} notification={n} onDismiss={() => {}} />
        ))}
      </div>
    );
  },
};

export const ReadVsUnread: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden border border-dashed border-[#d4cfc4]">
      <NotificationItem.Root
        notification={{ ...sampleNotification, title: 'Unread — filled dot, full text', description: 'Filled colored dot, bold title', read: false }}
        onDismiss={() => {}}
      />
      <NotificationItem.Root
        notification={{ ...sampleNotification, variant: 'success', title: 'Read — outline dot, muted', description: 'Hollow dot, gray text, lower opacity', read: true }}
        onDismiss={() => {}}
      />
    </div>
  ),
};
