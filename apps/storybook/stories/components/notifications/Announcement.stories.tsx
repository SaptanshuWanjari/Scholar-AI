import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Announcement } from '@paper-ui/components/notifications';
import { SparkleDoodle } from '@paper-ui/components/doodles';

const meta: Meta<typeof Announcement.Root> = {
  title: 'Components/Notifications/Announcement',
  component: Announcement.Root as any,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Announcement.Root>;

export const Info: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-[#f4f1ea] p-6">
      <Announcement.Root
        variant="info"
        message="New study materials have been added to the Operating Systems course."
        actionLabel="View materials"
        onAction={() => console.log('View materials')}
      />
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-[#f4f1ea] p-6">
      <Announcement.Root
        variant="success"
        message="Your flashcards have been successfully synced across all devices."
        dismissible={false}
      />
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-[#f4f1ea] p-6">
      <Announcement.Root
        variant="warning"
        message="Scheduled maintenance in 2 hours. Some features may be unavailable."
        actionLabel="Learn more"
        onAction={() => console.log('Learn more')}
      />
    </div>
  ),
};

export const AnnouncementVariant: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-[#f4f1ea] p-6">
      <Announcement.Root
        variant="announcement"
        message="ScholarCLI v2.0 is here! New features: concept graphs, exam mode, and more."
        actionLabel="See what's new"
        onAction={() => console.log('See new')}
      />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl mx-auto bg-[#f4f1ea] p-6 rounded-lg">
      <h2 className="font-architect text-lg text-ink mb-4">All Announcement Variants</h2>
      {(['info', 'success', 'warning', 'announcement'] as const).map(v => (
        <Announcement.Root
          key={v}
          variant={v}
          message={`${v.charAt(0).toUpperCase() + v.slice(1)}: This is a ${v} style announcement with a message.`}
        />
      ))}
    </div>
  ),
};

export const NonDismissible: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-[#f4f1ea] p-6">
      <Announcement.Root
        variant="announcement"
        message="This announcement cannot be dismissed. It will persist until the condition changes."
        dismissible={false}
      />
    </div>
  ),
};

export const WithCustomChildren: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-[#f4f1ea] p-6">
      <Announcement.Root variant="info" message="Compound usage example with sub-components:" dismissible={false}>
        <div className="relative z-[1] px-4 pb-3 flex items-center gap-2">
          <SparkleDoodle size={16} color="#4f4d7a" />
          <span className="font-kalam text-[12px] text-ink-muted">
            You can pass custom children for extra content below the message.
          </span>
        </div>
      </Announcement.Root>
    </div>
  ),
};

export const SimulatedDismiss: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-[#f4f1ea] p-6 space-y-4">
      <Announcement.Root
        variant="warning"
        message="Click the X to dismiss this banner. It slides out with an animation."
        onDismiss={() => console.log('Dismissed')}
      />
      <Announcement.Root
        variant="success"
        message="This one also dismisses. Try clicking the close button!"
      />
      <p className="font-kalam text-[13px] text-ink-muted">
        Dismissed banners are removed from the DOM entirely.
      </p>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => {
    const [ctaVisible, setCtaVisible] = useState(true);

    if (!ctaVisible) {
      return (
        <div className="max-w-2xl mx-auto bg-[#f4f1ea] p-6">
          <button
            onClick={() => setCtaVisible(true)}
            className="font-architect text-sm underline text-ink-muted"
          >
            Show announcement again
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto bg-[#f4f1ea] p-6 space-y-4">
        <Announcement.Root
          variant="announcement"
          message="New feature: AI-powered concept graphs are now available for all courses."
          actionLabel="Try it now"
          onDismiss={() => setCtaVisible(false)}
        />
      </div>
    );
  },
};
