import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionSheet } from '@paper-ui/components/overlays'
import { PaperButton } from '@paper-ui/components/buttons'
import { Caption } from '@paper-ui/components/typography'
import { Share2, Edit3, Download, Copy, Trash2 } from 'lucide-react'

const meta: Meta<typeof ActionSheet> = {
  title: 'Components/Overlays/ActionSheet',
  component: ActionSheet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ActionSheet>

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [lastAction, setLastAction] = useState('')

    const items = [
      { id: 'share', label: 'Share deck', icon: <Share2 size={16} />, onSelect: () => setLastAction('Shared') },
      { id: 'edit', label: 'Rename deck', icon: <Edit3 size={16} />, onSelect: () => setLastAction('Renamed') },
      { id: 'export', label: 'Export as PDF', icon: <Download size={16} />, onSelect: () => setLastAction('Exported') },
      { id: 'duplicate', label: 'Duplicate deck', icon: <Copy size={16} />, onSelect: () => setLastAction('Duplicated') },
      {
        id: 'delete',
        label: 'Delete deck',
        icon: <Trash2 size={16} />,
        destructive: true,
        onSelect: () => setLastAction('Deleted'),
      },
    ]

    return (
      <div className="p-10 bg-[#f4f1ea] space-y-4">
        <PaperButton size="sm" onClick={() => setOpen(true)}>
          Show Actions
        </PaperButton>
        {lastAction && <Caption>Last action: {lastAction}</Caption>}
        <ActionSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Deck Actions"
          items={items}
        />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => {
    const items = [
      { id: 'share', label: 'Share', icon: <Share2 size={16} />, onSelect: () => {} },
      { id: 'export', label: 'Export', icon: <Download size={16} />, onSelect: () => {} },
      { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, destructive: true, onSelect: () => {} },
    ]

    return (
      <div className="p-10 bg-[#f4f1ea]">
        <ActionSheet
          open={true}
          onClose={() => {}}
          items={items}
        />
      </div>
    )
  },
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8">
      <div>
        <p className="font-architect text-xs uppercase text-[#9c9484] mb-2">Few items</p>
        <ActionSheet
          open={true}
          onClose={() => {}}
          items={[
            { id: 'share', label: 'Share', icon: <Share2 size={16} />, onSelect: () => {} },
            { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, destructive: true, onSelect: () => {} },
          ]}
        />
      </div>
      <div>
        <p className="font-architect text-xs uppercase text-[#9c9484] mb-2">Many items</p>
        <ActionSheet
          open={true}
          onClose={() => {}}
          items={[
            { id: 'share', label: 'Share deck', icon: <Share2 size={16} />, onSelect: () => {} },
            { id: 'edit', label: 'Rename deck', icon: <Edit3 size={16} />, onSelect: () => {} },
            { id: 'export', label: 'Export as PDF', icon: <Download size={16} />, onSelect: () => {} },
            { id: 'duplicate', label: 'Duplicate deck', icon: <Copy size={16} />, onSelect: () => {} },
            { id: 'delete', label: 'Delete deck', icon: <Trash2 size={16} />, destructive: true, onSelect: () => {} },
          ]}
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8">
      <div>
        <p className="font-architect text-xs uppercase text-[#9c9484] mb-2">With title</p>
        <ActionSheet
          open={true}
          onClose={() => {}}
          title="Deck Actions"
          items={[
            { id: 'share', label: 'Share deck', icon: <Share2 size={16} />, onSelect: () => {} },
            { id: 'export', label: 'Export as PDF', icon: <Download size={16} />, onSelect: () => {} },
            { id: 'delete', label: 'Delete deck', icon: <Trash2 size={16} />, destructive: true, onSelect: () => {} },
          ]}
        />
      </div>
      <div>
        <p className="font-architect text-xs uppercase text-[#9c9484] mb-2">Without title</p>
        <ActionSheet
          open={true}
          onClose={() => {}}
          items={[
            { id: 'share', label: 'Share', icon: <Share2 size={16} />, onSelect: () => {} },
            { id: 'export', label: 'Export', icon: <Download size={16} />, onSelect: () => {} },
            { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, destructive: true, onSelect: () => {} },
          ]}
        />
      </div>
    </div>
  ),
}
