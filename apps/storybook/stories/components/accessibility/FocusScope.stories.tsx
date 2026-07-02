import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FocusScope } from '@paper-ui/components/accessibility';
import { SketchButton } from '@paper-ui/components/buttons';
import { PaperInput } from '@paper-ui/components/inputs';
import { Stack, Box } from '@paper-ui/components/layout';

const meta: Meta = {
  title: 'Components/Accessibility/FocusScope',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;

export const Child: StoryObj = {
  name: 'FocusScope.Child',
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <FocusScope trapped autoFocus>
        <Box className="p-6 bg-white border border-gray-300 rounded-md">
          <Stack spacing="md">
            <h3 className="font-architect font-bold">Dialog Example</h3>
            <p className="text-sm text-ink-muted font-architect">
              Tab is trapped inside this modal. The first element auto-focuses.
            </p>
            <FocusScope.Child>
              <PaperInput placeholder="First input (auto-focused)" />
            </FocusScope.Child>
            <FocusScope.Child>
              <PaperInput placeholder="Second input" />
            </FocusScope.Child>
            <div className="flex gap-2 pt-2">
              <SketchButton>Cancel</SketchButton>
              <SketchButton>Confirm</SketchButton>
            </div>
          </Stack>
        </Box>
      </FocusScope>
    </div>
  )
};

export const TrappedFocus: StoryObj = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <FocusScope trapped>
        <Box className="p-6 bg-white border border-gray-300 rounded-md max-w-sm">
          <Stack spacing="lg">
            <h3 className="font-architect font-bold">Trapped Focus</h3>
            <SketchButton>First</SketchButton>
            <SketchButton>Second</SketchButton>
            <SketchButton>Last (Tab cycles back to First)</SketchButton>
          </Stack>
        </Box>
      </FocusScope>
    </div>
  )
};
