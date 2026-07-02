import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeToggle } from '@paper-ui/components/utility'

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/Utility/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ThemeToggle>

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center">
      <ThemeToggle theme="light" />
    </div>
  ),
}

export const Light: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center">
      <ThemeToggle theme="light" />
    </div>
  ),
}

export const Dark: Story = {
  render: () => (
    <div className="p-8 bg-[#1a1817] flex items-center">
      <ThemeToggle theme="dark" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-4">
      <ThemeToggle theme="light" size="sm" />
      <ThemeToggle theme="light" size="md" />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const Comp = () => {
      const [theme, setTheme] = useState<'light' | 'dark'>('light')
      const isLight = theme === 'light'
      return (
        <div
          className="p-8 min-h-40 flex items-center justify-center transition-colors"
          style={{ background: isLight ? '#f4f1ea' : '#1a1817' }}
        >
          <ThemeToggle theme={theme} onToggle={setTheme} />
        </div>
      )
    }
    return <Comp />
  },
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <div className="flex gap-4">
        <ThemeToggle.Sun size={20} />
        <ThemeToggle.Moon size={20} />
      </div>
      <ThemeToggle.Track>
        <ThemeToggle.Sun size={14} />
        <ThemeToggle.Moon size={14} />
      </ThemeToggle.Track>
    </div>
  ),
}
