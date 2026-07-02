import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SummaryCard } from '@paper-ui/components/cards'

const meta: Meta<typeof SummaryCard> = {
  title: 'Components/Cards/SummaryCard',
  component: SummaryCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SummaryCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <SummaryCard
        title="Attention Mechanism"
        summary="A neural network technique that allows models to focus on specific parts of input when generating output."
        source="Transformer Papers"
        sourceType="document"
        className="max-w-sm"
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <SummaryCard
        title="Backpropagation"
        summary="Algorithm for computing gradients efficiently using the chain rule. Fundamental to training neural networks."
        source="LeCun et al., 1998"
        sourceType="document"
        tags={['ML', 'Algorithms']}
        onExpand={() => alert('Expanding...')}
        className="max-w-sm"
      />
    </div>
  ),
}

export const AllSourceTypes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <SummaryCard
        title="Attention Mechanism"
        summary="Allows models to focus on different parts of input sequence."
        source="Vaswani et al., 2017"
        sourceType="document"
        tags={['Transformers', 'NLP']}
        highlightTitle
        onExpand={() => {}}
        className="max-w-sm"
      />
      <SummaryCard
        title="Gradient Descent"
        summary="Optimization algorithm that moves parameters in direction opposite to loss gradient."
        sourceType="web"
        tags={['Optimization', 'ML']}
        className="max-w-sm"
      />
      <SummaryCard
        title="Neural Network Basics"
        summary="Artificial neural networks inspired by biological neurons."
        source="Class Notes"
        sourceType="notebook"
        tags={['Deep Learning']}
        className="max-w-sm"
      />
    </div>
  ),
}
