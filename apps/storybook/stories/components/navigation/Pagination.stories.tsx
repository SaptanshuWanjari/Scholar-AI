import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '@paper-ui/components/tables';
import { Box, Stack } from '@paper-ui/components/layout';
import { PaperH2 } from '@paper-ui/core';
import { SketchDivider } from '@paper-ui/components/decorations';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const TableFooter: Story = {
  render: () => {
    const [page, setPage] = useState(3);
    return (
      <Box className="w-full max-w-3xl bg-white p-8">
        <Stack className="gap-4 mb-8">
          <PaperH2>Search Results</PaperH2>
          <SketchDivider variant="wavy" />
          <div className="font-kalam text-lg">Result 1...</div>
          <div className="font-kalam text-lg">Result 2...</div>
          <div className="font-kalam text-lg">Result 3...</div>
          <SketchDivider variant="wavy" />
        </Stack>
        <div className="flex justify-center">
          <Pagination page={page} totalPages={10} onPageChange={setPage} />
        </div>
      </Box>
    );
  }
};
