import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperCalendar, PaperDatePicker, PaperTimePicker, PaperDateRangePicker, PaperColorPicker, PaperTagInput, PaperTokenInput, PaperFormSection, PaperValidationSummary, PaperFieldValidation } from '@paper-ui/components/advancedForms';
import React, { useState } from 'react';

const meta = {
  title: 'Components/Advanced Forms',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;

export const Calendar: StoryObj = {
  render: () => {
    const [date, setDate] = useState<Date>(new Date());
    return <PaperCalendar value={date} onChange={setDate} />;
  }
};

export const DatePicker: StoryObj = {
  render: () => {
    const [date, setDate] = useState<Date>(new Date());
    return (
      <div className="w-64 space-y-4">
        <PaperDatePicker label="Select Date" value={date} onChange={setDate} />
        <PaperDatePicker label="Date with Error" value={date} onChange={setDate} error="Date must be in future" />
      </div>
    );
  }
};

export const TimePicker: StoryObj = {
  render: () => {
    const [time, setTime] = useState<string>("12:00 PM");
    return (
      <div className="w-64 space-y-4">
        <PaperTimePicker label="Select Time" value={time} onChange={setTime} />
      </div>
    );
  }
};

export const DateRangePicker: StoryObj = {
  render: () => {
    const [range, setRange] = useState<{startDate?: Date, endDate?: Date}>({});
    return (
      <div className="w-80">
        <PaperDateRangePicker label="Event Range" startDate={range.startDate} endDate={range.endDate} onChange={setRange} />
      </div>
    );
  }
};

export const ColorPicker: StoryObj = {
  render: () => {
    const [color, setColor] = useState<string>("#fcd34d");
    return (
      <div className="w-64 space-y-4">
        <PaperColorPicker label="Theme Color" value={color} onChange={setColor} />
        <PaperColorPicker label="Required Color" value={color} onChange={setColor} error="Please choose a primary color" />
      </div>
    );
  }
};

export const TagInput: StoryObj = {
  render: () => {
    const [tags, setTags] = useState<string[]>(['react', 'paper']);
    return (
      <div className="w-80 space-y-4">
        <PaperTagInput label="Skills" tags={tags} onChangeTags={setTags} placeholder="Add a skill..." />
      </div>
    );
  }
};

export const TokenInput: StoryObj = {
  render: () => {
    const allTokens = [
      { id: '1', label: 'Engineering' },
      { id: '2', label: 'Design' },
      { id: '3', label: 'Marketing' },
      { id: '4', label: 'Sales' },
    ];
    const [selected, setSelected] = useState<any[]>([{ id: '1', label: 'Engineering' }]);
    
    return (
      <div className="w-80 space-y-4">
        <PaperTokenInput 
          label="Departments" 
          tokens={allTokens} 
          selectedTokens={selected} 
          onChangeSelected={setSelected} 
        />
      </div>
    );
  }
};

export const FormSections: StoryObj = {
  render: () => {
    return (
      <div className="w-[500px] p-6">
        <PaperFormSection title="Personal Information" description="Please enter your personal details here.">
          <PaperDatePicker label="Birth Date" />
          <PaperTimePicker label="Birth Time" />
        </PaperFormSection>
        <PaperFormSection title="Preferences" description="Customize your experience.">
          <PaperColorPicker label="Favorite Color" />
          <PaperTagInput tags={['reading']} onChangeTags={() => {}} label="Hobbies" />
        </PaperFormSection>
      </div>
    );
  }
};

export const Validation: StoryObj = {
  render: () => {
    return (
      <div className="w-[400px] space-y-4 p-4">
        <PaperValidationSummary 
          title="Submission Failed"
          errors={["Email is required", "Password is too short", "Username must be unique"]} 
        />
        
        <div className="space-y-4 mt-8">
          <div>
            <div className="font-architect text-[15px] mb-1">Username Status</div>
            <PaperFieldValidation isValidating message="Checking availability..." />
          </div>
          <div>
            <PaperFieldValidation isValid={true} message="Username is available!" />
          </div>
          <div>
            <PaperFieldValidation isValid={false} message="Username already taken." />
          </div>
        </div>
      </div>
    );
  }
};
