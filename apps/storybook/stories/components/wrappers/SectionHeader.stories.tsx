import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionHeader, SectionLabel, PaperCard } from '@paper-ui/core'
import { SketchButton } from '../../../../paper-ui/src/components/buttons'
import { Search } from 'lucide-react'

const meta: Meta<typeof SectionHeader> = {
  title: 'Components/Wrappers/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof SectionHeader>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-80">
      <SectionHeader title="Recent Notes" />
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-80">
      <SectionHeader
        title="Recent Notes"
        action={
          <button className="font-architect text-xs text-ink-muted uppercase tracking-widest hover:text-ink">
            View all →
          </button>
        }
      />
    </div>
  ),
}

export const WithMarker: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-80">
      <SectionHeader
        title="Highlighted Section"
        marker
        markerColor="#f6e27a"
        action={<span className="font-architect text-xs text-ink-muted">3 items</span>}
      />
    </div>
  ),
}

export const LabelVariant: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <SectionLabel>Course / Machine Learning / Module 3</SectionLabel>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="space-y-3 max-w-md">
        <SectionLabel>Course / Machine Learning / Module 3</SectionLabel>
        <SectionHeader title="Backpropagation" marker markerColor="#b5f0b5" />
        <PaperCard className="p-4" shadow="sm">
          <SectionHeader
            title="Documents"
            marker
            markerColor="#f6e27a"
            action={<SketchButton size="sm"><Search size={12} />Search</SketchButton>}
          />
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-dashed border-[#d4cfc4]">
              <span className="font-kalam text-sm text-ink">Lecture 7 Notes.pdf</span>
              <span className="font-architect text-xs text-ink-muted">2 days ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-kalam text-sm text-ink">Problem Set 3.md</span>
              <span className="font-architect text-xs text-ink-muted">5 days ago</span>
            </div>
          </div>
        </PaperCard>
      </div>
    </div>
  ),
}
