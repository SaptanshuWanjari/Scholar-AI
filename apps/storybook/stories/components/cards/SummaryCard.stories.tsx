import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SummaryCard } from '@paper-ui/components/cards'

const meta: Meta<typeof SummaryCard> = {
  title: 'Components/Cards/SummaryCard',
  component: SummaryCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SummaryCard>

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <SummaryCard
          title="Attention Mechanism"
          summary="The attention mechanism allows a model to focus on different parts of the input sequence when producing each output token. It computes a weighted sum of value vectors, where weights are determined by the similarity between a query and a set of keys."
          source="Vaswani et al., 2017"
          sourceType="document"
          tags={['Transformers', 'NLP', 'Deep Learning']}
          tone="sky"
          highlightTitle
          onExpand={() => {}}
          className="max-w-xs"
        />
        <SummaryCard
          title="Gradient Descent Overview"
          summary="An optimization algorithm that iteratively adjusts parameters by moving in the direction opposite to the gradient of the loss function."
          sourceType="web"
          tags={['Optimization', 'ML']}
          tone="sage"
          className="max-w-xs"
        />
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-5">
        <SummaryCard
          title="Attention Mechanism"
          summary="The attention mechanism allows a model to focus on different parts of the input sequence when producing each output token."
          source="Vaswani et al., 2017"
          sourceType="document"
          tags={['Transformers', 'NLP', 'Deep Learning']}
          tone="sky"
          highlightTitle
          onExpand={() => {}}
          className="max-w-xs"
        />
        <SummaryCard
          title="Gradient Descent Overview"
          summary="An optimization algorithm that iteratively adjusts parameters by moving in the direction opposite to the gradient of the loss function."
          sourceType="web"
          tags={['Optimization', 'ML']}
          tone="sage"
          className="max-w-xs"
        />
      </div>
    </div>
  ),
}
