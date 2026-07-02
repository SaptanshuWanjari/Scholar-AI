import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FocusRing } from '@paper-ui/components/accessibility';
import { SketchButton } from '@paper-ui/components/buttons';
import { Stack, Flex } from '@paper-ui/components/layout';

const meta: Meta = {
  title: 'Components/Accessibility/FocusRing',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;

export const Target: StoryObj = {
  name: 'FocusRing.Target',
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Stack spacing="lg" align="center">
        <p className="text-sm text-ink-muted font-architect">
          Tab to the button to see the focus ring
        </p>
        <FocusRing>
          <FocusRing.Target tabIndex={0}>
            <SketchButton>Interactive Element</SketchButton>
          </FocusRing.Target>
        </FocusRing>
      </Stack>
    </div>
  )
};

export const MultipleElements: StoryObj = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Flex gap="lg" wrap="wrap" justify="center">
        <FocusRing>
          <FocusRing.Target>
            <SketchButton>Button 1</SketchButton>
          </FocusRing.Target>
        </FocusRing>
        <FocusRing>
          <FocusRing.Target>
            <SketchButton>Button 2</SketchButton>
          </FocusRing.Target>
        </FocusRing>
        <FocusRing>
          <FocusRing.Target>
            <SketchButton>Button 3</SketchButton>
          </FocusRing.Target>
        </FocusRing>
      </Flex>
    </div>
  )
};
