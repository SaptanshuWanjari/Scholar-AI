import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchFilter } from "@paper-ui/components/search";
import type { SearchFilterOption } from "@paper-ui/components/search";

const meta = {
  title: "Components/Search/SearchFilter",
  component: SearchFilter,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchFilter>;

export default meta;
type Story = StoryObj<typeof SearchFilter>;

const sampleFilters: SearchFilterOption[] = [
  { id: "pdf", label: "PDF" },
  { id: "markdown", label: "Markdown" },
  { id: "video", label: "Video" },
  { id: "slides", label: "Slides" },
  { id: "note", label: "Notes" },
  { id: "quiz", label: "Quizzes" },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState<string[]>([]);
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <SearchFilter
          filters={sampleFilters}
          activeFilters={active}
          onToggle={(id) =>
            setActive((prev) =>
              prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
            )
          }
          onClear={() => setActive([])}
        />
      </div>
    );
  },
};

export const SomeActive: Story = {
  render: () => {
    const [active, setActive] = useState<string[]>(["pdf", "markdown", "slides"]);
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <SearchFilter
          filters={sampleFilters}
          activeFilters={active}
          onToggle={(id) =>
            setActive((prev) =>
              prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
            )
          }
          onClear={() => setActive([])}
        />
      </div>
    );
  },
};

export const AllActive: Story = {
  render: () => {
    const [active, setActive] = useState<string[]>(sampleFilters.map((f) => f.id));
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <SearchFilter
          filters={sampleFilters}
          activeFilters={active}
          onToggle={(id) =>
            setActive((prev) =>
              prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
            )
          }
          onClear={() => setActive([])}
        />
      </div>
    );
  },
};

export const SmallSet: Story = {
  render: () => {
    const [active, setActive] = useState<string[]>(["active"]);
    const smallFilters: SearchFilterOption[] = [
      { id: "active", label: "Active" },
      { id: "archived", label: "Archived" },
      { id: "draft", label: "Draft" },
    ];
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <SearchFilter
          filters={smallFilters}
          activeFilters={active}
          onToggle={(id) =>
            setActive((prev) =>
              prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
            )
          }
        />
      </div>
    );
  },
};
