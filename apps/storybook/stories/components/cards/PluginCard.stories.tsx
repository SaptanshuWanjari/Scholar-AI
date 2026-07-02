import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PluginCard } from '@paper-ui/components/cards'
import { Brain, FileText, Puzzle } from 'lucide-react'

const meta: Meta<typeof PluginCard> = {
  title: 'Components/Cards/PluginCard',
  component: PluginCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PluginCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <PluginCard
        name="Anki Sync"
        description="Export flashcards to your Anki deck."
        version="1.2.0"
        author="community"
        icon={<Puzzle size={20} />}
        tone="sage"
        className="w-72"
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <PluginCard
        name="AI Tutor"
        description="Get explanations for any concept instantly."
        version="0.9.1"
        icon={<Brain size={20} />}
        tone="lavender"
        enabled
        onToggle={() => alert('Toggled')}
        className="w-72"
      />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <PluginCard
        name="Anki Sync"
        description="Export flashcards to Anki."
        version="1.2.0"
        author="community"
        icon={<Puzzle size={20} />}
        tone="sage"
        enabled
        onToggle={() => {}}
        className="w-72"
      />
      <PluginCard
        name="AI Tutor"
        description="Get instant explanations."
        version="0.9.1"
        badge="Beta"
        icon={<Brain size={20} />}
        tone="lavender"
        onToggle={() => {}}
        className="w-72"
      />
      <PluginCard
        name="PDF Annotations"
        description="Rich annotations with sync."
        icon={<FileText size={20} />}
        tone="brick"
        comingSoon
        className="w-72"
      />
    </div>
  ),
}
