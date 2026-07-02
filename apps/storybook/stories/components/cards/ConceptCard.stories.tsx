import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConceptCard } from '@paper-ui/components/cards'

const meta: Meta<typeof ConceptCard> = {
  title: 'Components/Cards/ConceptCard',
  component: ConceptCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ConceptCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ConceptCard
        front="What is gradient descent?"
        back="An optimization algorithm that iteratively moves toward the minimum loss."
        type="BASIC"
        status="new"
        course="Machine Learning"
        className="w-72"
      />
    </div>
  ),
}

export const Flipped: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ConceptCard
        front="Backpropagation"
        back="Algorithm for computing gradients via the chain rule in neural networks."
        type="HARD"
        status="due"
        course="Deep Learning"
        flipped
        className="w-72"
      />
    </div>
  ),
}

export const AllStatuses: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <ConceptCard
        front="What is a tensor?"
        back="A multi-dimensional array of numbers."
        type="BASIC"
        status="new"
        course="Linear Algebra"
        className="w-72"
      />
      <ConceptCard
        front="Eigenvalue decomposition"
        back="Breaking a matrix into eigenvectors and eigenvalues."
        type="MEDIUM"
        status="learning"
        course="Linear Algebra"
        className="w-72"
      />
      <ConceptCard
        front="Chain rule in calculus"
        back="d(f∘g)/dx = (df/dg) × (dg/dx)"
        type="HARD"
        status="due"
        course="Calculus"
        className="w-72"
      />
      <ConceptCard
        front="Optimization convergence"
        back="When gradients approach zero and loss stabilizes."
        type="HARD"
        status="mastered"
        course="Machine Learning"
        className="w-72"
      />
    </div>
  ),
}
