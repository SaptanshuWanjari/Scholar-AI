import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyButton } from '@paper-ui/components/utility';
import { Copy } from 'lucide-react';

const meta: Meta<typeof CopyButton> = {
  title: 'Components/Utility/CopyButton',
  component: CopyButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => <div className="p-10 bg-[#f4f1ea]">{Story()}</div>,
  ],
};
export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: { text: 'Hello, world!', label: 'Copy', size: 'md' },
};

export const SizeSmall: Story = {
  args: { text: 'npm install @paper-ui/core', label: 'Copy', size: 'sm' },
};

export const CustomChildren: Story = {
  render: () => (
    <CopyButton text="custom content">
      <Copy size={14} />
      <span className="font-kalam text-sm">Copy this</span>
    </CopyButton>
  ),
};

export const WithToast: Story = {
  render: () => {
    const Comp = () => {
      const [copied, setCopied] = React.useState(false);
      return (
        <div className="flex items-center gap-3">
          <CopyButton text="with-inline-toast" onMouseDown={() => setCopied(true)} />
          <CopyButton.Toast copied={copied} />
        </div>
      );
    };
    return <Comp />;
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-xs text-gray-500 mb-2">md (default)</p>
        <CopyButton text="Medium sized button" label="Copy" size="md" />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 mb-2">sm</p>
        <CopyButton text="Small button" label="Copy" size="sm" />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 mb-2">custom label</p>
        <CopyButton text="git@github.com:user/repo.git" label="Copy URL" copiedLabel="URL Copied!" />
      </div>
    </div>
  ),
};
