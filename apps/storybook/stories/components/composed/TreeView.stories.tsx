import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TreeView, TreeItem } from '@paper-ui/components/dataDisplay'
import { FileText, Image, Code } from 'lucide-react'

const meta: Meta<typeof TreeView> = {
  title: 'Components/Composed/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof TreeView>

const TreeContent = () => (
  <>
    <TreeItem id="src" label="src" defaultExpanded>
      <TreeItem id="components" label="components" defaultExpanded>
        <TreeItem id="Button" label="Button.tsx" icon={<Code size={16} />} />
        <TreeItem id="Card" label="Card.tsx" icon={<Code size={16} />} />
      </TreeItem>
      <TreeItem id="utils" label="utils.ts" icon={<Code size={16} />} />
    </TreeItem>
    <TreeItem id="docs" label="docs">
      <TreeItem id="readme" label="README.md" icon={<FileText size={16} />} />
    </TreeItem>
  </>
)

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-full max-w-[400px]">
      <TreeView variant="hand-drawn">
        <TreeContent />
      </TreeView>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-8">
      <div className="max-w-[400px]">
        <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Hand-Drawn</h3>
        <TreeView variant="hand-drawn">
          <TreeContent />
        </TreeView>
      </div>
      <div className="max-w-[400px]">
        <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Outline</h3>
        <TreeView variant="outline">
          <TreeContent />
        </TreeView>
      </div>
    </div>
  ),
}
