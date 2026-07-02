import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperStamp } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof PaperStamp> = {
  title: 'Components/Decorations/PaperStamp',
  component: PaperStamp,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PaperStamp>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-72 p-8">
        <PaperStamp
          label="APPROVED"
          tone="brick"
          rotate={-15}
          position="top-right"
          size="md"
        />
        <h3 className="font-serif text-xl font-bold mb-4">Official</h3>
        <p className="font-mono text-sm text-gray-700 mt-8">
          Stamps can be used for status badges or emphatic feedback.
        </p>
      </Paper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-48 p-4">
        <PaperStamp label="DONE" position="top-right" />
        <p className="font-mono text-xs pt-8">Default stamp, brick tone.</p>
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8 justify-center flex-wrap">
      <Paper className="w-48 p-4">
        <PaperStamp label="PAID" tone="sage" position="top-right" rotate={-10} size="sm" />
        <p className="font-mono text-xs pt-6">sage, small, top-right</p>
      </Paper>
      <Paper className="w-48 p-4">
        <PaperStamp label="DRAFT" tone="ochre" position="top-left" rotate={12} size="md" />
        <p className="font-mono text-xs pt-8">ochre, top-left, 12°</p>
      </Paper>
      <Paper className="w-48 p-4">
        <PaperStamp label="REVIEW" tone="sky" position="center" size="lg" />
        <p className="font-mono text-xs pt-12">sky, center, large</p>
      </Paper>
      <Paper className="w-48 p-4">
        <PaperStamp label="VOID" tone="ink" position="center" rotate={-25} />
        <p className="font-mono text-xs pt-8">ink, center, -25°</p>
      </Paper>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Paper className="w-96 p-8">
        <PaperStamp label="CONFIDENTIAL" tone="brick" rotate={-12} position="top-right" size="lg" />
        <h2 className="font-serif text-2xl font-bold mb-4">Quarterly Report</h2>
        <p className="font-mono text-sm text-gray-700 mb-3">
          Revenue up 18% quarter-over-quarter. New customer acquisition exceeded targets.
        </p>
        <p className="font-mono text-sm text-gray-700 mb-3">
          Operating margins improved to 24%. Strong performance in EMEA and APAC regions.
        </p>
        <div className="mt-6 border-t border-gray-200 pt-3 font-mono text-xs text-gray-400">
          Internal document — do not distribute
        </div>
      </Paper>
    </div>
  ),
}
