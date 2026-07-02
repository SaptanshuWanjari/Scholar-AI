import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionCard } from '@paper-ui/components/cards'
import { FileText, Zap, Globe } from 'lucide-react'

const meta: Meta<typeof ActionCard> = {
  title: 'Components/Cards/ActionCard',
  component: ActionCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ActionCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ActionCard
        title="Upload Document"
        description="Add study materials to your course."
        icon={<FileText size={20} />}
        tone="sky"
        className="w-56"
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ActionCard
        title="Upload Document"
        description="Add study materials to your course."
        icon={<FileText size={20} />}
        tone="sky"
        onClick={() => alert('Upload clicked')}
        className="w-56"
      />
    </div>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ActionCard
        title="Start Quiz"
        description="Test your knowledge with AI questions."
        icon={<Zap size={20} />}
        tone="ochre"
        badge="3 pending"
        badgeTone="brick"
        onClick={() => {}}
        className="w-56"
      />
      <ActionCard
        title="Explore Sources"
        description="Find articles and resources."
        icon={<Globe size={20} />}
        tone="lavender"
        badge="Premium"
        badgeTone="lavender"
        className="w-56"
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ActionCard
        title="Unlock with Premium"
        description="Upgrade to access advanced features."
        icon={<Zap size={20} />}
        tone="ochre"
        disabled
        className="w-56"
      />
    </div>
  ),
}
