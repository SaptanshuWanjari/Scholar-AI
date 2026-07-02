import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@paper-ui/components/navigation';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Navigation/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-md">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is this component?</AccordionTrigger>
          <AccordionContent>A collapsible accordion with hand-drawn sketch styling.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I use it?</AccordionTrigger>
          <AccordionContent>Set type to "single" for one open item, or "multiple" for many.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I customize it?</AccordionTrigger>
          <AccordionContent>Yes, pass className or style props to any sub-component.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-md">
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>First Section</AccordionTrigger>
          <AccordionContent>Multiple sections can be open simultaneously.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second Section</AccordionTrigger>
          <AccordionContent>Useful for FAQs or feature lists.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Third Section</AccordionTrigger>
          <AccordionContent>Each accordion item has a wavy sketch divider.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
