import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClipboardButton } from '@paper-ui/components/utility';

const meta: Meta<typeof ClipboardButton> = {
  title: 'Components/Utility/ClipboardButton',
  component: ClipboardButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => <div className="p-10 bg-[#f4f1ea]">{Story()}</div>,
  ],
};
export default meta;
type Story = StoryObj<typeof ClipboardButton>;

export const TextContent: Story = {
  args: {
    content: 'This is some plain text content to copy.',
    contentType: 'text',
    preview: true,
  },
};

export const CodeContent: Story = {
  args: {
    content: 'const greeting: string = "Hello, world!";',
    contentType: 'code',
    preview: true,
  },
};

export const LinkContent: Story = {
  args: {
    content: 'https://github.com/user/repo/blob/main/src/index.ts',
    contentType: 'link',
    preview: true,
  },
};

export const NoPreview: Story = {
  args: {
    content: 'Secret API key: sk-proj-abc123def456',
    contentType: 'text',
    preview: false,
    label: 'Copy Key',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <p className="font-mono text-xs text-gray-500 mb-1">text</p>
        <ClipboardButton content="Plain text content for clipboard" contentType="text" preview />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 mb-1">code</p>
        <ClipboardButton content="export const x = 42;" contentType="code" preview />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 mb-1">link</p>
        <ClipboardButton content="https://example.com/docs/getting-started" contentType="link" preview />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 mb-1">text — no preview</p>
        <ClipboardButton content="Some longer text that would get cut off in preview" contentType="text" />
      </div>
    </div>
  ),
};
