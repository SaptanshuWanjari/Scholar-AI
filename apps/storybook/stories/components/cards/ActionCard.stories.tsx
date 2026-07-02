import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionCard } from '@paper-ui/components/cards'
import { FileText, Zap, Globe } from 'lucide-react'

const meta: Meta<typeof ActionCard> = {
  title: 'Components/Cards/ActionCard',
  component: ActionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ActionCard>

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <ActionCard
          title="Upload a Document"
          description="Add a PDF, Markdown, or text file to start studying."
          icon={<FileText size={24} />}
          tone="sky"
          onAction={() => {}}
          actionLabel="Upload Now"
          className="w-56"
        />
        <ActionCard
          title="Start a Quiz"
          description="Test your knowledge with AI-generated questions."
          icon={<Zap size={24} />}
          tone="ochre"
          onAction={() => {}}
          actionLabel="Start Quiz"
          className="w-56"
        />
        <ActionCard
          title="Explore Web Sources"
          description="Let the AI find and summarize relevant articles."
          icon={<Globe size={24} />}
          tone="lavender"
          onAction={() => {}}
          actionLabel="Explore"
          className="w-56"
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <ActionCard
          title="Upload a Document"
          description="Add a PDF, Markdown, or text file to start studying."
          icon={<FileText size={24} />}
          tone="sky"
          onAction={() => {}}
          actionLabel="Upload Now"
          className="w-56"
        />
        <ActionCard
          title="Start a Quiz"
          description="Test your knowledge with AI-generated questions."
          icon={<Zap size={24} />}
          tone="ochre"
          onAction={() => {}}
          actionLabel="Start Quiz"
          className="w-56"
        />
        <ActionCard
          title="Explore Web Sources"
          description="Let the AI find and summarize relevant articles."
          icon={<Globe size={24} />}
          tone="lavender"
          onAction={() => {}}
          actionLabel="Explore"
          className="w-56"
        />
      </div>
    </div>
  ),
}
