import React, { type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SketchBorder } from '@paper-ui/core'

const meta: Meta<typeof SketchBorder> = {
  title: 'Components/Wrappers/SketchBorder',
  component: SketchBorder,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof SketchBorder>

function Wrapper({ children, ...args }: ComponentProps<typeof SketchBorder> & { children?: React.ReactNode }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: 240, height: 80 }}>
      <SketchBorder {...args} />
      <span className="relative z-10 text-sm font-architect text-ink">{children ?? 'Sketch border'}</span>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Wrapper roughness={1.1} strokeWidth={1.5} />
    </div>
  ),
}

export const Fills: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <Wrapper fill="#fffdf9" roughness={1.1} strokeWidth={1.5}>Filled</Wrapper>
      <Wrapper fill="#fffdf9" shadow={3} roughness={1.1} strokeWidth={1.5}>With shadow</Wrapper>
      <Wrapper fill="#d4e6d4" fillStyle="hachure" fillWeight={1.5} hachureGap={5} roughness={1}>Hachure</Wrapper>
    </div>
  ),
}

export const CircleVariant: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-4 items-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: 64, height: 64 }}>
        <SketchBorder fill="#e7efe4" stroke="#5a825a" strokeWidth={1.5} roughness={0.9} radius={32} />
        <span className="relative z-10 text-2xl">A</span>
      </div>
      <div className="relative inline-flex items-center justify-center" style={{ width: 48, height: 48 }}>
        <SketchBorder fill="#faf3e3" stroke="#b0882a" strokeWidth={1.3} roughness={1.0} radius={24} />
        <span className="relative z-10 text-lg">B</span>
      </div>
      <div className="relative inline-flex items-center justify-center" style={{ width: 36, height: 36 }}>
        <SketchBorder fill="#fae8e8" stroke="#9a4a4a" strokeWidth={1.2} roughness={1.1} radius={18} shadow={1} />
        <span className="relative z-10 text-sm">C</span>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <div className="relative inline-flex items-center justify-center" style={{ width: 300, height: 100 }}>
        <SketchBorder fill="#fffdf9" shadow={3} roughness={1.2} strokeWidth={1.5} />
        <div className="relative z-10 p-5 text-center">
          <p className="font-architect text-sm text-ink font-bold">Custom Surface</p>
          <p className="font-kalam text-xs text-ink-muted mt-1">Content layered above the SVG</p>
        </div>
      </div>
    </div>
  ),
}
