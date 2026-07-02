import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChipButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof ChipButton> = {
  title: 'Components/Buttons/ChipButton',
  component: ChipButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ChipButton>

const tags = ['React', 'TypeScript', 'Tailwind', 'Storybook', 'Vite']

export const Playground: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['React'])
    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
        <h2 className="font-serif text-xl font-bold">ChipButton — filter chips</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <ChipButton
              key={tag}
              selected={selected.includes(tag)}
              onClick={() =>
                setSelected(s => s.includes(tag) ? s.filter(t => t !== tag) : [...s, tag])
              }
            >
              {tag}
            </ChipButton>
          ))}
        </div>
        <p className="font-mono text-xs text-gray-500">Selected: {selected.join(', ') || 'none'}</p>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <ChipButton>React</ChipButton>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ChipButton — all tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <ChipButton key={tag} selected={tag === 'React'}>
            {tag}
          </ChipButton>
        ))}
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['React'])
    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
        <h2 className="font-serif text-xl font-bold">ChipButton — selected state</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <ChipButton
              key={tag}
              selected={selected.includes(tag)}
              onClick={() =>
                setSelected(s => s.includes(tag) ? s.filter(t => t !== tag) : [...s, tag])
              }
            >
              {tag}
            </ChipButton>
          ))}
        </div>
        <p className="font-mono text-xs text-gray-500">Selected: {selected.join(', ') || 'none'}</p>
      </div>
    )
  },
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">ChipButton — filter bar</h2>
      <div className="flex flex-wrap gap-2 p-4 bg-white border border-gray-200 rounded-lg">
        {tags.map(tag => (
          <ChipButton key={tag}>{tag}</ChipButton>
        ))}
      </div>
    </div>
  ),
}
