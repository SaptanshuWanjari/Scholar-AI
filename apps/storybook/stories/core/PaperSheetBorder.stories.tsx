import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSheetBorder } from '@paper-ui/core'

const meta: Meta<typeof PaperSheetBorder> = {
  title: 'Core/PaperSheetBorder',
  component: PaperSheetBorder,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof PaperSheetBorder>

function Sheet(props: ComponentProps<typeof PaperSheetBorder> & { label?: string }) {
  const { label, ...rest } = props
  return (
    <div className="relative" style={{ width: 260, height: 140 }}>
      <PaperSheetBorder {...rest} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <span className="font-architect text-sm text-ink">{label ?? 'Paper sheet'}</span>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <Sheet />,
}

export const WithFold: Story = {
  render: () => <Sheet fold label="With fold" />,
}

export const CustomFill: Story = {
  render: () => <Sheet fill="#fdf3b8" label="Sticky yellow" />,
}

export const NoShadow: Story = {
  render: () => <Sheet shadow={0} label="No shadow" />,
}
