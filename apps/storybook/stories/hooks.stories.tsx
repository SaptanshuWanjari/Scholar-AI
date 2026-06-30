import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Layout and Core components
import { Flex, Stack, Box } from '@paper-ui/components/layout';
import { PaperCard } from '@paper-ui/core';
import { SketchBorder } from '@paper-ui/core';
import { PaperShadow } from '@paper-ui/components/paper';

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
  useLocalStorage
} from '../../../../paper-ui/src/hooks';

const meta: Meta = {
  title: 'Hooks/UtilityHooks',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const UseDisclosureStory: StoryObj = {
  name: 'useDisclosure',
  render: () => {
    const { isOpen, open, close, toggle } = useDisclosure();
    return (
      <PaperCard className="p-8 min-w-[400px]">
        <Stack spacing="lg">
          <Flex align="center" justify="between">
            <h3 className="font-serif text-xl font-bold">Project Settings</h3>
            <PaperBadge tone={isOpen ? 'green' : 'gray'}>
              {isOpen ? 'Editing Mode' : 'View Mode'}
            </PaperBadge>
          </Flex>
          
          <SketchDivider variant="wavy" />
          
          <p className="text-gray-500 font-inter">
            Toggle the settings panel to configure your preferences.
          </p>

          <Flex gap="md">
            <SketchButton onClick={toggle}>
              {isOpen ? 'Close Settings' : 'Open Settings'}
            </SketchButton>
          </Flex>

          {isOpen && (
            <Box className="p-4 mt-4 bg-gray-50 rounded-md relative">
              <SketchBorder />
              <Stack spacing="md" className="relative z-10">
                <PaperInput label="Project Name" defaultValue="Paper UI Setup" />
                <div className="flex items-center gap-2">
                   <PaperCheckbox defaultChecked />
                   <span className="font-inter text-sm">Enable notifications</span>
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

export const UseBooleanStory: StoryObj = {
  name: 'useBoolean',
  render: () => {
    const [isFocused, { setTrue, setFalse, toggle }] = useBoolean(false);
    return (
      <PaperCard className="p-8 min-w-[400px]">
        <Stack spacing="lg">
          <h4 className="font-serif text-lg font-bold">Focus Mode Tracker</h4>
          
          <Flex gap="sm">
            <SketchButton onClick={setTrue}>Enable Focus</SketchButton>
            <SketchButton onClick={setFalse}>Disable</SketchButton>
            <SketchButton onClick={toggle}>Toggle</SketchButton>
          </Flex>

          <div className="relative mt-4">
            <PaperShadow depth={isFocused ? 3 : 1} />
            <Box className={`p-6 relative z-10 transition-colors duration-300 ${isFocused ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <Flex direction="column" align="center" gap="md">
                <span className="text-lg font-medium font-inter">
                  {isFocused ? '🎯 Deep Work in Progress' : '☕ Taking a break'}
                </span>
                <PaperBadge tone={isFocused ? 'blue' : 'gray'}>
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

export const UseClipboardStory: StoryObj = {
  name: 'useClipboard',
  render: () => {
    const { copy, hasCopied } = useClipboard({ timeout: 2000 });
    const codeSnippet = "npm install paper-ui --save";
    
    return (
      <PaperCard className="p-8">
        <Stack spacing="md">
          <h4 className="font-serif text-lg font-bold">Installation</h4>
          <p className="font-inter">Run this command to add Paper UI to your project:</p>
          
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

export const UseDebounceStory: StoryObj = {
  name: 'useDebounce',
  render: () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    return (
      <PaperCard className="p-8 min-w-[400px]">
        <Stack spacing="lg">
          <h4 className="font-serif text-lg font-bold">Search Library</h4>
          
          <PaperInput 
            placeholder="Type to search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <p className="text-xs text-gray-500 font-inter">Results will update 500ms after you stop typing</p>

          <Box className="p-4 bg-gray-50 rounded-md">
            <Stack spacing="sm">
              <span className="font-medium font-inter">Search State:</span>
              <Flex justify="between" align="center" className="p-2 bg-white rounded">
                <span className="text-sm text-gray-500 font-inter">Immediate Value:</span>
                <PaperBadge tone="gray">{searchTerm || 'empty'}</PaperBadge>
              </Flex>
              <Flex justify="between" align="center" className="p-2 bg-white rounded">
                <span className="text-sm text-gray-500 font-inter">Debounced Value:</span>
                <PaperBadge tone="blue">{debouncedSearch || 'empty'}</PaperBadge>
              </Flex>
            </Stack>
          </Box>
        </Stack>
      </PaperCard>
    );
  }
};

export const UseClickOutsideStory: StoryObj = {
  name: 'useClickOutside',
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    
    useClickOutside(ref, () => setIsOpen(false));

    return (
      <Stack spacing="xl" align="center" className="p-8 min-h-[300px]">
        <p className="text-gray-500 font-inter">Click anywhere outside the dropdown to close it</p>
        
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
                  <div className="p-2 hover:bg-gray-50 cursor-pointer font-inter text-sm">Profile</div>
                  <div className="p-2 hover:bg-gray-50 cursor-pointer font-inter text-sm">Settings</div>
                  <SketchDivider variant="straight" />
                  <div className="p-2 hover:bg-red-50 cursor-pointer font-inter text-sm text-red-600">Logout</div>
                </Stack>
              </PaperCard>
            </Box>
          )}
        </Box>
      </Stack>
    );
  }
};

export const UseToggleStory: StoryObj = {
  name: 'useToggle',
  render: () => {
    const [value, toggle] = useToggle(false);
    return (
      <PaperCard className="p-8 min-w-[350px]">
        <Stack spacing="lg" align="center">
          <h4 className="font-serif text-lg font-bold">Toggle Theme Settings</h4>
          
          <div className="relative w-full">
            <PaperShadow depth={value ? 2 : 1} />
            <Box className={`p-6 relative z-10 transition-colors duration-300 rounded-md ${value ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'}`}>
              <Flex direction="column" align="center" gap="md">
                <span className="text-xl font-inter">{value ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
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

export const UseLocalStorageStory: StoryObj = {
  name: 'useLocalStorage',
  render: () => {
    const [name, setName] = useLocalStorage('paper-ui-demo-name', 'Guest');
    
    return (
      <PaperCard className="p-8 min-w-[400px]">
        <Stack spacing="lg">
          <h4 className="font-serif text-lg font-bold">Profile Settings (Persisted)</h4>
          <p className="text-gray-500 font-inter">This value will persist across page reloads.</p>
          
          <div className="relative p-4">
            <SketchBorder />
            <Stack spacing="md" className="relative z-10">
              <Flex align="center" gap="sm">
                <span className="font-bold font-inter">Hello,</span>
                <PaperBadge tone="blue">{name}</PaperBadge>
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

export const UseMediaQueryStory: StoryObj = {
  name: 'useMediaQuery',
  render: () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    
    return (
      <PaperCard className={`p-8 w-full max-w-[600px] transition-colors duration-300 ${isDesktop ? 'bg-blue-50' : 'bg-gray-50'}`}>
        <Stack spacing="md" align="center">
          <h4 className="font-serif text-lg font-bold">Responsive Layout Demo</h4>
          <p className="text-center text-gray-500 font-inter">
            Resize your window to see the hook in action.
          </p>
          
          <Box className="p-6 border-2 border-dashed border-gray-300 rounded-md w-full">
            <Flex 
              direction={isDesktop ? 'row' : 'column'} 
              gap="md" 
              justify="center"
              align="center"
            >
              <div className="relative w-[150px]">
                <PaperShadow depth={1} />
                <Box className="p-4 bg-white text-center relative z-10">
                  <span className="font-bold font-inter">Component A</span>
                </Box>
              </div>
              
              <span className="text-gray-400">
                {isDesktop ? '→' : '↓'}
              </span>
              
              <div className="relative w-[150px]">
                <PaperShadow depth={1} />
                <Box className="p-4 bg-white text-center relative z-10">
                  <span className="font-bold font-inter">Component B</span>
                </Box>
              </div>
            </Flex>
          </Box>
          
          <PaperBadge tone={isDesktop ? "green" : "orange"}>
            Current View: {isDesktop ? 'Desktop (Row)' : 'Mobile (Column)'}
          </PaperBadge>
        </Stack>
      </PaperCard>
    );
  }
};
