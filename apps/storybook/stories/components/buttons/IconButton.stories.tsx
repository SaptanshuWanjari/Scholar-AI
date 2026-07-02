import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from '@paper-ui/components/buttons'
import { Search, Bookmark, Star, Bell, Trash2 } from 'lucide-react'

const meta: Meta<typeof IconButton> = {
  title: 'Components/Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof IconButton>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">IconButton</h2>
      <p className="font-mono text-sm text-gray-600">Minimal circular icon buttons for toolbars.</p>
      <div className="flex gap-3 items-center">
        <IconButton label="Search"><Search size={18} /></IconButton>
        <IconButton label="Bookmark"><Bookmark size={18} /></IconButton>
        <IconButton label="Star"><Star size={18} /></IconButton>
        <IconButton label="Bell"><Bell size={18} /></IconButton>
        <IconButton label="Delete"><Trash2 size={18} /></IconButton>
      </div>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <IconButton label="Search"><Search size={18} /></IconButton>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">IconButton — all icons</h2>
      <div className="flex gap-3 items-center">
        <IconButton label="Search"><Search size={18} /></IconButton>
        <IconButton label="Bookmark"><Bookmark size={18} /></IconButton>
        <IconButton label="Star"><Star size={18} /></IconButton>
        <IconButton label="Bell"><Bell size={18} /></IconButton>
        <IconButton label="Delete"><Trash2 size={18} /></IconButton>
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">IconButton — disabled</h2>
      <div className="flex gap-3 items-center">
        <IconButton label="Search" disabled><Search size={18} /></IconButton>
        <IconButton label="Delete" disabled><Trash2 size={18} /></IconButton>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">IconButton — toolbar</h2>
      <div className="flex gap-3 items-center p-4 bg-white border border-gray-200 rounded-lg">
        <IconButton label="Search"><Search size={18} /></IconButton>
        <IconButton label="Bookmark"><Bookmark size={18} /></IconButton>
        <IconButton label="Star"><Star size={18} /></IconButton>
        <IconButton label="Bell"><Bell size={18} /></IconButton>
        <IconButton label="Delete"><Trash2 size={18} /></IconButton>
      </div>
    </div>
  ),
}
