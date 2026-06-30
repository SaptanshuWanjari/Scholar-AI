import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaperDrawer } from "@paper-ui/components/dialogs";
import { Box } from "@paper-ui/components/layout";

const meta: Meta<typeof PaperDrawer> = {
  title: "Components/Dialogs/Drawer",
  component: PaperDrawer,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof PaperDrawer>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-white border border-black/20 rounded font-kalam"
        >
          Right Drawer
        </button>
        <PaperDrawer
          open={open}
          onClose={() => setOpen(false)}
          title="Notes"
          side="right"
        >
          <p className="font-inter text-ink">
            Here is some extra content from the right side.
          </p>
        </PaperDrawer>
      </Box>
    );
  },
};

export const TopSide: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Box>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-white border border-black/20 rounded font-kalam"
        >
          Top Drawer
        </button>

        <PaperDrawer
          open={open}
          onClose={() => setOpen(false)}
          title="Menu"
          side="top"
          height={280}
        >
          <div className="flex flex-col gap-4 font-architect">
            <span>Home</span>
            <span>Profile</span>
            <span>Settings</span>
          </div>
        </PaperDrawer>
      </Box>
    );
  },
};

export const BottomSide: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Box>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-white border border-black/20 rounded font-kalam"
        >
          Bottom Drawer
        </button>

        <PaperDrawer
          open={open}
          onClose={() => setOpen(false)}
          title="Menu"
          side="bottom"
          height={280}
        >
          <div className="flex flex-col gap-4 font-architect">
            <span>Home</span>
            <span>Profile</span>
            <span>Settings</span>
          </div>
        </PaperDrawer>
      </Box>
    );
  },
};

export const LeftSide: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-sky-soft border border-black/20 rounded font-kalam"
        >
          Left Drawer
        </button>
        <PaperDrawer
          open={open}
          onClose={() => setOpen(false)}
          title="Menu"
          side="left"
        >
          <div className="flex flex-col gap-4 font-architect">
            <span>Home</span>
            <span>Profile</span>
            <span>Settings</span>
          </div>
        </PaperDrawer>
      </Box>
    );
  },
};
