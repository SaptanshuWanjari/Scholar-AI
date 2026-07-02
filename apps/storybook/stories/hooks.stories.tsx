import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Flex, Stack, Box } from '@paper-ui/components/layout';
import { PaperCard } from '@paper-ui/core';
import { SketchButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { PaperInput } from '@paper-ui/components/inputs';
import {
  useDisclosure, useBoolean, useClipboard, useDebounce,
  useClickOutside, useMediaQuery, useToggle, useHotkeys
} from '../../../paper-ui/src/hooks';

const meta: Meta = {
  title: 'Hooks/UtilityHooks',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;

const Bg = ({ children }: { children: React.ReactNode }) => (
  <div className="p-8 bg-[#f4f1ea]">{children}</div>
);

export const UseDisclosure: StoryObj = {
  render: () => {
    const { isOpen, toggle } = useDisclosure();
    return (
      <Bg>
        <PaperCard className="p-6 max-w-xs">
          <Stack spacing="md">
            <Flex justify="between" align="center">
              <h3 className="font-architect font-bold text-sm">Disclosure</h3>
              <PaperBadge tone={isOpen ? 'sage' : 'ink'}>{isOpen ? 'Open' : 'Closed'}</PaperBadge>
            </Flex>
            <SketchButton onClick={toggle}>Toggle</SketchButton>
          </Stack>
        </PaperCard>
      </Bg>
    );
  }
};

export const UseClipboard: StoryObj = {
  render: () => {
    const { copy, hasCopied } = useClipboard();
    return (
      <Bg>
        <PaperCard className="p-6 max-w-xs">
          <Stack spacing="md">
            <h3 className="font-architect font-bold text-sm">Clipboard</h3>
            <Flex gap="sm" align="center">
              <span className="font-mono text-xs flex-1">npm install</span>
              <SketchButton size="sm" onClick={() => copy('npm install')}>
                {hasCopied ? 'Copied' : 'Copy'}
              </SketchButton>
            </Flex>
          </Stack>
        </PaperCard>
      </Bg>
    );
  }
};

export const UseDebounce: StoryObj = {
  render: () => {
    const [term, setTerm] = React.useState('');
    const debounced = useDebounce(term, 500);
    return (
      <Bg>
        <PaperCard className="p-6 max-w-xs">
          <Stack spacing="md">
            <h3 className="font-architect font-bold text-sm">Debounce</h3>
            <PaperInput placeholder="Type..." value={term} onChange={(e) => setTerm(e.target.value)} />
            <Flex gap="sm" align="center">
              <span className="text-xs text-gray-500 font-architect">Debounced:</span>
              <PaperBadge tone="sky">{debounced || '—'}</PaperBadge>
            </Flex>
          </Stack>
        </PaperCard>
      </Bg>
    );
  }
};

export const UseClickOutside: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    useClickOutside(ref as React.RefObject<HTMLElement>, () => setOpen(false));
    return (
      <Bg>
        <div className="relative inline-block">
          <SketchButton onClick={() => setOpen(!open)}>Menu</SketchButton>
          {open && (
            <PaperCard ref={ref} className="absolute top-14 left-0 w-32 p-2 z-10 text-sm font-architect">
              <div className="p-1 hover:bg-gray-50 cursor-pointer">Profile</div>
              <div className="p-1 hover:bg-gray-50 cursor-pointer">Settings</div>
            </PaperCard>
          )}
        </div>
      </Bg>
    );
  }
};

export const UseToggle: StoryObj = {
  render: () => {
    const [mode, toggle] = useToggle(false);
    return (
      <Bg>
        <PaperCard className="p-6 max-w-xs">
          <Stack spacing="md">
            <h3 className="font-architect font-bold text-sm">Toggle</h3>
            <Flex gap="sm">
              <SketchButton onClick={() => toggle()}>Switch</SketchButton>
              <PaperBadge>{mode ? 'Dark' : 'Light'}</PaperBadge>
            </Flex>
          </Stack>
        </PaperCard>
      </Bg>
    );
  }
};

export const UseMediaQuery: StoryObj = {
  render: () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    return (
      <Bg>
        <PaperCard className="p-6 max-w-sm">
          <Stack spacing="md">
            <h3 className="font-architect font-bold text-sm">Responsive</h3>
            <Flex direction={isDesktop ? 'row' : 'column'} gap="md" align="center">
              <div className="p-3 bg-blue-50 rounded text-xs font-architect">A</div>
              <span className="text-gray-400">{isDesktop ? '→' : '↓'}</span>
              <div className="p-3 bg-blue-50 rounded text-xs font-architect">B</div>
            </Flex>
            <PaperBadge>{isDesktop ? 'Desktop' : 'Mobile'}</PaperBadge>
          </Stack>
        </PaperCard>
      </Bg>
    );
  }
};

