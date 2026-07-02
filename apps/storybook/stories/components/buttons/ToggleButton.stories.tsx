import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof ToggleButton> = {
  title: 'Components/Buttons/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ToggleButton>

export const Playground: Story = {
  render: () => {
    const [pressed, setPressed] = useState(false)
    const [bold, setBold] = useState(false)
    const [italic, setItalic] = useState(true)
    return (
      <div className="p-10 space-y-8 bg-[#f4f1ea]">
        <h2 className="font-serif text-xl font-bold">ToggleButton</h2>
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <ToggleButton pressed={bold} onPressedChange={setBold} size="sm"><strong>B</strong></ToggleButton>
            <ToggleButton pressed={italic} onPressedChange={setItalic} size="sm"><em>I</em></ToggleButton>
            <ToggleButton pressed={pressed} onPressedChange={setPressed}>
              {pressed ? 'ON' : 'OFF'}
            </ToggleButton>
          </div>
          <p className="font-mono text-xs text-gray-500">Bold: {String(bold)}, Italic: {String(italic)}, Toggle: {String(pressed)}</p>
        </div>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <ToggleButton pressed={false} onPressedChange={() => {}}>
        Toggle
      </ToggleButton>
    </div>
  ),
}

export const Variants: Story = {
  render: () => {
    const [bold, setBold] = useState(true)
    const [italic, setItalic] = useState(false)
    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
        <h2 className="font-serif text-xl font-bold">ToggleButton — formatting</h2>
        <div className="flex gap-3 items-center">
          <ToggleButton pressed={bold} onPressedChange={setBold} size="sm"><strong>B</strong></ToggleButton>
          <ToggleButton pressed={italic} onPressedChange={setItalic} size="sm"><em>I</em></ToggleButton>
        </div>
      </div>
    )
  },
}

export const States: Story = {
  render: () => {
    const [pressed, setPressed] = useState(false)
    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
        <h2 className="font-serif text-xl font-bold">ToggleButton — ON/OFF</h2>
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <ToggleButton pressed={pressed} onPressedChange={setPressed}>
              {pressed ? 'ON' : 'OFF'}
            </ToggleButton>
          </div>
          <p className="font-mono text-xs text-gray-500">State: {String(pressed)}</p>
        </div>
      </div>
    )
  },
}

export const Composition: Story = {
  render: () => {
    const [bold, setBold] = useState(true)
    const [italic, setItalic] = useState(false)
    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
        <h2 className="font-serif text-xl font-bold">ToggleButton — toolbar</h2>
        <div className="flex gap-1 items-center p-2 bg-white border border-gray-200 rounded-lg">
          <ToggleButton pressed={bold} onPressedChange={setBold} size="sm"><strong>B</strong></ToggleButton>
          <ToggleButton pressed={italic} onPressedChange={setItalic} size="sm"><em>I</em></ToggleButton>
        </div>
      </div>
    )
  },
}
