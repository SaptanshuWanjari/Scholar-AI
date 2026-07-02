import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionSheet } from '@paper-ui/components/overlays'
import { PaperButton } from '@paper-ui/components/buttons'
import { Share2, Edit3, Download, Copy, Trash2 } from 'lucide-react'

const meta: Meta<typeof ActionSheet> = {
  title: 'Components/Overlays/ActionSheet',
  component: ActionSheet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ActionSheet>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8 bg-[#f4f1ea]">
        <PaperButton size="sm" onClick={() => setOpen(true)}>
          Show Actions
        </PaperButton>
        <ActionSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Deck Actions"
          items={[
            { id: 'share', label: 'Share deck', icon: <Share2 size={16} />, onSelect: () => {} },
            { id: 'edit', label: 'Rename deck', icon: <Edit3 size={16} />, onSelect: () => {} },
            { id: 'export', label: 'Export as PDF', icon: <Download size={16} />, onSelect: () => {} },
            { id: 'duplicate', label: 'Duplicate deck', icon: <Copy size={16} />, onSelect: () => {} },
            { id: 'delete', label: 'Delete deck', icon: <Trash2 size={16} />, destructive: true, onSelect: () => {} },
          ]}
        />
      </div>
    )
  },
}

export const Destructive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ActionSheet
        open={true}
        onClose={() => {}}
        title="Dangerous Actions"
        items={[
          { id: 'archive', label: 'Archive deck', icon: <Download size={16} />, onSelect: () => {} },
          { id: 'delete', label: 'Delete permanently', icon: <Trash2 size={16} />, destructive: true, onSelect: () => {} },
        ]}
      />
    </div>
  ),
}
