import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notification } from '@paper-ui/components/notifications';

const meta: Meta<typeof Notification> = {
  title: 'Components/Notifications/Notification',
  component: Notification as any,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-80">
      <Notification variant="info">
        <div className="flex items-start gap-3">
          <Notification.Icon />
          <div className="flex-1">
            <Notification.Title>Quiz Ready</Notification.Title>
            <Notification.Description>Your Operating Systems quiz is ready to review.</Notification.Description>
            <Notification.Timestamp>2 min ago</Notification.Timestamp>
          </div>
        </div>
      </Notification>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => {
    const [dismissed, setDismissed] = useState(false);
    return dismissed ? (
      <button onClick={() => setDismissed(false)} className="font-architect text-sm underline text-ink-muted">
        Show again
      </button>
    ) : (
      <div className="p-8 bg-[#f4f1ea] w-80">
        <Notification variant="success">
          <Notification.Dismiss onDismiss={() => setDismissed(true)} />
          <div className="flex items-start gap-3">
            <Notification.Icon />
            <div className="flex-1">
              <Notification.Title>Flashcards Generated</Notification.Title>
              <Notification.Description>42 cards created for Data Structures.</Notification.Description>
              <Notification.Action label="View" onClick={() => console.log('View')} />
            </div>
          </div>
        </Notification>
      </div>
    );
  },
};

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3 w-80">
      <Notification variant="info">
        <div className="flex items-start gap-3">
          <Notification.Icon />
          <div className="flex-1">
            <Notification.Title>Info</Notification.Title>
            <Notification.Description>New material added.</Notification.Description>
          </div>
        </div>
      </Notification>
      <Notification variant="success">
        <div className="flex items-start gap-3">
          <Notification.Icon />
          <div className="flex-1">
            <Notification.Title>Success</Notification.Title>
            <Notification.Description>Operation completed.</Notification.Description>
            <Notification.Timestamp>Just now</Notification.Timestamp>
          </div>
        </div>
      </Notification>
      <Notification variant="warning">
        <Notification.Dismiss />
        <div className="flex items-start gap-3">
          <Notification.Icon />
          <div className="flex-1">
            <Notification.Title>Warning</Notification.Title>
            <Notification.Description>Storage at 80%.</Notification.Description>
          </div>
        </div>
      </Notification>
      <Notification variant="error">
        <div className="flex items-start gap-3">
          <Notification.Icon />
          <div className="flex-1">
            <Notification.Title>Error</Notification.Title>
            <Notification.Description>Failed to sync.</Notification.Description>
            <Notification.Action label="Retry" onClick={() => console.log('Retry')} />
          </div>
        </div>
      </Notification>
    </div>
  ),
};
