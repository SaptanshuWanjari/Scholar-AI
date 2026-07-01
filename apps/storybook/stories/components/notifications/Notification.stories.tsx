import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notification } from '@paper-ui/components/notifications';
import { SparkleDoodle } from '@paper-ui/components/doodles';

const meta: Meta<typeof Notification.Root> = {
  title: 'Components/Notifications/Notification',
  component: Notification.Root as any,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Notification.Root>;

const Template = (args: any) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="font-architect text-sm underline text-ink-muted"
      >
        Show notification again
      </button>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      <Notification.Root {...args}>
        <Notification.Dismiss onDismiss={() => setDismissed(true)} />
        <div className="flex items-start gap-3">
          <Notification.Icon {...args} />
          <div className="flex-1">
            <Notification.Title {...args} />
            {args.description && <Notification.Description {...args} />}
            {args.timestamp && <Notification.Timestamp {...args} />}
            {args.actionLabel && (
              <Notification.Action
                label={args.actionLabel}
                onClick={args.onAction}
              />
            )}
          </div>
        </div>
      </Notification.Root>
    </div>
  );
};

export const Info: Story = {
  render: () => (
    <Template variant="info" title="New course material added" description="Operating Systems — Chapter 7 slides" timestamp="2 min ago" actionLabel="View" />
  ),
};

export const Success: Story = {
  render: () => (
    <Template variant="success" title="Flashcards generated" description="42 cards created for Data Structures" timestamp="10 min ago" />
  ),
};

export const Warning: Story = {
  render: () => (
    <Template variant="warning" title="Storage running low" description="You have 200MB remaining. Consider archiving old materials." timestamp="1 hour ago" actionLabel="Manage storage" />
  ),
};

export const Error: Story = {
  render: () => (
    <Template variant="error" title="Failed to sync notes" description="Could not connect to backup server. Last sync was 3 hours ago." timestamp="Just now" actionLabel="Retry" />
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3 max-w-sm mx-auto bg-[#f4f1ea] p-6 rounded-lg">
      <h2 className="font-architect text-lg text-ink mb-4">All Notification Variants</h2>
      {(['info', 'success', 'warning', 'error'] as const).map(v => (
        <Notification.Root key={v} variant={v}>
          <div className="flex items-start gap-3">
            <Notification.Icon variant={v} />
            <div className="flex-1">
              <Notification.Title>
                {v.charAt(0).toUpperCase() + v.slice(1)} notification
              </Notification.Title>
              <Notification.Description>
                This is a {v} notification with some descriptive text.
              </Notification.Description>
            </div>
          </div>
        </Notification.Root>
      ))}
    </div>
  ),
};

export const WithCustomIcon: Story = {
  render: () => (
    <div className="max-w-sm mx-auto">
      <Notification.Root variant="info">
        <div className="flex items-start gap-3">
          <Notification.Icon
            variant="info"
            icon={<SparkleDoodle size={18} color="#4f4d7a" />}
          />
          <div className="flex-1">
            <Notification.Title>Custom doodle icon!</Notification.Title>
            <Notification.Description>
              You can swap the default icon with any doodle or React node.
            </Notification.Description>
            <Notification.Timestamp>5 min ago</Notification.Timestamp>
          </div>
        </div>
      </Notification.Root>
    </div>
  ),
};

export const ReadVsUnread: Story = {
  render: () => (
    <div className="space-y-3 max-w-sm mx-auto bg-[#f4f1ea] p-6 rounded-lg">
      <h2 className="font-architect text-lg text-ink mb-4">Read State</h2>
      <Notification.Root variant="success" read={false}>
        <div className="flex items-start gap-3">
          <Notification.Icon variant="success" />
          <div className="flex-1">
            <Notification.Title>Unread notification (full opacity)</Notification.Title>
            <Notification.Description>This one is not read yet</Notification.Description>
            <Notification.Timestamp>1 min ago</Notification.Timestamp>
          </div>
        </div>
      </Notification.Root>
      <Notification.Root variant="info" read={true}>
        <div className="flex items-start gap-3">
          <Notification.Icon variant="info" />
          <div className="flex-1">
            <Notification.Title>Read notification (70% opacity)</Notification.Title>
            <Notification.Description>This one has been read</Notification.Description>
            <Notification.Timestamp>Yesterday</Notification.Timestamp>
          </div>
        </div>
      </Notification.Root>
    </div>
  ),
};
