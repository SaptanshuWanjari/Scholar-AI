import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotebookCard } from '@paper-ui/components/cards'

const meta: Meta<typeof NotebookCard> = {
  title: 'Components/Cards/NotebookCard',
  component: NotebookCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof NotebookCard>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <NotebookCard title="My Study Notes" description="Personal notebook for organizing study materials">
        <p className="text-sm text-ink-muted">5 pages · Last edited 2h ago</p>
      </NotebookCard>
    </div>
  ),
}
