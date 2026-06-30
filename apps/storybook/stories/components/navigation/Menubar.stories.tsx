import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut
} from '@paper-ui/components/navigation';
import { Box, Surface } from '@paper-ui/components/layout';
import { PaperH2, SketchBorder } from '@paper-ui/core';
import { Tape } from '@paper-ui/components/decorations';

const meta: Meta<typeof Menubar> = {
  title: 'Components/Navigation/Menubar',
  component: Menubar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Menubar>;

export const ApplicationMenu: Story = {
  render: () => (
    <Box className="relative w-full max-w-2xl bg-paper p-12 min-h-[400px]">
      <div className="absolute top-0 left-0 w-full h-12 bg-white/50 border-b border-black/10 flex items-center px-4">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Sketch</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>About Sketch</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Preferences <MenubarShortcut>⌘,</MenubarShortcut></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
              <MenubarItem>Open... <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Save <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
              <MenubarItem disabled>Export...</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
              <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Cut <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
              <MenubarItem>Copy <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
              <MenubarItem>Paste <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      
      <div className="mt-12">
        <Surface className="p-8 rotate-1">
          <Tape corner="top-center" />
          <PaperH2>Application Window</PaperH2>
          <p className="font-kalam mt-4 text-ink-muted">The menubar above feels right at home in a paper-styled app.</p>
        </Surface>
      </div>
    </Box>
  )
};
