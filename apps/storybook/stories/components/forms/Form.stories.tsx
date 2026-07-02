import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from '@paper-ui/components/form';
import { PaperInput, PaperTextarea, PaperCheckbox } from '@paper-ui/components/inputs';
import { SketchButton } from '@paper-ui/components/buttons';

const meta = {
  title: 'Components/Forms/Form',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Default: StoryObj<typeof Form> = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Form onSubmit={(e) => { e.preventDefault(); }}>
        <Form.Field>
          <Form.Label htmlFor="email" required>Email</Form.Label>
          <PaperInput id="email" type="email" placeholder="you@example.com" />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="password" required>Password</Form.Label>
          <PaperInput id="password" type="password" placeholder="••••••••" />
        </Form.Field>
        <Form.Actions>
          <SketchButton type="submit">Sign In</SketchButton>
        </Form.Actions>
      </Form>
    </div>
  ),
};

export const WithValidation: StoryObj<typeof Form> = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Form onSubmit={(e) => { e.preventDefault(); }}>
        <Form.Field>
          <Form.Label htmlFor="name" required>Full Name</Form.Label>
          <PaperInput id="name" placeholder="Jane Doe" />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="email" required>Email</Form.Label>
          <PaperInput id="email" type="email" placeholder="jane@example.com" error="Invalid email" />
          <Form.Error>Please enter a valid email address</Form.Error>
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="password" required>Password</Form.Label>
          <Form.Description>Min. 8 characters with number</Form.Description>
          <PaperInput id="password" type="password" placeholder="••••••••" error="Too short" />
          <Form.Error>Password must be at least 8 characters</Form.Error>
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="message" optional>Bio</Form.Label>
          <PaperTextarea id="message" placeholder="Tell us about yourself..." />
        </Form.Field>
        <Form.Actions>
          <SketchButton type="submit">Register</SketchButton>
        </Form.Actions>
      </Form>
    </div>
  ),
};
