import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CourseCard } from '@paper-ui/components/cards'
import { Brain, Zap } from 'lucide-react'

const meta: Meta<typeof CourseCard> = {
  title: 'Components/Cards/CourseCard',
  component: CourseCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof CourseCard>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <CourseCard
        title="Machine Learning"
        subject="AI & Data Science"
        icon={<Brain size={20} strokeWidth={1.6} />}
        tone="lavender"
        progress={68}
        documentCount={24}
        lastStudied="2h ago"
        tags={['Neural Networks', 'Optimization', 'Backprop']}
        onContinue={() => {}}
        onClick={() => {}}
        className="w-64"
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <CourseCard
          title="Machine Learning"
          subject="AI & Data Science"
          icon={<Brain size={20} strokeWidth={1.6} />}
          tone="lavender"
          progress={68}
          documentCount={24}
          lastStudied="2h ago"
          tags={['Neural Networks', 'Optimization', 'Backprop']}
          onContinue={() => {}}
          onClick={() => {}}
          className="w-64"
        />
        <CourseCard
          title="Linear Algebra"
          subject="Mathematics"
          tone="sky"
          progress={100}
          documentCount={12}
          lastStudied="Yesterday"
          tags={['Vectors', 'Matrices', 'Eigenvectors']}
          className="w-64"
        />
        <CourseCard
          title="Data Structures"
          subject="Computer Science"
          icon={<Zap size={20} strokeWidth={1.6} />}
          tone="ochre"
          progress={20}
          documentCount={8}
          tags={['Trees', 'Graphs', 'Heaps']}
          onContinue={() => {}}
          className="w-64"
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <CourseCard
        title="Machine Learning"
        subject="AI & Data Science"
        icon={<Brain size={20} strokeWidth={1.6} />}
        tone="lavender"
        progress={68}
        documentCount={24}
        lastStudied="2h ago"
        tags={['Neural Networks', 'Optimization', 'Backprop']}
        onContinue={() => {}}
        onClick={() => {}}
        className="w-64"
      />
    </div>
  ),
}
