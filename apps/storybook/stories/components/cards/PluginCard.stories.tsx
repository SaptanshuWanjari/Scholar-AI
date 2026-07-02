import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PluginCard } from '@paper-ui/components/cards'
import { Brain, FileText, Puzzle } from 'lucide-react'

const meta: Meta<typeof PluginCard> = {
  title: 'Components/Cards/PluginCard',
  component: PluginCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PluginCard>

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <PluginCard
          name="Anki Sync"
          description="Export your flashcards directly to your Anki deck via the AnkiConnect API."
          version="1.2.0"
          author="community"
          icon={<Puzzle size={20} />}
          tone="sage"
          enabled={true}
          onToggle={() => {}}
          className="w-72"
        />
        <PluginCard
          name="AI Tutor"
          description="Get on-demand explanations for any concept using GPT-4."
          version="0.9.1"
          icon={<Brain size={20} />}
          tone="lavender"
          enabled={false}
          badge="Beta"
          onToggle={() => {}}
          className="w-72"
        />
        <PluginCard
          name="PDF Viewer"
          description="Rich inline PDF annotations with highlight sync."
          icon={<FileText size={20} />}
          tone="brick"
          comingSoon
          className="w-72"
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <PluginCard
          name="AI Tutor"
          description="Get on-demand explanations for any concept using GPT-4."
          version="0.9.1"
          icon={<Brain size={20} />}
          tone="lavender"
          enabled={false}
          badge="Beta"
          onToggle={() => {}}
          className="w-72"
        />
      </div>
    </div>
  ),
}
