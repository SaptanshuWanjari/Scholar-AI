import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TreeView, TreeItem } from '@paper-ui/components/dataDisplay';
import { FileText, Image, Code } from 'lucide-react';

const meta = {
  title: 'Components/Composed/TreeView',
  component: TreeView,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj;

const SampleTree = () => (
  <>
    <TreeItem id="src" label="src" defaultExpanded>
      <TreeItem id="components" label="components" defaultExpanded>
        <TreeItem id="Button" label="Button.tsx" icon={<Code size={16} />} />
        <TreeItem id="Card" label="Card.tsx" icon={<Code size={16} />} />
      </TreeItem>
      <TreeItem id="assets" label="assets">
        <TreeItem id="logo" label="logo.png" icon={<Image size={16} />} />
        <TreeItem id="hero" label="hero-bg.jpg" icon={<Image size={16} />} />
      </TreeItem>
      <TreeItem id="utils" label="utils.ts" icon={<Code size={16} />} />
    </TreeItem>
    <TreeItem id="docs" label="docs">
      <TreeItem id="intro" label="introduction.md" icon={<FileText size={16} />} />
      <TreeItem id="api" label="api-reference.md" icon={<FileText size={16} />} />
    </TreeItem>
    <TreeItem id="readme" label="README.md" icon={<FileText size={16} />} />
  </>
);

export const HandDrawn: Story = {
  render: () => (
    <div className="w-[400px]">
      <TreeView variant="hand-drawn">
        <SampleTree />
      </TreeView>
    </div>
  ),
};

export const OutlineBox: Story = {
  render: () => (
    <div className="w-[400px]">
      <TreeView variant="outline">
        <SampleTree />
      </TreeView>
    </div>
  ),
};
