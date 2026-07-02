import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tree } from '@paper-ui/components/tree'
import { FileText, Code } from 'lucide-react'

const meta: Meta<typeof Tree> = {
  title: 'Components/Composed/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Tree>

const TreeContent = () => (
  <Tree.Branch id="src" label="src" defaultExpanded>
    <Tree.Branch id="components" label="components">
      <Tree.Leaf id="button" label="Button.tsx" icon={<Code size={14} />} />
      <Tree.Leaf id="card" label="Card.tsx" icon={<Code size={14} />} />
    </Tree.Branch>
    <Tree.Branch id="hooks" label="hooks" defaultExpanded>
      <Tree.Leaf id="useToggle" label="useToggle.ts" icon={<Code size={14} />} />
      <Tree.Leaf id="useFetch" label="useFetch.ts" icon={<Code size={14} />} />
    </Tree.Branch>
    <Tree.Leaf id="app" label="App.tsx" icon={<Code size={14} />} />
  </Tree.Branch>
)

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex justify-center">
      <div className="w-[320px]">
        <Tree variant="hand-drawn">
          <TreeContent />
          <Tree.Branch id="docs" label="docs">
            <Tree.Leaf id="readme" label="README.md" icon={<FileText size={14} />} />
          </Tree.Branch>
        </Tree>
      </div>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-8">
      <div className="max-w-[400px]">
        <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Hand-Drawn</h3>
        <Tree variant="hand-drawn">
          <TreeContent />
        </Tree>
      </div>
      <div className="max-w-[400px]">
        <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Outline</h3>
        <Tree variant="outline">
          <TreeContent />
        </Tree>
      </div>
    </div>
  ),
}

export const WithSearch: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-full max-w-[400px]">
      <Tree variant="outline">
        <Tree.Search placeholder="Filter..." />
        <TreeContent />
      </Tree>
    </div>
  ),
}
