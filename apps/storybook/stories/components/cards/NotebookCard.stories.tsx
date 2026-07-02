import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotebookCard } from '@paper-ui/components/cards'

const meta: Meta<typeof NotebookCard> = {
  title: 'Components/Cards/NotebookCard',
  component: NotebookCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NotebookCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <NotebookCard
        title="Chapter 3 Notes"
        course="Operating Systems"
        blockCount={8}
        lastEdited="2h ago"
        className="w-72"
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <NotebookCard
        title="Study Notes"
        course="Linear Algebra"
        blockCount={12}
        lastEdited="Today"
        preview="Vector spaces, eigenvalues, matrix decomposition..."
        tags={['Math', 'Theory']}
        onClick={() => alert('Notebook opened')}
        className="w-72"
      />
    </div>
  ),
}

export const WithPreview: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <NotebookCard
        title="Machine Learning Journal"
        course="AI & Data Science"
        blockCount={24}
        lastEdited="1h ago"
        preview="Explored gradient descent optimization, backpropagation techniques, and neural network architectures..."
        tags={['ML', 'Research']}
        className="w-72"
      />
      <NotebookCard
        title="Quick Thoughts"
        blockCount={3}
        lastEdited="Yesterday"
        tags={['Misc']}
        className="w-72"
      />
    </div>
  ),
}
