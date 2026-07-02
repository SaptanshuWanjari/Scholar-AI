import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArtifactCard } from '@paper-ui/components/cards'

const meta: Meta<typeof ArtifactCard> = {
  title: 'Components/Cards/ArtifactCard',
  component: ArtifactCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ArtifactCard>

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <ArtifactCard
          title="Backpropagation Summary"
          type="summary"
          course="Machine Learning"
          count={320}
          countUnit="words"
          createdAt="Jun 30"
          onOpen={() => {}}
          className="w-64"
        />
        <ArtifactCard
          title="Eigenvectors Flashcards"
          type="flashcard"
          course="Linear Algebra"
          count={32}
          countUnit="cards"
          createdAt="Jun 28"
          onOpen={() => {}}
          className="w-64"
        />
        <ArtifactCard
          title="ML Fundamentals Quiz"
          type="quiz"
          course="Machine Learning"
          count={15}
          countUnit="questions"
          createdAt="Jun 25"
          className="w-64"
        />
        <ArtifactCard
          title="Lecture Notes"
          type="notes"
          course="Data Structures"
          createdAt="Jun 20"
          onOpen={() => {}}
          className="w-64"
        />
      </div>
    </div>
  ),
}
