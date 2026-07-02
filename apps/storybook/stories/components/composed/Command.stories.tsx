import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Command } from '@paper-ui/components/commands'
import { FileText, Settings, User, LogOut, Plus } from 'lucide-react'

const meta: Meta<typeof Command> = {
  title: 'Components/Composed/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Command>

const items = [
  { label: 'New', icon: <Plus size={15} />, shortcut: ['⌘', 'N'] },
  { label: 'Open...', icon: <FileText size={15} />, shortcut: ['⌘', 'O'] },
]

const settings = [
  { label: 'Profile', icon: <User size={15} /> },
  { label: 'Settings', icon: <Settings size={15} />, shortcut: ['⌘', ','] },
  { label: 'Sign Out', icon: <LogOut size={15} /> },
]

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex justify-center">
      <div className="w-full max-w-[400px]">
        <Command>
          <Command.Input placeholder="Search actions..." />
          <Command.List>
            <Command.Group heading="File">
              {items.map(item => (
                <Command.Item key={item.label} onSelect={() => {}} icon={item.icon}>
                  {item.label}
                  {item.shortcut && <Command.Shortcut keys={item.shortcut} />}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Account">
              {settings.map(item => (
                <Command.Item key={item.label} onSelect={() => {}} icon={item.icon}>
                  {item.label}
                  {item.shortcut && <Command.Shortcut keys={item.shortcut} />}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <Command.Empty>No results found</Command.Empty>
        </Command>
      </div>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex justify-center">
      <div className="w-full max-w-[400px] border border-dashed border-ink-muted/30 p-4 rounded">
        <Command>
          <Command.Input placeholder="Search..." />
          <Command.List>
            <Command.Group heading="Quick Actions">
              <Command.Item onSelect={() => {}} icon={<Plus size={15} />}>
                New Document <Command.Shortcut keys={['⌘', 'N']} />
              </Command.Item>
              <Command.Item onSelect={() => {}} icon={<FileText size={15} />}>
                Open File <Command.Shortcut keys={['⌘', 'O']} />
              </Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Options">
              <Command.Item onSelect={() => {}} icon={<Settings size={15} />}>
                Preferences
              </Command.Item>
            </Command.Group>
          </Command.List>
          <Command.Empty>No commands found</Command.Empty>
        </Command>
      </div>
    </div>
  ),
}
