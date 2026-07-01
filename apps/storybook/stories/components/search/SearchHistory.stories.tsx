import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchHistory } from "@paper-ui/components/search";
import type { SearchHistoryItem } from "@paper-ui/components/search";

const meta = {
  title: "Components/Search/SearchHistory",
  component: SearchHistory,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchHistory>;

export default meta;
type Story = StoryObj<typeof SearchHistory>;

const defaultItems: SearchHistoryItem[] = [
  { id: "h1", query: "dynamic programming", timestamp: "2h ago" },
  { id: "h2", query: "deadlock conditions operating systems", timestamp: "Yesterday" },
  { id: "h3", query: "normalization forms database", timestamp: "2d ago" },
  { id: "h4", query: "merge sort recursion tree", timestamp: "3d ago" },
  { id: "h5", query: "Dijkstra's algorithm proof", timestamp: "1w ago" },
  { id: "h6", query: "red-black tree rotations", timestamp: "2w ago" },
];

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(defaultItems);
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <div className="w-[380px]">
          <SearchHistory
            items={items}
            onSelect={(item) => console.log("Selected:", item.query)}
            onRemove={(id) => setItems(items.filter((i) => i.id !== id))}
            onClear={() => setItems([])}
          />
        </div>
      </div>
    );
  },
};

export const Limited: Story = {
  render: () => {
    const [items] = useState(defaultItems);
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <div className="w-[380px]">
          <SearchHistory
            items={items}
            onSelect={(item) => console.log("Selected:", item.query)}
            onRemove={(id) => console.log("Remove:", id)}
            maxItems={3}
          />
        </div>
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="w-[380px]">
        <SearchHistory
          items={[]}
          onSelect={() => {}}
          onRemove={() => {}}
        />
      </div>
    </div>
  ),
};

export const FewItems: Story = {
  render: () => {
    const fewItems: SearchHistoryItem[] = [
      { id: "h1", query: "machine learning basics", timestamp: "Just now" },
    ];
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <div className="w-[380px]">
          <SearchHistory
            items={fewItems}
            onSelect={(item) => console.log("Selected:", item.query)}
            onRemove={(id) => console.log("Remove:", id)}
            onClear={() => console.log("Clear all")}
          />
        </div>
      </div>
    );
  },
};
