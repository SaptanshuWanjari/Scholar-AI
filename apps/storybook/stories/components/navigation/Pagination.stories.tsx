import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '@paper-ui/components/tables';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(3);
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <Pagination page={page} totalPages={10} onPageChange={setPage} />
      </div>
    );
  },
};

export const Compact: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <Pagination
          page={page}
          totalPages={5}
          onPageChange={setPage}
          showEdges={true}
        />
      </div>
    );
  },
};
