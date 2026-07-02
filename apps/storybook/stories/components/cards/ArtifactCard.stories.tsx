import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArtifactCard } from '@paper-ui/components/cards'

const meta: Meta<typeof ArtifactCard> = {
  title: 'Components/Cards/ArtifactCard',
  component: ArtifactCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ArtifactCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ArtifactCard
        title="Chapter 3 Quiz"
        type="quiz"
        course="Operating Systems"
        count={15}
        className="w-64"
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ArtifactCard
        title="Key Concepts Flashcards"
        type="flashcard"
        course="Linear Algebra"
        count={32}
        createdAt="Today"
        onOpen={() => alert('Opened flashcards')}
        className="w-64"
      />
    </div>
  ),
}

export const AllTypes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ArtifactCard
        title="Midterm Review Quiz"
        type="quiz"
        course="Physics"
        count={15}
        className="w-64"
      />
      <ArtifactCard
        title="Flashcard Set"
        type="flashcard"
        course="Linear Algebra"
        count={32}
        className="w-64"
      />
      <ArtifactCard
        title="Study Notes"
        type="notes"
        course="Data Structures"
        count={8}
        countUnit="pages"
        className="w-64"
      />
      <ArtifactCard
        title="Chapter Summary"
        type="summary"
        course="Operating Systems"
        count={320}
        countUnit="words"
        className="w-64"
      />
      <ArtifactCard
        title="Topic Mind Map"
        type="mindmap"
        course="Algorithms"
        className="w-64"
      />
    </div>
  ),
}
