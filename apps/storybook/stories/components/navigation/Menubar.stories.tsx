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

const meta: Meta<typeof Menubar> = {
  title: 'Components/Navigation/Menubar',
  component: Menubar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New <MenubarShortcut>Cmd N</MenubarShortcut></MenubarItem>
            <MenubarItem>Open <MenubarShortcut>Cmd O</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Save <MenubarShortcut>Cmd S</MenubarShortcut></MenubarItem>
            <MenubarItem disabled>Export as PDF</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo <MenubarShortcut>Cmd Z</MenubarShortcut></MenubarItem>
            <MenubarItem>Redo <MenubarShortcut>Cmd Y</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Cut <MenubarShortcut>Cmd X</MenubarShortcut></MenubarItem>
            <MenubarItem>Copy <MenubarShortcut>Cmd C</MenubarShortcut></MenubarItem>
            <MenubarItem>Paste <MenubarShortcut>Cmd V</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Zoom In <MenubarShortcut>Cmd +</MenubarShortcut></MenubarItem>
            <MenubarItem>Zoom Out <MenubarShortcut>Cmd -</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Full Screen <MenubarShortcut>F11</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  ),
};
