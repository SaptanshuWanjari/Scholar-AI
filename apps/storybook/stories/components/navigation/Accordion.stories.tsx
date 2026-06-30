import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@paper-ui/components/navigation';
import { Box } from '@paper-ui/components/layout';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Box className="w-full max-w-sm border border-black/10 p-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>Yes, with a hand-crafted paper aesthetic.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Box>
  )
};

export const Multiple: Story = {
  render: () => (
    <Box className="w-full max-w-sm bg-sky-soft p-6">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>First Item</AccordionTrigger>
          <AccordionContent>Content for first item.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second Item</AccordionTrigger>
          <AccordionContent>Content for second item.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Third Item</AccordionTrigger>
          <AccordionContent>Content for third item.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Box>
  )
};
