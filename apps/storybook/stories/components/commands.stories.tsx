import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { Command, CommandDialog } from '@paper-ui/components/commands';
import { Paper } from '@paper-ui/components/paper';
import { SunDoodle, StarDoodle, ArrowDoodle, TapeDoodle, SparkleDoodle, BookmarkDoodle, LightbulbDoodle } from '@paper-ui/components/doodles';
import { Tape, PushPin } from '@paper-ui/components/decorations';
import { SketchBorder } from '@paper-ui/core';
import { Search, FileText, Settings, User, LogOut, Copy, Trash2, Star, BookOpen, Pencil, Share2, Download, Plus, Zap, Palette, Globe } from 'lucide-react';
import { cn } from '@paper-ui/utils';

const meta = {
  title: 'Components/Commands',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const ITEMS = [
  { label: 'New Document', icon: <Plus size={15} />, shortcut: ['⌘', 'N'], action: () => alert('New Document') },
  { label: 'Open File...', icon: <FileText size={15} />, shortcut: ['⌘', 'O'], action: () => alert('Open File') },
  { label: 'Save', icon: <Download size={15} />, shortcut: ['⌘', 'S'], action: () => alert('Save') },
  { label: 'Copy', icon: <Copy size={15} />, shortcut: ['⌘', 'C'], action: () => alert('Copy') },
  { label: 'Delete', icon: <Trash2 size={15} />, shortcut: ['⌘', '⌫'], action: () => alert('Delete') },
];

const SETTINGS = [
  { label: 'Profile', icon: <User size={15} />, shortcut: [], action: () => alert('Profile') },
  { label: 'Preferences', icon: <Settings size={15} />, shortcut: ['⌘', ','], action: () => alert('Preferences') },
  { label: 'Sign Out', icon: <LogOut size={15} />, shortcut: [], action: () => alert('Sign Out') },
];

export const Default = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-center">
    <div className="w-full max-w-[480px]">
      <Command>
        <Command.Input placeholder="Search actions..." />
        <Command.List>
          <Command.Group heading="File">
            {ITEMS.map((item) => (
              <Command.Item key={item.label} onSelect={item.action} icon={item.icon}>
                {item.label}
                {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Account">
            {SETTINGS.map((item) => (
              <Command.Item key={item.label} onSelect={item.action} icon={item.icon}>
                {item.label}
                {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
        <Command.Empty>No results found</Command.Empty>
      </Command>
    </div>
  </div>
);

export const Empty = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-center">
    <div className="w-full max-w-[480px]">
      <Command>
        <Command.Input placeholder="Search actions..." />
        <Command.List>
          <Command.Group heading="File">
            <Command.Item onSelect={() => {}} icon={<FileText size={15} />}>Document</Command.Item>
          </Command.Group>
        </Command.List>
        <Command.Empty>Nothing matches your search</Command.Empty>
      </Command>
    </div>
    <p className="absolute bottom-40 font-kalam text-sm text-ink-muted/50">
      Try typing "xyz" in the search above to see the empty state
    </p>
  </div>
);

export const Loading = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-center">
    <div className="w-full max-w-[480px]">
      <Command loading>
        <Command.Input placeholder="Search actions..." />
        <Command.List>
          <Command.Item onSelect={() => {}} icon={<FileText size={15} />}>Document</Command.Item>
        </Command.List>
        <Command.Loading />
        <Command.Empty>No results</Command.Empty>
      </Command>
    </div>
  </div>
);

const DialogExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-16 bg-[#f4f1ea] flex flex-col items-center gap-6">
      <button
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

      <CommandDialog open={open} onClose={() => setOpen(false)}>
        <Command.Input placeholder="Search commands..." />
        <Command.List>
          <Command.Group heading="Actions">
            {ITEMS.map((item) => (
              <Command.Item key={item.label} onSelect={() => { item.action(); setOpen(false); }} icon={item.icon}>
                {item.label}
                {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Account">
            {SETTINGS.map((item) => (
              <Command.Item key={item.label} onSelect={() => { item.action(); setOpen(false); }} icon={item.icon}>
                {item.label}
                {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
        <Command.Empty>No results found</Command.Empty>
      </CommandDialog>
    </div>
  );
};

export const Dialog = () => <DialogExample />;

const MINI_ITEMS = [
  { label: 'Open File', icon: <FileText size={14} />, shortcut: ['⌘', 'O'] },
  { label: 'Find', icon: <Search size={14} />, shortcut: ['⌘', 'F'] },
  { label: 'Settings', icon: <Settings size={14} />, shortcut: ['⌘', ','] },
];

export const DoodleLayout = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-6 md:p-10 relative overflow-hidden">
      {/* --- Doodle decorations scattered --- */}
      <SunDoodle size={64} color="#e8c84a" className="absolute top-6 right-10 opacity-70 -rotate-6 z-0" />
      <StarDoodle size={28} color="#c9954f" className="absolute top-32 right-32 opacity-50 rotate-12 z-0" />
      <StarDoodle size={18} color="#9c9484" className="absolute top-40 right-56 opacity-40 -rotate-12 z-0" />
      <SparkleDoodle size={22} color="#4a6f91" className="absolute bottom-24 left-12 opacity-50 z-0" />
      <ArrowDoodle size={28} color="#3f7a4e" className="absolute top-1/3 left-8 opacity-50 rotate-45 z-0" />
      <BookmarkDoodle size={30} color="#b07a2e" className="absolute bottom-32 right-16 opacity-40 -rotate-12 z-0" />
      <LightbulbDoodle size={36} color="#fbbf24" className="absolute top-40 left-1/3 opacity-40 rotate-12 z-0" />

      {/* --- Header --- */}
      <div className="relative z-10 mb-10 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <Tape corner="top-left" width={70} color="#e8c84a" />
          <h1 className="font-serif text-3xl font-bold text-ink tracking-tight">
            Command Palette
          </h1>
          <Tape corner="top-right" width={60} color="#b5685e" />
        </div>
        <p className="font-kalam text-base text-ink-muted/70 max-w-md mx-auto">
          A compound component for building keyboard-driven command menus with
          a hand-drawn paper aesthetic.
        </p>
      </div>

      {/* --- Cards grid --- */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* Card 1 — Default command palette */}
        <Paper className="p-0 relative" shadowVariant="sketch">
          <PushPin position="top-center" color="#b5685e" />
          <Tape corner="top-right" width={52} />
          <div className="px-4 pt-5 pb-1">
            <h3 className="font-caveat text-lg text-ink-muted/70 mb-1">Quick Actions</h3>
          </div>
          <Command className="border-none">
            <Command.Input placeholder="Type to filter..." />
            <Command.List>
              <Command.Group heading="Navigation">
                <Command.Item onSelect={() => {}} icon={<Globe size={15} />}>
                  Dashboard
                  <Command.Shortcut keys={['⌘', 'D']} />
                </Command.Item>
                <Command.Item onSelect={() => {}} icon={<BookOpen size={15} />}>
                  Library
                  <Command.Shortcut keys={['⌘', 'L']} />
                </Command.Item>
                <Command.Item onSelect={() => {}} icon={<Star size={15} />}>
                  Favorites
                  <Command.Shortcut keys={['⌘', 'B']} />
                </Command.Item>
              </Command.Group>
              <Command.Separator />
              <Command.Group heading="Tools">
                <Command.Item onSelect={() => {}} icon={<Pencil size={15} />}>
                  Edit Mode
                </Command.Item>
                <Command.Item onSelect={() => {}} icon={<Palette size={15} />}>
                  Themes
                </Command.Item>
                <Command.Item onSelect={() => {}} icon={<Zap size={15} />}>
                  Quick Note
                  <Command.Shortcut keys={['⌘', '⇧', 'N']} />
                </Command.Item>
              </Command.Group>
            </Command.List>
            <Command.Empty>No matching actions</Command.Empty>
          </Command>
        </Paper>

        {/* Card 2 — Rotated, with doodle marks */}
        <Paper
          className="p-0 relative -rotate-1"
          shadowVariant="soft"
          style={{ transform: 'rotate(-1deg)' }}
        >
          <Tape corner="top-left" width={56} color="#8fa68a" />
          <div className="absolute -top-3 -right-3 text-yellow-500 rotate-12">
            <StarDoodle size={32} color="#c9954f" />
          </div>
          <div className="px-4 pt-5 pb-1">
            <h3 className="font-caveat text-lg text-ink-muted/70 mb-1">Mini Palette</h3>
          </div>
          <Command className="border-none">
            <Command.Input placeholder="Search..." />
            <Command.List>
              {MINI_ITEMS.map((item) => (
                <Command.Item key={item.label} onSelect={() => {}} icon={item.icon}>
                  {item.label}
                  {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
                </Command.Item>
              ))}
            </Command.List>
            <Command.Empty>No results</Command.Empty>
          </Command>
          <div className="absolute -bottom-2 -left-2">
            <ArrowDoodle size={22} color="#3a3733" className="rotate-[30deg] opacity-60" />
          </div>
        </Paper>

        {/* Card 3 — Dialog trigger card */}
        <Paper
          className="p-0 relative rotate-1"
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
                    <Command.Item key={item.label} onSelect={() => { item.action(); setDialogOpen(false); }} icon={item.icon}>
                      {item.label}
                      {item.shortcut.length > 0 && <Command.Shortcut keys={item.shortcut} />}
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Separator />
                <Command.Group heading="Account">
                  {SETTINGS.map((item) => (
                    <Command.Item key={item.label} onSelect={() => { item.action(); setDialogOpen(false); }} icon={item.icon}>
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

      {/* --- Footer note --- */}
      <div className="relative z-10 mt-10 text-center">
        <span className="inline-flex items-center gap-2 font-caveat text-sm text-ink-muted/50">
          <SparkleDoodle size={14} color="#9c9484" />
          Compound pattern &middot; Portal dialog &middot; Keyboard navigation
          <SparkleDoodle size={14} color="#9c9484" />
        </span>
      </div>
    </div>
  );
};
