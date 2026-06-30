import React, { type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SketchBorder } from '@paper-ui/core'

const meta: Meta<typeof SketchBorder> = {
  title: 'Core/SketchBorder',
  component: SketchBorder,
  tags: ['autodocs'],
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
  args: { roughness: 1.1, strokeWidth: 1.5 },
  render: (args) => <Wrapper {...args} />,
}

export const WithFill: Story = {
  args: { roughness: 1.1, strokeWidth: 1.5, fill: '#fffdf9' },
  render: (args) => <Wrapper {...args}>Filled surface</Wrapper>,
}

export const Heavy: Story = {
  args: { roughness: 2.5, strokeWidth: 3, stroke: '#222222' },
  render: (args) => <Wrapper {...args}>Heavy stroke</Wrapper>,
}

export const WithShadow: Story = {
  args: { roughness: 1, strokeWidth: 1.5, fill: '#fffdf9', shadow: 3 },
  render: (args) => <Wrapper {...args}>With shadow</Wrapper>,
}

export const Hachure: Story = {
  args: { roughness: 1, fill: '#d4e6d4', fillStyle: 'hachure', fillWeight: 1.5, hachureGap: 5 },
  render: (args) => <Wrapper {...args}>Hachure fill</Wrapper>,
}
