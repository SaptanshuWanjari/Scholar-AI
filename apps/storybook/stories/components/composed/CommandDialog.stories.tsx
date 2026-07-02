import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommandDialog, Command } from '@paper-ui/components/commands'
import { Paper } from '@paper-ui/components/paper'
import { SunDoodle, StarDoodle, SparkleDoodle, ArrowDoodle, BookmarkDoodle, LightbulbDoodle, TapeDoodle } from '@paper-ui/components/doodles'
import { Tape, PushPin } from '@paper-ui/components/decorations'
import { Search, FileText, Settings, User, LogOut, Copy, Trash2, Download, Plus } from 'lucide-react'

const meta: Meta<typeof CommandDialog> = {
  title: 'Components/Composed/CommandDialog',
  component: CommandDialog,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof CommandDialog>

const ITEMS = [
  { label: 'New Document', icon: <Plus size={15} />, shortcut: ['⌘', 'N'], action: () => alert('New Document') },
  { label: 'Open File...', icon: <FileText size={15} />, shortcut: ['⌘', 'O'], action: () => alert('Open File') },
  { label: 'Save', icon: <Download size={15} />, shortcut: ['⌘', 'S'], action: () => alert('Save') },
  { label: 'Copy', icon: <Copy size={15} />, shortcut: ['⌘', 'C'], action: () => alert('Copy') },
  { label: 'Delete', icon: <Trash2 size={15} />, shortcut: ['⌘', '⌫'], action: () => alert('Delete') },
]

const SETTINGS = [
  { label: 'Profile', icon: <User size={15} />, shortcut: [], action: () => alert('Profile') },
  { label: 'Preferences', icon: <Settings size={15} />, shortcut: ['⌘', ','], action: () => alert('Preferences') },
  { label: 'Sign Out', icon: <LogOut size={15} />, shortcut: [], action: () => alert('Sign Out') },
]

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [lastSelected, setLastSelected] = useState('')

    const handleSelect = (label: string, action: () => void) => {
      action()
      setLastSelected(label)
      setOpen(false)
    }

    return (
      <div className="p-16 bg-[#f4f1ea] flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#d4cfc2] bg-[#fffdf9] font-architect text-[14px] text-ink hover:bg-[#f0ede6] transition-colors shadow-sm"
        >
          <Search size={16} className="text-ink-muted" />
          Open Command Palette
          <kbd
            className="inline-flex h-5 min-w-[20px] items-center justify-center rounded px-1.5 font-architect text-[10px] text-ink-muted/60"
            style={{ border: '1px solid rgba(0,0,0,0.12)', background: 'rgba(0,0,0,0.035)' }}
          >
            ⌘K
          </kbd>
        </button>

        {lastSelected && (
          <p className="font-kalam text-sm text-ink-muted/70">
            Last selected: {lastSelected}
          </p>
        )}

        <CommandDialog open={open} onClose={() => setOpen(false)}>
          <Command.Input placeholder="Search commands..." />
          <Command.List>
            <Command.Group heading="Actions">
              {ITEMS.map((item) => (
                <Command.Item
                  key={item.label}
                  onSelect={() => handleSelect(item.label, item.action)}
                  icon={item.icon}
                >
                  {item.label}
                  {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Account">
              {SETTINGS.map((item) => (
                <Command.Item
                  key={item.label}
                  onSelect={() => handleSelect(item.label, item.action)}
                  icon={item.icon}
                >
                  {item.label}
                  {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
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

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-16 bg-[#f4f1ea] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#d4cfc2] bg-[#fffdf9] font-architect text-[14px] text-ink hover:bg-[#f0ede6] transition-colors shadow-sm"
        >
          <Search size={16} className="text-ink-muted" />
          Open
        </button>

        <CommandDialog open={open} onClose={() => setOpen(false)}>
          <Command.Input placeholder="Type a command..." />
          <Command.List>
            <Command.Group heading="File">
              {ITEMS.map((item) => (
                <Command.Item
                  key={item.label}
                  onSelect={() => { item.action(); setOpen(false) }}
                  icon={item.icon}
                >
                  {item.label}
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

export const Variants: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-16 bg-[#f4f1ea] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#d4cfc2] bg-[#fffdf9] font-architect text-[14px] text-ink hover:bg-[#f0ede6] transition-colors shadow-sm"
        >
          <Search size={16} className="text-ink-muted" />
          Open
        </button>

        <CommandDialog open={open} onClose={() => setOpen(false)}>
          <Command.Input placeholder="Search actions..." />
          <Command.List>
            <Command.Group heading="With Shortcuts">
              {ITEMS.map((item) => (
                <Command.Item
                  key={item.label}
                  onSelect={() => { item.action(); setOpen(false) }}
                  icon={item.icon}
                >
                  {item.label}
                  {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Without Shortcuts">
              {SETTINGS.map((item) => (
                <Command.Item
                  key={item.label}
                  onSelect={() => { item.action(); setOpen(false) }}
                  icon={item.icon}
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <Command.Empty>No results</Command.Empty>
        </CommandDialog>
      </div>
    )
  },
}

export const Composition: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
      <div className="min-h-screen bg-[#f4f1ea] p-6 md:p-10 relative overflow-hidden">
        <SunDoodle size={64} color="#e8c84a" className="absolute top-6 right-10 opacity-70 -rotate-6 z-0" />
        <StarDoodle size={28} color="#c9954f" className="absolute top-32 right-32 opacity-50 rotate-12 z-0" />
        <SparkleDoodle size={22} color="#4a6f91" className="absolute bottom-24 left-12 opacity-50 z-0" />
        <ArrowDoodle size={28} color="#3f7a4e" className="absolute top-1/3 left-8 opacity-50 rotate-45 z-0" />
        <BookmarkDoodle size={30} color="#b07a2e" className="absolute bottom-32 right-16 opacity-40 -rotate-12 z-0" />
        <LightbulbDoodle size={36} color="#fbbf24" className="absolute top-40 left-1/3 opacity-40 rotate-12 z-0" />

        <div className="relative z-10 mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <Tape corner="top-left" width={70} color="#e8c84a" />
            <h1 className="font-serif text-3xl font-bold text-ink tracking-tight">
              Command Dialog
            </h1>
            <Tape corner="top-right" width={60} color="#b5685e" />
          </div>
          <p className="font-kalam text-base text-ink-muted/70 max-w-md mx-auto">
            A portal dialog wrapping the Command compound component, triggered by
            ⌘K for keyboard-driven navigation.
          </p>
        </div>

        <div className="relative z-10 flex justify-center">
          <Paper
            className="p-0 relative rotate-1 max-w-[420px] w-full"
            shadowVariant="sketch"
            style={{ transform: 'rotate(1deg)' }}
          >
            <PushPin position="top-left" color="#4a6f91" />
            <Tape corner="top-right" width={48} color="#d4a76a" />
            <div className="px-4 pt-5 pb-1">
              <h3 className="font-caveat text-lg text-ink-muted/70 mb-1">Portal Dialog</h3>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <p className="font-kalam text-sm text-ink-muted/70 text-center">
                Opens a centered overlay with backdrop blur.
              </p>
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#d4cfc2] bg-[#fffdf9] font-architect text-[14px] text-ink hover:bg-[#f0ede6] transition-colors shadow-sm"
              >
                <Search size={16} className="text-ink-muted" />
                Open
                <kbd
                  className="inline-flex h-5 min-w-[20px] items-center justify-center rounded px-1.5 font-architect text-[10px] text-ink-muted/60"
                  style={{ border: '1px solid rgba(0,0,0,0.12)', background: 'rgba(0,0,0,0.035)' }}
                >
                  ⌘K
                </kbd>
              </button>

              <CommandDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <Command.Input placeholder="Search commands..." />
                <Command.List>
                  <Command.Group heading="File">
                    {ITEMS.map((item) => (
                      <Command.Item
                        key={item.label}
                        onSelect={() => { item.action(); setDialogOpen(false) }}
                        icon={item.icon}
                      >
                        {item.label}
                        {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
                      </Command.Item>
                    ))}
                  </Command.Group>
                  <Command.Separator />
                  <Command.Group heading="Account">
                    {SETTINGS.map((item) => (
                      <Command.Item
                        key={item.label}
                        onSelect={() => { item.action(); setDialogOpen(false) }}
                        icon={item.icon}
                      >
                        {item.label}
                        {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
                <Command.Empty>No results found</Command.Empty>
              </CommandDialog>
            </div>
            <div className="absolute -bottom-4 -right-4">
              <TapeDoodle size={36} color="#9c9484" className="opacity-50 -rotate-3" />
            </div>
          </Paper>
        </div>

        <div className="relative z-10 mt-10 text-center">
          <span className="inline-flex items-center gap-2 font-caveat text-sm text-ink-muted/50">
            <SparkleDoodle size={14} color="#9c9484" />
            Portal overlay &middot; Keyboard trigger &middot; Compound pattern
            <SparkleDoodle size={14} color="#9c9484" />
          </span>
        </div>
      </div>
    )
  },
}
