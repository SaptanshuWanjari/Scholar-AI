import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  PaperInput,
  PaperTextarea,
  PaperSelect,
  PaperCheckbox,
  PaperCheckboxGroup,
  PaperSwitch,
  PaperRadio,
  PaperRadioGroup,
  PaperSlider,
  SketchSearch,
  ShortcutKey,
  PaperLabel,
} from '@paper-ui/components/inputs';
import { Search, User, Lock } from 'lucide-react';

const meta = {
  title: 'Components/Inputs',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const PaperInputExample = () => {
  const [val, setVal] = useState('');
  return (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperInput</h2>
      <div className="flex flex-col gap-5 max-w-sm">
        <PaperInput label="Full Name" placeholder="Ada Lovelace" icon={<User size={14} />} />
        <PaperInput label="Password" type="password" placeholder="••••••••" icon={<Lock size={14} />} />
        <PaperInput
          label="Email"
          placeholder="ada@example.com"
          value={val}
          onChange={e => setVal(e.target.value)}
          hint="We'll never share your email."
        />
        <PaperInput label="With error" placeholder="bad input" error="This field is required." />
        <PaperInput label="Disabled" placeholder="Cannot edit" disabled />
      </div>
    </div>
  );
};

export const PaperTextareaExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">PaperTextarea</h2>
    <div className="max-w-sm space-y-4">
      <PaperTextarea label="Notes" placeholder="Write your notes here…" rows={4} />
      <PaperTextarea label="With hint" hint="Markdown supported." rows={3} />
      <PaperTextarea label="With error" error="Too short." rows={2} />
    </div>
  </div>
);

export const PaperSelectExample = () => {
  const [val, setVal] = useState('');
  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperSelect</h2>
      <div className="max-w-xs space-y-4">
        <PaperSelect
          label="Subject"
          value={val}
          onChange={setVal}
          placeholder="Choose a subject…"
          options={[
            { value: 'math', label: 'Mathematics' },
            { value: 'cs', label: 'Computer Science' },
            { value: 'physics', label: 'Physics' },
            { value: 'history', label: 'History' },
          ]}
        />
        <PaperSelect
          label="Difficulty"
          defaultValue="medium"
          options={[
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ]}
        />
        <PaperSelect
          label="Disabled"
          disabled
          options={[{ value: 'a', label: 'Option A' }]}
        />
      </div>
    </div>
  );
};

export const PaperCheckboxExample = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperCheckbox</h2>
      <div className="space-y-3">
        <PaperCheckbox
          label="Remember me"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
        <PaperCheckbox label="Pre-checked" defaultChecked />
        <PaperCheckbox label="Disabled" disabled />
        <PaperCheckbox label="Disabled checked" disabled defaultChecked />
      </div>

      <h3 className="font-serif text-base font-bold mt-6">CheckboxGroup</h3>
      <PaperCheckboxGroup
        label="Topics"
        options={[
          { value: 'ml', label: 'Machine Learning' },
          { value: 'nlp', label: 'NLP' },
          { value: 'cv', label: 'Computer Vision' },
          { value: 'rl', label: 'Reinforcement Learning', disabled: true },
        ]}
        defaultValue={['ml']}
        onChange={vals => console.log('group:', vals)}
      />
    </div>
  );
};

export const PaperSwitchExample = () => {
  const [on, setOn] = useState(true);
  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperSwitch</h2>
      <div className="space-y-4">
        <PaperSwitch
          label="Notifications"
          checked={on}
          onChange={e => setOn(e.target.checked)}
        />
        <PaperSwitch label="Dark Mode" defaultChecked={false} />
        <PaperSwitch label="Disabled on" checked disabled />
        <PaperSwitch label="Disabled off" checked={false} disabled />
      </div>
    </div>
  );
};

export const PaperRadioExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">PaperRadio & PaperRadioGroup</h2>
    <PaperRadioGroup
      label="Study Mode"
      name="study-mode"
      defaultValue="active"
      options={[
        { value: 'passive', label: 'Passive Reading' },
        { value: 'active', label: 'Active Recall' },
        { value: 'spaced', label: 'Spaced Repetition' },
        { value: 'pomodoro', label: 'Pomodoro (coming soon)', disabled: true },
      ]}
      onChange={val => console.log('mode:', val)}
    />
  </div>
);

export const PaperSliderExample = () => {
  const [val, setVal] = useState(40);
  return (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperSlider</h2>
      <div className="max-w-sm space-y-6">
        <div>
          <PaperLabel className="mb-2 block">Study Duration: {val} min</PaperLabel>
          <PaperSlider min={5} max={120} step={5} value={val} onChange={setVal} />
        </div>
        <div>
          <PaperLabel className="mb-2 block">Confidence Level</PaperLabel>
          <PaperSlider min={0} max={100} defaultValue={60} />
        </div>
        <div>
          <PaperLabel className="mb-2 block">Disabled</PaperLabel>
          <PaperSlider min={0} max={100} value={30} disabled />
        </div>
      </div>
    </div>
  );
};

export const SketchSearchExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">SketchSearch & ShortcutKey</h2>
    <div className="space-y-4">
      <SketchSearch placeholder="Search documents, concepts, sessions…" width={400} />
      <SketchSearch placeholder="No shortcut" shortcut={null} width={320} />
      <div className="flex items-center gap-2 mt-4">
        <span className="font-architect text-sm text-ink-muted">Shortcuts:</span>
        <ShortcutKey>⌘</ShortcutKey>
        <ShortcutKey>K</ShortcutKey>
        <ShortcutKey>Ctrl</ShortcutKey>
        <ShortcutKey>Shift</ShortcutKey>
        <ShortcutKey>P</ShortcutKey>
      </div>
    </div>
  </div>
);
