import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MarkerHighlight } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof MarkerHighlight> = {
  title: 'Components/Decorations/MarkerHighlight',
  component: MarkerHighlight,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof MarkerHighlight>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-72 p-6">
        <p className="font-mono text-sm text-gray-700">
          Here is some text with a{' '}
          <MarkerHighlight color="#fde047" className="font-bold p-1">
            highlighted phrase
          </MarkerHighlight>{' '}
          that draws attention.
        </p>
      </Paper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-64 p-4">
        <p className="font-mono text-sm">
          <MarkerHighlight>Default yellow highlight</MarkerHighlight>
        </p>
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-80 p-6 space-y-4">
        <p className="font-mono text-sm">
          <MarkerHighlight color="#fde047">Yellow highlighter</MarkerHighlight>
        </p>
        <p className="font-mono text-sm">
          <MarkerHighlight color="#f9a8d4">Pink highlighter</MarkerHighlight>
        </p>
        <p className="font-mono text-sm">
          <MarkerHighlight color="#a7f3d0">Green highlighter</MarkerHighlight>
        </p>
        <p className="font-mono text-sm">
          <MarkerHighlight color="#bfdbfe">Blue highlighter</MarkerHighlight>
        </p>
        <p className="font-mono text-sm">
          <MarkerHighlight color="#fde047" thickness={14}>
            Thick highlight
          </MarkerHighlight>
        </p>
        <p className="font-mono text-sm">
          <MarkerHighlight color="#fde047" thickness={5}>
            Thin highlight
          </MarkerHighlight>
        </p>
      </Paper>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-96 p-8">
        <h2 className="font-serif text-2xl font-bold mb-4">
          <MarkerHighlight>Key Findings</MarkerHighlight>
        </h2>
        <p className="font-mono text-sm text-gray-700 mb-3">
          The study revealed that{' '}
          <MarkerHighlight color="#fde047">users prefer tactile feedback</MarkerHighlight> in
          digital interfaces. This aligns with prior research on{' '}
          <MarkerHighlight color="#a7f3d0">skeuomorphic design</MarkerHighlight> principles.
        </p>
        <p className="font-mono text-sm text-gray-700">
          Additionally, <MarkerHighlight color="#bfdbfe">paper-like textures</MarkerHighlight> were
          found to reduce cognitive load during reading tasks.
        </p>
      </Paper>
    </div>
  ),
}
