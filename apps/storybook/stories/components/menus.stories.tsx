import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { Menu } from '@paper-ui/components/menus';
import { Paper } from '@paper-ui/components/paper';
import {
  SunDoodle,
  StarDoodle,
  ArrowDoodle,
  SparkleDoodle,
  BookmarkDoodle,
  LightbulbDoodle,
  TapeDoodle,
} from '@paper-ui/components/doodles';
import { Tape, PushPin } from '@paper-ui/components/decorations';
import {
  Search,
  Settings,
  User,
  LogOut,
  FileText,
  Copy,
  Trash2,
  Star,
  BookOpen,
  Pencil,
  Share2,
  Download,
  Plus,
  Zap,
  Palette,
  Globe,
  Check,
  Circle,
  ChevronRight,
  Bell,
  Image,
  Lock,
  Upload,
  FolderOpen,
  Save,
  Edit3,
  Mail,
  MessageCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

const meta = {
  title: 'Components/Menus',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

/* -------------------------------------------------------------------------- */
/*  1. Default                                                                */
/* -------------------------------------------------------------------------- */

export const Default = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-start">
    <div style={{ marginTop: 40 }}>
      <Menu.Root>
        <Menu.Trigger>Open Menu</Menu.Trigger>
        <Menu.Content>
          <Menu.Label>Actions</Menu.Label>
          <Menu.Item onSelect={() => alert('Search')} icon={<Search size={14} />}>
            Search
            <Menu.Shortcut keys={['⌘', 'F']} />
          </Menu.Item>
          <Menu.Item onSelect={() => alert('New')} icon={<Plus size={14} />}>
            New Document
            <Menu.Shortcut keys={['⌘', 'N']} />
          </Menu.Item>
          <Menu.Item onSelect={() => alert('Open')} icon={<FileText size={14} />}>
            Open File...
            <Menu.Shortcut keys={['⌘', 'O']} />
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item onSelect={() => alert('Profile')} icon={<User size={14} />}>
            Profile
          </Menu.Item>
          <Menu.Submenu label="Settings">
            <Menu.Item onSelect={() => {}} icon={<Palette size={14} />}>
              Appearance
            </Menu.Item>
            <Menu.Item onSelect={() => {}} icon={<Bell size={14} />}>
              Notifications
            </Menu.Item>
            <Menu.Item onSelect={() => {}} icon={<Lock size={14} />}>
              Privacy
            </Menu.Item>
          </Menu.Submenu>
        </Menu.Content>
      </Menu.Root>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  2. CheckboxItems                                                          */
/* -------------------------------------------------------------------------- */

function CheckboxMenu() {
  const [sidebar, setSidebar] = useState(true);
  const [statusBar, setStatusBar] = useState(false);
  const [ruler, setRuler] = useState(true);

  return (
    <Menu.Root>
      <Menu.Trigger>View Options</Menu.Trigger>
      <Menu.Content>
        <Menu.Label>Appearance</Menu.Label>
        <Menu.Checkbox checked={sidebar} onChange={setSidebar}>
          Show sidebar
        </Menu.Checkbox>
        <Menu.Checkbox checked={statusBar} onChange={setStatusBar}>
          Show status bar
        </Menu.Checkbox>
        <Menu.Checkbox checked={ruler} onChange={setRuler}>
          Show ruler
        </Menu.Checkbox>
        <Menu.Separator />
        <Menu.Item
          onSelect={() => {
            setSidebar(true);
            setStatusBar(false);
            setRuler(true);
          }}
        >
          Reset to defaults
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}

export const CheckboxItems = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-start">
    <div style={{ marginTop: 40 }}>
      <CheckboxMenu />
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  3. RadioItems                                                             */
/* -------------------------------------------------------------------------- */

function RadioMenu() {
  const [theme, setTheme] = useState('dark');

  return (
    <Menu.Root>
      <Menu.Trigger>Theme: {theme}</Menu.Trigger>
      <Menu.Content>
        <Menu.Label>Color Theme</Menu.Label>
        <Menu.Radio
          value="light"
          group="theme"
          selected={theme === 'light'}
          onSelect={() => setTheme('light')}
        >
          <Eye size={14} className="mr-2 inline" />
          Light
        </Menu.Radio>
        <Menu.Radio
          value="dark"
          group="theme"
          selected={theme === 'dark'}
          onSelect={() => setTheme('dark')}
        >
          <EyeOff size={14} className="mr-2 inline" />
          Dark
        </Menu.Radio>
        <Menu.Radio
          value="paper"
          group="theme"
          selected={theme === 'paper'}
          onSelect={() => setTheme('paper')}
        >
          <FileText size={14} className="mr-2 inline" />
          Paper
        </Menu.Radio>
      </Menu.Content>
    </Menu.Root>
  );
}

export const RadioItems = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-start">
    <div style={{ marginTop: 40 }}>
      <RadioMenu />
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  4. DangerItems                                                            */
/* -------------------------------------------------------------------------- */

export const DangerItems = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-start">
    <div style={{ marginTop: 40 }}>
      <Menu.Root>
        <Menu.Trigger>File Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Label>File</Menu.Label>
          <Menu.Item onSelect={() => {}} icon={<Edit3 size={14} />}>
            Rename
            <Menu.Shortcut keys={['F2']} />
          </Menu.Item>
          <Menu.Item onSelect={() => {}} icon={<Copy size={14} />}>
            Duplicate
            <Menu.Shortcut keys={['⌘', 'D']} />
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item onSelect={() => {}} danger icon={<Trash2 size={14} />}>
            Delete
            <Menu.Shortcut keys={['⌘', '⌫']} />
          </Menu.Item>
          <Menu.Item onSelect={() => {}} danger>
            Archive permanently
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  5. Submenu                                                                */
/* -------------------------------------------------------------------------- */

export const Submenu = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-start">
    <div style={{ marginTop: 40 }}>
      <Menu.Root>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Content>
          <Menu.Label>Actions</Menu.Label>
          <Menu.Item onSelect={() => {}} icon={<Plus size={14} />}>
            New
            <Menu.Shortcut keys={['⌘', 'N']} />
          </Menu.Item>
          <Menu.Item onSelect={() => {}} icon={<FolderOpen size={14} />}>
            Open...
            <Menu.Shortcut keys={['⌘', 'O']} />
          </Menu.Item>
          <Menu.Separator />
          <Menu.Submenu label="Import">
            <Menu.Item onSelect={() => {}} icon={<Image size={14} />}>
              From Image...
            </Menu.Item>
            <Menu.Item onSelect={() => {}} icon={<FileText size={14} />}>
              From PDF...
            </Menu.Item>
            <Menu.Item onSelect={() => {}} icon={<Upload size={14} />}>
              From URL...
            </Menu.Item>
          </Menu.Submenu>
          <Menu.Submenu label="Export">
            <Menu.Item onSelect={() => {}} icon={<Download size={14} />}>
              As PDF...
            </Menu.Item>
            <Menu.Item onSelect={() => {}} icon={<Image size={14} />}>
              As PNG...
            </Menu.Item>
            <Menu.Item onSelect={() => {}} icon={<Share2 size={14} />}>
              Share link...
            </Menu.Item>
          </Menu.Submenu>
          <Menu.Separator />
          <Menu.Item onSelect={() => {}} danger icon={<Trash2 size={14} />}>
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  6. ContextMenu (standalone Menu, no trigger)                              */
/* -------------------------------------------------------------------------- */

export const ContextMenu = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-center">
    <div className="w-[220px]">
      <Menu>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item onSelect={() => {}} icon={<Copy size={14} />}>
          Copy
        </Menu.Item>
        <Menu.Item onSelect={() => {}} icon={<Pencil size={14} />}>
          Rename
        </Menu.Item>
        <Menu.Item onSelect={() => {}} icon={<Share2 size={14} />}>
          Share
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={() => {}} danger icon={<Trash2 size={14} />}>
          Delete
        </Menu.Item>
      </Menu>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  7. DoodleLayout                                                           */
/* -------------------------------------------------------------------------- */

function DoodleMenuCard({
  title,
  tapeColor,
  tapeCorner,
  rotate,
  pushPin,
  pushPinColor,
  children,
}: {
  title: string;
  tapeColor?: string;
  tapeCorner?: 'top-left' | 'top-right';
  rotate?: string;
  pushPin?: 'top-left' | 'top-center' | 'top-right';
  pushPinColor?: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      className="p-0 relative"
      shadowVariant="sketch"
      style={rotate ? { transform: rotate } : undefined}
    >
      {pushPin && <PushPin position={pushPin} color={pushPinColor} />}
      {tapeColor && tapeCorner && (
        <Tape corner={tapeCorner} width={52} color={tapeColor} />
      )}
      <div className="px-4 pt-5 pb-2">
        <h3 className="font-caveat text-lg text-ink-muted/70">{title}</h3>
      </div>
      <div className="px-2 pb-4">{children}</div>
    </Paper>
  );
}

export const DoodleLayout = () => {
  const [theme, setTheme] = useState('dark');
  const [sidebar, setSidebar] = useState(true);
  const [statusBar, setStatusBar] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-6 md:p-10 relative overflow-hidden">
      {/* --- Doodle decorations scattered --- */}
      <SunDoodle
        size={64}
        color="#e8c84a"
        className="absolute top-6 right-10 opacity-70 -rotate-6 z-0"
      />
      <StarDoodle
        size={28}
        color="#c9954f"
        className="absolute top-32 right-32 opacity-50 rotate-12 z-0"
      />
      <StarDoodle
        size={18}
        color="#9c9484"
        className="absolute top-40 right-56 opacity-40 -rotate-12 z-0"
      />
      <SparkleDoodle
        size={22}
        color="#4a6f91"
        className="absolute bottom-24 left-12 opacity-50 z-0"
      />
      <ArrowDoodle
        size={28}
        color="#3f7a4e"
        className="absolute top-1/3 left-8 opacity-50 rotate-45 z-0"
      />
      <BookmarkDoodle
        size={30}
        color="#b07a2e"
        className="absolute bottom-32 right-16 opacity-40 -rotate-12 z-0"
      />
      <LightbulbDoodle
        size={36}
        color="#fbbf24"
        className="absolute top-40 left-1/3 opacity-40 rotate-12 z-0"
      />

      {/* --- Header --- */}
      <div className="relative z-10 mb-10 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <Tape corner="top-left" width={70} color="#e8c84a" />
          <h1 className="font-serif text-3xl font-bold text-ink tracking-tight">
            Menu Components
          </h1>
          <Tape corner="top-right" width={60} color="#b5685e" />
        </div>
        <p className="font-kalam text-base text-ink-muted/70 max-w-md mx-auto">
          Compound dropdown menus with a hand-drawn paper aesthetic. Trigger,
          items, checkboxes, radios, submenus — all without Radix.
        </p>
      </div>

      {/* --- Cards grid --- */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Card 1 — Default dropdown */}
        <DoodleMenuCard
          title="Default Dropdown"
          tapeColor="#e8c84a"
          tapeCorner="top-left"
          pushPin="top-center"
          pushPinColor="#b5685e"
        >
          <Menu.Root>
            <Menu.Trigger>Actions</Menu.Trigger>
            <Menu.Content>
              <Menu.Label>File</Menu.Label>
              <Menu.Item onSelect={() => {}} icon={<FileText size={14} />}>
                New Document
                <Menu.Shortcut keys={['⌘', 'N']} />
              </Menu.Item>
              <Menu.Item onSelect={() => {}} icon={<FolderOpen size={14} />}>
                Open...
                <Menu.Shortcut keys={['⌘', 'O']} />
              </Menu.Item>
              <Menu.Item onSelect={() => {}} icon={<Save size={14} />}>
                Save
                <Menu.Shortcut keys={['⌘', 'S']} />
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
        </DoodleMenuCard>

        {/* Card 2 — Radio items, rotated */}
        <DoodleMenuCard
          title="Theme Picker"
          tapeColor="#8fa68a"
          tapeCorner="top-right"
          rotate="rotate(-1deg)"
          pushPin="top-left"
          pushPinColor="#4a6f91"
        >
          <Menu.Root>
            <Menu.Trigger>Theme: {theme}</Menu.Trigger>
            <Menu.Content>
              <Menu.Label>Color Theme</Menu.Label>
              <Menu.Radio
                value="light"
                group="theme"
                selected={theme === 'light'}
                onSelect={() => setTheme('light')}
              >
                Light
              </Menu.Radio>
              <Menu.Radio
                value="dark"
                group="theme"
                selected={theme === 'dark'}
                onSelect={() => setTheme('dark')}
              >
                Dark
              </Menu.Radio>
              <Menu.Radio
                value="paper"
                group="theme"
                selected={theme === 'paper'}
                onSelect={() => setTheme('paper')}
              >
                Paper
              </Menu.Radio>
            </Menu.Content>
          </Menu.Root>
        </DoodleMenuCard>

        {/* Card 3 — Checkbox + danger, rotated */}
        <DoodleMenuCard
          title="View Options"
          tapeColor="#d4a76a"
          tapeCorner="top-right"
          rotate="rotate(1deg)"
        >
          <Menu.Root>
            <Menu.Trigger>View</Menu.Trigger>
            <Menu.Content>
              <Menu.Label>Appearance</Menu.Label>
              <Menu.Checkbox checked={sidebar} onChange={setSidebar}>
                Sidebar
              </Menu.Checkbox>
              <Menu.Checkbox checked={statusBar} onChange={setStatusBar}>
                Status bar
              </Menu.Checkbox>
              <Menu.Separator />
              <Menu.Item onSelect={() => {}} danger icon={<Trash2 size={14} />}>
                Clear cache
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </DoodleMenuCard>

        {/* Card 4 — Context menu style, rotated */}
        <DoodleMenuCard
          title="Context Style"
          tapeColor="#b5685e"
          tapeCorner="top-left"
          rotate="rotate(-0.5deg)"
          pushPin="top-right"
          pushPinColor="#c9954f"
        >
          <Menu>
            <Menu.Label>Clipboard</Menu.Label>
            <Menu.Item onSelect={() => {}} icon={<Copy size={14} />}>
              Copy
            </Menu.Item>
            <Menu.Item onSelect={() => {}} icon={<Pencil size={14} />}>
              Rename
            </Menu.Item>
            <Menu.Item onSelect={() => {}} icon={<Share2 size={14} />}>
              Share
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item onSelect={() => {}} danger icon={<Trash2 size={14} />}>
              Delete
            </Menu.Item>
          </Menu>
        </DoodleMenuCard>

        {/* Card 5 — Submenu showcase, rotated */}
        <DoodleMenuCard
          title="Nested Submenus"
          tapeColor="#4a6f91"
          tapeCorner="top-right"
          rotate="rotate(1.5deg)"
        >
          <Menu.Root>
            <Menu.Trigger>File</Menu.Trigger>
            <Menu.Content>
              <Menu.Label>Actions</Menu.Label>
              <Menu.Item onSelect={() => {}} icon={<Plus size={14} />}>
                New
              </Menu.Item>
              <Menu.Submenu label="Open Recent">
                <Menu.Item onSelect={() => {}} icon={<FileText size={14} />}>
                  draft.md
                </Menu.Item>
                <Menu.Item onSelect={() => {}} icon={<FileText size={14} />}>
                  notes.pdf
                </Menu.Item>
                <Menu.Item onSelect={() => {}} icon={<Image size={14} />}>
                  sketch.png
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => {}} icon={<FolderOpen size={14} />}>
                  Clear recent...
                </Menu.Item>
              </Menu.Submenu>
              <Menu.Submenu label="Export">
                <Menu.Item onSelect={() => {}} icon={<Download size={14} />}>
                  PDF
                </Menu.Item>
                <Menu.Item onSelect={() => {}} icon={<Image size={14} />}>
                  PNG
                </Menu.Item>
                <Menu.Item onSelect={() => {}} icon={<Share2 size={14} />}>
                  Link
                </Menu.Item>
              </Menu.Submenu>
            </Menu.Content>
          </Menu.Root>
        </DoodleMenuCard>

        {/* Card 6 — Danger items, rotated */}
        <DoodleMenuCard
          title="Destructive Actions"
          tapeColor="#9f3a36"
          tapeCorner="top-left"
          rotate="rotate(-2deg)"
          pushPin="top-center"
          pushPinColor="#9f3a36"
        >
          <Menu.Root>
            <Menu.Trigger>Edit</Menu.Trigger>
            <Menu.Content>
              <Menu.Label>File</Menu.Label>
              <Menu.Item onSelect={() => {}} icon={<Edit3 size={14} />}>
                Rename
              </Menu.Item>
              <Menu.Item onSelect={() => {}} icon={<Copy size={14} />}>
                Duplicate
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item onSelect={() => {}} danger icon={<Trash2 size={14} />}>
                Delete
                <Menu.Shortcut keys={['⌘', '⌫']} />
              </Menu.Item>
              <Menu.Item onSelect={() => {}} danger>
                Archive permanently
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </DoodleMenuCard>
      </div>

      {/* --- Extra doodle tape on some cards --- */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="absolute -bottom-3 left-0">
          <ArrowDoodle
            size={22}
            color="#3a3733"
            className="rotate-[30deg] opacity-60"
          />
        </div>
        <div className="absolute -bottom-4 right-4">
          <TapeDoodle size={36} color="#9c9484" className="opacity-50 -rotate-3" />
        </div>
      </div>

      {/* --- Footer note --- */}
      <div className="relative z-10 mt-12 text-center">
        <span className="inline-flex items-center gap-2 font-caveat text-sm text-ink-muted/50">
          <SparkleDoodle size={14} color="#9c9484" />
          Compound pattern &middot; Portal positioning &middot; Submenus{' '}
          &middot; No Radix
          <SparkleDoodle size={14} color="#9c9484" />
        </span>
      </div>
    </div>
  );
};
