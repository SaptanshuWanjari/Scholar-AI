import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnchorLink } from '@paper-ui/components/utility';

const meta: Meta<typeof AnchorLink> = {
  title: 'Components/Utility/AnchorLink',
  component: AnchorLink,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => <div className="p-10 pl-16 bg-[#f4f1ea] max-w-2xl">{Story()}</div>,
  ],
};
export default meta;
type Story = StoryObj<typeof AnchorLink>;

export const H1: Story = {
  args: { id: 'getting-started', as: 'h1', children: 'Getting Started' },
};

export const H2: Story = {
  args: { id: 'installation', as: 'h2', children: 'Installation Guide' },
};

export const H3: Story = {
  args: { id: 'configuration', as: 'h3', children: 'Configuration Options' },
};

export const MultiHeadings: Story = {
  render: () => (
    <div className="space-y-8">
      <AnchorLink id="overview" as="h1">Project Overview</AnchorLink>
      <p className="font-kalam text-sm text-ink-muted pl-4">
        Hover over the headings to see the anchor link icon. Click to copy the URL.
      </p>
      <AnchorLink id="features" as="h2">Key Features</AnchorLink>
      <AnchorLink id="installation" as="h2">Installation</AnchorLink>
      <AnchorLink id="usage" as="h3">Basic Usage</AnchorLink>
      <AnchorLink id="advanced" as="h3">Advanced Configuration</AnchorLink>
      <AnchorLink id="api-reference" as="h2">API Reference</AnchorLink>
    </div>
  ),
};

export const CompoundManual: Story = {
  render: () => (
    <div className="group relative">
      <AnchorLink.Heading as="h2">Compound Heading</AnchorLink.Heading>
      <AnchorLink.Link
        visible={true}
        copied={false}
        onClick={() => {}}
        className="absolute left-[-1.75rem] top-1/2 -translate-y-1/2"
      />
    </div>
  ),
};
