import React, { type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSheetBorder } from '@paper-ui/core'

const meta: Meta<typeof PaperSheetBorder> = {
  title: 'Components/Wrappers/PaperSheetBorder',
  component: PaperSheetBorder,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PaperSheetBorder>

function Sheet(props: ComponentProps<typeof PaperSheetBorder> & { label?: string }) {
  const { label, ...rest } = props
  return (
    <div className="relative" style={{ width: 260, height: 120 }}>
      <PaperSheetBorder {...rest} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <span className="font-architect text-sm text-ink">{label ?? 'Paper sheet'}</span>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Sheet />
    </div>
  ),
}

export const WithFold: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Sheet fold label="With fold" />
    </div>
  ),
}

export const Fills: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <Sheet fill="#fffdf9" label="Paper white" />
      <Sheet fill="#fdf3b8" label="Sticky yellow" />
      <Sheet fill="#e8f0fe" label="Graph blue" />
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <div className="relative" style={{ width: 300, height: 100 }}>
        <PaperSheetBorder fill="#fffdf9" shadow={3} fold />
        <div className="relative z-10 p-5">
          <p className="font-architect text-sm text-ink font-bold">Recipe Card</p>
          <p className="font-kalam text-xs text-ink-muted mt-1">Ingredients: eggs, flour, butter, vanilla</p>
        </div>
      </div>
    </div>
  ),
}
