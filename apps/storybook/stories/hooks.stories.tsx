import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Layout and Core components
import { Flex, Stack, Box } from '@paper-ui/components/layout';
import { PaperCard, PaperPanel } from '@paper-ui/core';
import { SketchBorder } from '@paper-ui/core';
import { PaperShadow } from '@paper-ui/components/paper';
import { PaperH3, PaperH4, PaperH5 } from '@paper-ui/core';

// Specialized components
import { SketchButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { PaperInput, PaperCheckbox } from '@paper-ui/components/inputs';
import { SketchDivider } from '@paper-ui/components/decorations';

// Hooks
import {
  useDisclosure,
  useBoolean,
  useClipboard,
  useDebounce,
  useClickOutside,
  useMediaQuery,
  useToggle,
  useLocalStorage,
  useHotkeys
} from '../../../paper-ui/src/hooks';

const meta: Meta = {
  title: 'Hooks/UtilityHooks',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `## Utility Hooks

Reusable React hooks for common UI patterns. Each hook is a standalone composition that manages state, side effects, or browser APIs.

### Hooks
- **useDisclosure** — open/close/toggle state for panels, drawers, and menus
- **useBoolean** — boolean state with \`setTrue\`, \`setFalse\`, and \`toggle\` helpers
- **useClipboard** — clipboard copy with timed feedback
- **useDebounce** — debounced value tracking for search inputs
- **useClickOutside** — click-outside detection via ref
- **useToggle** — toggle between values with optional set
- **useLocalStorage** — persisted state synced to localStorage
- **useMediaQuery** — reactive media query matcher
- **useHotkeys** — global keyboard shortcut bindings`,
      },
    },
  },
};

export default meta;

export const UseDisclosure: StoryObj = {
  name: 'useDisclosure',
  render: () => {
    const { isOpen, open, close, toggle } = useDisclosure();
    return (
      <PaperCard className="p-8 min-w-[400px]">
        <Stack spacing="lg">
          <Flex align="center" justify="between">
            <PaperH3>Project Settings</PaperH3>
            <PaperBadge tone={isOpen ? 'sage' : 'ink'}>
              {isOpen ? 'Editing Mode' : 'View Mode'}
            </PaperBadge>
          </Flex>
          
          <SketchDivider variant="wavy" />
          
          <p className="text-gray-500 font-architect text-sm">
            Toggle the settings panel to configure your preferences.
          </p>

          <Flex gap="md">
            <SketchButton onClick={toggle}>
              {isOpen ? 'Close Settings' : 'Open Settings'}
            </SketchButton>
          </Flex>

          {isOpen && (
            <Box className="p-4 mt-4 bg-[#fffdf9] rounded-md relative">
              <SketchBorder />
              <Stack spacing="md" className="relative z-10">
                <PaperInput label="Project Name" defaultValue="Paper UI Setup" />
                <div className="flex items-center gap-2">
                   <PaperCheckbox defaultChecked />
                   <span className="font-architect text-sm">Enable notifications</span>
                </div>
                <SketchButton onClick={close}>Save Changes</SketchButton>
              </Stack>
            </Box>
          )}
        </Stack>
      </PaperCard>
    );
  }
};

export const UseBoolean: StoryObj = {
  name: 'useBoolean',
  render: () => {
    const [isFocused, { setTrue, setFalse, toggle }] = useBoolean(false);
    return (
      <PaperCard className="p-8 min-w-[400px]">
        <Stack spacing="lg">
          <PaperH4>Focus Mode Tracker</PaperH4>
          
          <Flex gap="sm">
            <SketchButton onClick={setTrue}>Enable Focus</SketchButton>
            <SketchButton onClick={setFalse}>Disable</SketchButton>
            <SketchButton onClick={toggle}>Toggle</SketchButton>
          </Flex>

          <div className="relative mt-4">
            <PaperShadow depth={isFocused ? 3 : 1} />
            <Box className={`p-6 relative z-10 transition-colors duration-300 ${isFocused ? 'bg-blue-50/40' : 'bg-gray-50/40'}`}>
              <SketchBorder />
              <Flex direction="column" align="center" gap="md" className="relative z-10">
                <span className="text-lg font-medium font-kalam">
                  {isFocused ? '🎯 Deep Work in Progress' : '☕ Taking a break'}
                </span>
                <PaperBadge tone={isFocused ? 'sky' : 'ink'}>
                  {isFocused ? 'Active' : 'Inactive'}
                </PaperBadge>
              </Flex>
            </Box>
          </div>
        </Stack>
      </PaperCard>
    );
  }
};

export const UseClipboard: StoryObj = {
  name: 'useClipboard',
  render: () => {
    const { copy, hasCopied } = useClipboard({ timeout: 2000 });
    const codeSnippet = "npm install paper-ui --save";
    
    return (
      <PaperCard className="p-8">
        <Stack spacing="md">
          <PaperH4>Installation</PaperH4>
          <p className="font-architect">Run this command to add Paper UI to your project:</p>
          
          <Flex align="center" gap="sm" className="p-2 bg-gray-100 rounded-sm border border-dashed border-gray-300">
            <span className="font-mono text-sm flex-1">{codeSnippet}</span>
            <SketchButton onClick={() => copy(codeSnippet)}>
              {hasCopied ? 'Copied!' : 'Copy'}
            </SketchButton>
          </Flex>
        </Stack>
      </PaperCard>
    );
  }
};

export const UseDebounce: StoryObj = {
  name: 'useDebounce',
  render: () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    return (
      <PaperCard className="p-8 min-w-[400px]">
        <Stack spacing="lg">
          <PaperH4>Search Library</PaperH4>
          
          <PaperInput 
            placeholder="Type to search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <p className="text-xs text-gray-500 font-architect">Results will update 500ms after you stop typing</p>

          <Box className="p-4 bg-gray-50/40 rounded-md relative">
            <SketchBorder />
            <Stack spacing="sm" className="relative z-10">
              <span className="font-medium font-architect">Search State:</span>
              <Flex justify="between" align="center" className="p-2 bg-[#fffdf9] rounded">
                <span className="text-sm text-gray-500 font-architect">Immediate Value:</span>
                <PaperBadge tone="ink">{searchTerm || 'empty'}</PaperBadge>
              </Flex>
              <Flex justify="between" align="center" className="p-2 bg-[#fffdf9] rounded">
                <span className="text-sm text-gray-500 font-architect">Debounced Value:</span>
                <PaperBadge tone="sky">{debouncedSearch || 'empty'}</PaperBadge>
              </Flex>
            </Stack>
          </Box>
        </Stack>
      </PaperCard>
    );
  }
};

export const UseClickOutside: StoryObj = {
  name: 'useClickOutside',
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    
    useClickOutside(ref, () => setIsOpen(false));

    return (
      <Stack spacing="xl" align="center" className="p-8 min-h-[300px]">
        <p className="text-gray-500 font-architect">Click anywhere outside the dropdown to close it</p>
        
        <Box className="relative">
          <SketchButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close Menu' : 'Open Menu'}
          </SketchButton>

          {isOpen && (
            <Box 
              ref={ref}
              className="absolute top-[110%] left-0 w-[200px] z-10"
            >
              <PaperShadow depth={3} />
              <PaperCard className="p-2 relative z-10">
                <Stack spacing="xs">
                  <div className="p-2 hover:bg-gray-50 cursor-pointer font-architect text-sm">Profile</div>
                  <div className="p-2 hover:bg-gray-50 cursor-pointer font-architect text-sm">Settings</div>
                  <SketchDivider variant="straight" />
                  <div className="p-2 hover:bg-red-50 cursor-pointer font-architect text-sm text-red-600">Logout</div>
                </Stack>
              </PaperCard>
            </Box>
          )}
        </Box>
      </Stack>
    );
  }
};

export const UseToggle: StoryObj = {
  name: 'useToggle',
  render: () => {
    const [value, toggle] = useToggle(false);
    return (
      <PaperCard className="p-8 min-w-[350px]">
        <Stack spacing="lg" align="center">
          <PaperH4>Toggle Theme Settings</PaperH4>
          
          <div className="relative w-full">
            <PaperShadow depth={value ? 2 : 1} />
            <Box className={`p-6 relative z-10 transition-colors duration-300 rounded-md ${value ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'}`}>
              <SketchBorder />
              <Flex direction="column" align="center" gap="md" className="relative z-10">
                <span className="text-xl font-kalam">{value ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
                <SketchButton onClick={() => toggle()}>
                  Toggle Theme
                </SketchButton>
              </Flex>
            </Box>
          </div>
          
          <Flex gap="sm">
            <SketchButton onClick={() => toggle(true)}>Set Dark</SketchButton>
            <SketchButton onClick={() => toggle(false)}>Set Light</SketchButton>
          </Flex>
        </Stack>
      </PaperCard>
    );
  }
};

export const UseLocalStorage: StoryObj = {
  name: 'useLocalStorage',
  render: () => {
    const [name, setName] = useLocalStorage('paper-ui-demo-name', 'Guest');
    
    return (
      <PaperCard className="p-8 min-w-[400px]">
        <Stack spacing="lg">
          <PaperH4>Profile Settings (Persisted)</PaperH4>
          <p className="text-gray-500 font-architect">This value will persist across page reloads.</p>
          
          <div className="relative p-4">
            <SketchBorder />
            <Stack spacing="md" className="relative z-10">
              <Flex align="center" gap="sm">
                <span className="font-bold font-kalam">Hello,</span>
                <PaperBadge tone="sky">{name}</PaperBadge>
              </Flex>
              
              <SketchDivider variant="wavy" />
              
              <PaperInput 
                label="Update Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </Stack>
          </div>
        </Stack>
      </PaperCard>
    );
  }
};

export const UseMediaQuery: StoryObj = {
  name: 'useMediaQuery',
  render: () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    
    return (
      <PaperCard className={`p-8 w-full max-w-[600px] transition-colors duration-300 ${isDesktop ? 'bg-[#f0f9ff]' : 'bg-[#fffdf9]'}`}>
        <Stack spacing="md" align="center">
          <PaperH4 className="text-center font-bold">Responsive Layout Demo</PaperH4>
          <p className="text-center text-gray-500 font-architect text-sm">
            Resize your window to see the hook in action.
          </p>
          
          <Box className="p-6 border-2 border-dashed border-gray-300 rounded-md w-full relative">
            <SketchBorder stroke="#9c9484" strokeWidth={1.4} />
            <Flex 
              direction={isDesktop ? 'row' : 'column'} 
              gap="md" 
              justify="center"
              align="center"
              className="relative z-10"
            >
              <PaperPanel className="p-4 text-center w-[150px]">
                <span className="font-bold font-kalam">Component A</span>
              </PaperPanel>
              
              <span className="text-gray-400 font-architect">
                {isDesktop ? '→' : '↓'}
              </span>
              
              <PaperPanel className="p-4 text-center w-[150px]">
                <span className="font-bold font-kalam">Component B</span>
              </PaperPanel>
            </Flex>
          </Box>
          
          <PaperBadge tone={isDesktop ? "sage" : "ochre"}>
            Current View: {isDesktop ? 'Desktop (Row)' : 'Mobile (Column)'}
          </PaperBadge>
        </Stack>
      </PaperCard>
    );
  }
};

export const UseHotkeys: StoryObj = {
  name: 'useHotkeys',
  render: () => {
    const [logs, setLogs] = React.useState<string[]>([]);
    const addLog = React.useCallback((msg: string) => setLogs((p: string[]) => [...p.slice(-9), msg]), []);

    useHotkeys('?', () => addLog('Pressed ?'));
    useHotkeys('Escape', () => addLog('Pressed Escape'));
    useHotkeys('k', { meta: true }, () => addLog('Pressed Cmd/Ctrl+K'));

    return (
      <PaperCard className="p-8 min-w-[450px]">
        <Stack spacing="lg">
          <PaperH4>Global Hotkeys</PaperH4>
          <p className="text-sm text-ink-muted font-architect">
            Press <kbd className="font-architect text-xs border px-1 rounded">?</kbd>,{' '}
            <kbd className="font-architect text-xs border px-1 rounded">Esc</kbd>, or{' '}
            <kbd className="font-architect text-xs border px-1 rounded">⌘K</kbd>{' '}
            anywhere on the page to trigger callbacks.
          </p>
          <Box className="min-h-[120px] p-4 bg-[#fbfbfb] rounded-md font-mono text-sm overflow-y-auto max-h-[200px]">
            {logs.length === 0
              ? <span className="text-ink-muted/50">No hotkeys pressed yet.</span>
              : logs.map((log: string, i: number) => <Box key={i}>{log}</Box>)}
          </Box>
          <Flex justify="start">
            <SketchButton onClick={() => setLogs([])}>Clear</SketchButton>
          </Flex>
        </Stack>
      </PaperCard>
    );
  }
};
