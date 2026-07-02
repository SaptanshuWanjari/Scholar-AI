import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Announcement } from '@paper-ui/components/notifications';

const meta: Meta<typeof Announcement> = {
  title: 'Components/Notifications/Announcement',
  component: Announcement as any,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Announcement>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-full max-w-2xl">
      <Announcement variant="info" message="New study materials added to Operating Systems course." />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3 w-full max-w-2xl">
      <Announcement variant="info" message="Info: New materials available." />
      <Announcement variant="success" message="Success: Sync completed across all devices." />
      <Announcement variant="warning" message="Warning: Maintenance in 2 hours." />
      <Announcement variant="announcement" message="Announcement: ScholarCLI v2.0 released!" />
    </div>
  ),
};

export const Composed: Story = {
  render: () => {
    const [dismissed, setDismissed] = useState(false);
    return dismissed ? (
      <button onClick={() => setDismissed(false)} className="font-architect text-sm underline text-ink-muted">
        Show again
      </button>
    ) : (
      <div className="p-8 bg-[#f4f1ea] w-full max-w-2xl">
        <Announcement message="">
          <Announcement.Icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Announcement.Icon>
          <Announcement.Message>AI-powered concept graphs are now available.</Announcement.Message>
          <Announcement.Action label="Try it" onClick={() => console.log('Try')} />
          <Announcement.Dismiss onDismiss={() => setDismissed(true)} />
        </Announcement>
      </div>
    );
  },
};
