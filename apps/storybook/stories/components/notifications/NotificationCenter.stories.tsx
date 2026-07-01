import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationCenter, type NotificationItemData } from '@paper-ui/components/notifications';

const sampleNotifications: NotificationItemData[] = [
  { id: '1', variant: 'info', title: 'New course material added', description: 'Operating Systems — Chapter 7 slides', timestamp: '2 min ago', read: false },
  { id: '2', variant: 'success', title: 'Flashcards generated', description: '42 cards created for Data Structures', timestamp: '10 min ago', read: false },
  { id: '3', variant: 'warning', title: 'Storage running low', description: 'You have 200MB remaining', timestamp: '1 hour ago', read: false },
  { id: '4', variant: 'error', title: 'Failed to sync notes', description: 'Could not connect to backup server', timestamp: '3 hours ago', read: true },
  { id: '5', variant: 'info', title: 'Quiz results ready', description: 'Your score: 92% — Great job!', timestamp: 'Yesterday', read: true },
  { id: '6', variant: 'success', title: 'Course completed', description: 'You finished Introduction to Algorithms', timestamp: '2 days ago', read: true },
];

const meta: Meta<typeof NotificationCenter.Root> = {
  title: 'Components/Notifications/NotificationCenter',
  component: NotificationCenter.Root as any,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotificationCenter.Root>;

export const Inline: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(sampleNotifications);

    return (
      <div className="p-6 bg-[#f4f1ea]">
        <NotificationCenter.Root
          notifications={notifications}
          onDismiss={(id) =>
            setNotifications((prev) => prev.filter((n) => n.id !== id))
          }
          onMarkAllRead={() =>
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, read: true }))
            )
          }
          maxItems={4}
          onViewAll={() => console.log('View all')}
        />
      </div>
    );
  },
};

export const FixedPosition: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(sampleNotifications.slice(0, 4));

    return (
      <div className="p-6 bg-[#f4f1ea] min-h-[500px]">
        <p className="font-architect text-sm text-ink-muted mb-4">
          The panel is positioned fixed (top-right). Scroll to see it stays in place.
        </p>
        <NotificationCenter.Root
          position="fixed"
          notifications={notifications}
          onDismiss={(id) =>
            setNotifications((prev) => prev.filter((n) => n.id !== id))
          }
          onMarkAllRead={() =>
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, read: true }))
            )
          }
          maxItems={3}
        />
        {/* Spacer for scroll */}
        <div className="h-[800px]" />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="p-6 bg-[#f4f1ea]">
      <NotificationCenter.Root notifications={[]} />
    </div>
  ),
};

export const ManyNotifications: Story = {
  render: () => {
    const many: NotificationItemData[] = Array.from({ length: 8 }, (_, i) => ({
      id: String(i + 1),
      variant: (['info', 'success', 'warning', 'error'] as const)[i % 4],
      title: `Notification #${i + 1}`,
      description: `This is notification number ${i + 1} with some longer descriptive text.`,
      timestamp: `${i * 5} min ago`,
      read: i > 3,
    }));

    return (
      <div className="p-6 bg-[#f4f1ea]">
        <NotificationCenter.Root
          notifications={many}
          onDismiss={(id) => console.log('Dismiss', id)}
          maxItems={6}
          onMarkAllRead={() => console.log('Mark all read')}
          onViewAll={() => console.log('View all')}
        />
      </div>
    );
  },
};

export const WithoutMarkAllRead: Story = {
  render: () => (
    <div className="p-6 bg-[#f4f1ea]">
      <NotificationCenter.Root
        notifications={sampleNotifications.slice(0, 3)}
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const AllRead: Story = {
  render: () => {
    const allRead = sampleNotifications.map((n) => ({ ...n, read: true }));

    return (
      <div className="p-6 bg-[#f4f1ea]">
        <NotificationCenter.Root
          notifications={allRead}
          onDismiss={() => {}}
          onMarkAllRead={() => {}}
        />
      </div>
    );
  },
};
