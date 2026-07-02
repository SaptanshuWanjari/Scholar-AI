import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommandDialog, Command } from '@paper-ui/components/commands'
import { Search, FileText, Settings, User, Plus } from 'lucide-react'

const meta: Meta<typeof CommandDialog> = {
  title: 'Components/Composed/CommandDialog',
  component: CommandDialog,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof CommandDialog>

const items = [
  { label: 'New Document', icon: <Plus size={15} />, shortcut: ['⌘', 'N'] },
  { label: 'Open File...', icon: <FileText size={15} />, shortcut: ['⌘', 'O'] },
]

const settings = [
  { label: 'Profile', icon: <User size={15} /> },
  { label: 'Settings', icon: <Settings size={15} />, shortcut: ['⌘', ','] },
]

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8 bg-[#f4f1ea] flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#d4cfc2] bg-[#fffdf9] font-architect text-[14px] text-ink hover:bg-[#f0ede6] transition-colors shadow-sm"
        >
          <Search size={16} className="text-ink-muted" />
          Open Dialog
          <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded px-1.5 font-architect text-[10px] text-ink-muted/60" style={{ border: '1px solid rgba(0,0,0,0.12)' }}>
            ⌘K
          </kbd>
        </button>

        <CommandDialog open={open} onClose={() => setOpen(false)}>
          <Command.Input placeholder="Search..." />
          <Command.List>
            <Command.Group heading="File">
              {items.map(item => (
                <Command.Item key={item.label} onSelect={() => setOpen(false)} icon={item.icon}>
                  {item.label}
                  {item.shortcut && <Command.Shortcut keys={item.shortcut} />}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Account">
              {settings.map(item => (
                <Command.Item key={item.label} onSelect={() => setOpen(false)} icon={item.icon}>
                  {item.label}
                  {item.shortcut && <Command.Shortcut keys={item.shortcut} />}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <Command.Empty>No results found</Command.Empty>
        </CommandDialog>
      </div>
    )
  },
}

export const Open: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex justify-center">
      <CommandDialog open={true} onClose={() => {}}>
        <Command.Input placeholder="Type a command..." />
        <Command.List>
          <Command.Group heading="Actions">
            <Command.Item onSelect={() => {}} icon={<Plus size={15} />}>
              New <Command.Shortcut keys={['⌘', 'N']} />
            </Command.Item>
            <Command.Item onSelect={() => {}} icon={<FileText size={15} />}>
              Open... <Command.Shortcut keys={['⌘', 'O']} />
            </Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Settings">
            <Command.Item onSelect={() => {}} icon={<Settings size={15} />}>
              Preferences
            </Command.Item>
          </Command.Group>
        </Command.List>
        <Command.Empty>No matching commands</Command.Empty>
      </CommandDialog>
    </div>
  ),
}
