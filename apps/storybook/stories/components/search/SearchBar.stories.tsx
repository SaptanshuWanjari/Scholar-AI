import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchBar } from "@paper-ui/components/search";
import { Search } from "lucide-react";

const meta = {
  title: "Components/Search/SearchBar",
  component: SearchBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="flex justify-center p-10 bg-[#f4f1ea]">
        <SearchBar width={420}>
          <SearchBar.Icon />
          <SearchBar.Input
            placeholder="Search courses, notes, flashcards..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <SearchBar.Clear visible={value.length > 0} onClick={() => setValue("")} />
          <SearchBar.Shortcut>
            <span className="text-[13px]">⌘</span>K
          </SearchBar.Shortcut>
        </SearchBar>
      </div>
    );
  },
};

export const WithFilter: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    return (
      <div className="flex justify-center p-10 bg-[#f4f1ea]">
        <SearchBar width={520}>
          <SearchBar.Icon />
          <SearchBar.Input
            placeholder="Search documents..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <SearchBar.Clear visible={value.length > 0} onClick={() => setValue("")} />
          <SearchBar.FilterToggle active={filterOpen} onClick={() => setFilterOpen(!filterOpen)} />
          <SearchBar.Shortcut>
            <span className="text-[13px]">⌘</span>F
          </SearchBar.Shortcut>
        </SearchBar>
      </div>
    );
  },
};

export const Narrow: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="flex justify-center p-10 bg-[#f4f1ea]">
        <SearchBar width={260}>
          <SearchBar.Icon>
            <Search size={15} />
          </SearchBar.Icon>
          <SearchBar.Input
            placeholder="Quick search..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <SearchBar.Clear visible={value.length > 0} onClick={() => setValue("")} />
        </SearchBar>
      </div>
    );
  },
};
