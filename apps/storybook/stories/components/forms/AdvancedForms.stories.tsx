import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperCalendar, PaperDatePicker, PaperColorPicker, PaperTagInput, PaperValidationSummary, PaperFieldValidation } from '@paper-ui/components/advancedForms';

const meta = {
  title: 'Components/Forms/AdvancedForms',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Default: StoryObj<typeof PaperCalendar> = {
  render: () => {
    const [date, setDate] = useState<Date>(new Date());
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <PaperCalendar value={date} onChange={setDate} />
      </div>
    );
  },
};

export const ColorPickerVariant: StoryObj<typeof PaperColorPicker> = {
  render: () => {
    const [color, setColor] = useState<string>("#fcd34d");
    return (
      <div className="p-8 bg-[#f4f1ea] w-64 space-y-4">
        <PaperColorPicker label="Theme Color" value={color} onChange={setColor} />
        <PaperColorPicker label="Required Color" value={color} onChange={setColor} error="Choose a color" />
      </div>
    );
  },
};

export const TagInputVariant: StoryObj<typeof PaperTagInput> = {
  render: () => {
    const [tags, setTags] = useState<string[]>(['react', 'paper']);
    return (
      <div className="p-8 bg-[#f4f1ea] w-80">
        <PaperTagInput label="Skills" tags={tags} onChangeTags={setTags} placeholder="Add skill..." />
      </div>
    );
  },
};

export const DatePickerVariant: StoryObj<typeof PaperDatePicker> = {
  render: () => {
    const [date, setDate] = useState<Date>(new Date());
    return (
      <div className="p-8 bg-[#f4f1ea] w-64 space-y-4">
        <PaperDatePicker label="Select Date" value={date} onChange={setDate} />
        <PaperDatePicker label="With Error" value={date} onChange={setDate} error="Date must be future" />
      </div>
    );
  },
};

export const ValidationSummary: StoryObj<typeof PaperValidationSummary> = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-96 space-y-4">
      <PaperValidationSummary
        title="Submission Failed"
        errors={["Email is required", "Password too short", "Username taken"]}
      />
      <div className="space-y-3 mt-6">
        <PaperFieldValidation isValidating message="Checking..." />
        <PaperFieldValidation isValid={true} message="Available!" />
        <PaperFieldValidation isValid={false} message="Already taken." />
      </div>
    </div>
  ),
};
