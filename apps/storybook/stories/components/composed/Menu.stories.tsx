import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu } from '@paper-ui/components/menus'
import { FileText, Settings, User, LogOut, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react'

const meta: Meta<typeof Menu> = {
  title: 'Components/Composed/Menu',
  component: Menu.Root,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Menu>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex justify-start pt-16">
      <Menu.Root>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Content>
          <Menu.Label>Actions</Menu.Label>
          <Menu.Item onSelect={() => {}} icon={<Plus size={14} />}>
            New <Menu.Shortcut keys={['⌘', 'N']} />
          </Menu.Item>
          <Menu.Item onSelect={() => {}} icon={<FileText size={14} />}>
            Open... <Menu.Shortcut keys={['⌘', 'O']} />
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item onSelect={() => {}} icon={<User size={14} />}>
            Profile
          </Menu.Item>
          <Menu.Item onSelect={() => {}} icon={<LogOut size={14} />}>
            Sign Out
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  ),
}

export const Composed: Story = {
  render: () => {
    const [theme, setTheme] = useState('dark')

    return (
      <div className="p-8 bg-[#f4f1ea] flex justify-start pt-16 gap-8">
        <Menu.Root>
          <Menu.Trigger>View Options</Menu.Trigger>
          <Menu.Content>
            <Menu.Label>Theme</Menu.Label>
            <Menu.Radio value="light" group="theme" selected={theme === 'light'} onSelect={() => setTheme('light')}>
              <Eye size={14} className="mr-2 inline" />
              Light
            </Menu.Radio>
            <Menu.Radio value="dark" group="theme" selected={theme === 'dark'} onSelect={() => setTheme('dark')}>
              <EyeOff size={14} className="mr-2 inline" />
              Dark
            </Menu.Radio>
          </Menu.Content>
        </Menu.Root>

        <Menu>
          <Menu.Label>Context Menu</Menu.Label>
          <Menu.Item onSelect={() => {}} icon={<Copy size={14} />}>Copy</Menu.Item>
          <Menu.Item onSelect={() => {}} icon={<FileText size={14} />}>Paste</Menu.Item>
          <Menu.Separator />
          <Menu.Item onSelect={() => {}} danger icon={<Trash2 size={14} />}>Delete</Menu.Item>
        </Menu>
      </div>
    )
  },
}
