import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from '@paper-ui/components/form';
import { PaperInput, PaperTextarea, PaperSelect, PaperCheckbox } from '@paper-ui/components/inputs';
import { PaperButton, SketchButton } from '@paper-ui/components/buttons';

const meta = {
  title: 'Components/Form',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;

const selectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'billing', label: 'Billing' },
];

export const LoginForm: StoryObj = {
  render: () => (
    <Form onSubmit={(e) => { e.preventDefault(); }}>
      <Form.Field>
        <Form.Label htmlFor="username">Username</Form.Label>
        <PaperInput id="username" placeholder="Enter username" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="password">Password</Form.Label>
        <PaperInput id="password" type="password" placeholder="Enter password" />
      </Form.Field>
      <Form.Actions>
        <PaperButton type="reset">Reset</PaperButton>
        <PaperButton type="submit">Submit</PaperButton>
      </Form.Actions>
    </Form>
  ),
};

export const ContactForm: StoryObj = {
  render: () => (
    <Form onSubmit={(e) => { e.preventDefault(); }}>
      <Form.Grid cols={2}>
        <Form.Field>
          <Form.Label htmlFor="name">Full Name</Form.Label>
          <PaperInput id="name" placeholder="Jane Doe" />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="email" required>Email</Form.Label>
          <PaperInput id="email" type="email" placeholder="jane@example.com" />
        </Form.Field>
      </Form.Grid>
      <Form.Field>
        <Form.Label htmlFor="subject">Subject</Form.Label>
        <PaperSelect id="subject" options={selectOptions} defaultValue="general" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="message">Message</Form.Label>
        <Form.Description>Tell us what's on your mind.</Form.Description>
        <PaperTextarea id="message" placeholder="Write your message..." />
      </Form.Field>
      <Form.Field>
        <PaperCheckbox id="subscribe" label="Subscribe to newsletter" />
      </Form.Field>
      <Form.Actions>
        <SketchButton type="submit">Send Message</SketchButton>
      </Form.Actions>
    </Form>
  ),
};

export const FormWithSections: StoryObj = {
  render: () => (
    <Form onSubmit={(e) => { e.preventDefault(); }}>
      <Form.Section title="Personal Information" description="Basic details about you">
        <Form.Grid cols={2}>
          <Form.Field>
            <Form.Label htmlFor="firstName">First Name</Form.Label>
            <PaperInput id="firstName" placeholder="Jane" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="lastName">Last Name</Form.Label>
            <PaperInput id="lastName" placeholder="Doe" />
          </Form.Field>
        </Form.Grid>
        <Form.Field>
          <Form.Label htmlFor="bio">Bio</Form.Label>
          <Form.Description>Write a short bio about yourself.</Form.Description>
          <PaperTextarea id="bio" placeholder="I am a..." />
        </Form.Field>
      </Form.Section>

      <Form.Section title="Account Details" description="Your login and security settings">
        <Form.Grid cols={2}>
          <Form.Field>
            <Form.Label htmlFor="accEmail" required>Email</Form.Label>
            <PaperInput id="accEmail" type="email" placeholder="jane@example.com" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="username2">Username</Form.Label>
            <Form.Description>Pick a unique username.</Form.Description>
            <PaperInput id="username2" placeholder="janedoe" />
          </Form.Field>
        </Form.Grid>
        <Form.Field>
          <Form.Label htmlFor="password2" required>Password</Form.Label>
          <PaperInput id="password2" type="password" placeholder="Min. 8 characters" />
        </Form.Field>
      </Form.Section>

      <Form.Actions>
        <PaperButton type="reset">Cancel</PaperButton>
        <SketchButton type="submit">Save Profile</SketchButton>
      </Form.Actions>
    </Form>
  ),
};

export const FormValidation: StoryObj = {
  render: () => (
    <Form onSubmit={(e) => { e.preventDefault(); }}>
      <Form.Field>
        <Form.Label htmlFor="valName" required>Full Name</Form.Label>
        <PaperInput id="valName" placeholder="Jane Doe" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="valEmail" required>Email</Form.Label>
        <PaperInput id="valEmail" type="email" placeholder="jane@example.com" error="Please enter a valid email" />
        <Form.Error>Please enter a valid email address</Form.Error>
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="valPass" required>Password</Form.Label>
        <Form.Description>Must be at least 8 characters with a number.</Form.Description>
        <PaperInput id="valPass" type="password" placeholder="Password" error="Password is too short" />
        <Form.Error>Password must be at least 8 characters</Form.Error>
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="valConfirm" required>Confirm Password</Form.Label>
        <PaperInput id="valConfirm" type="password" placeholder="Confirm password" error="Passwords do not match" />
        <Form.Error>Passwords do not match</Form.Error>
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="valBio" optional>Bio</Form.Label>
        <Form.Description>Tell us about yourself.</Form.Description>
        <PaperTextarea id="valBio" placeholder="I am..." />
      </Form.Field>
      <Form.Actions>
        <SketchButton type="submit">Register</SketchButton>
      </Form.Actions>
    </Form>
  ),
};

export const DoodleFormGallery: StoryObj = {
  render: () => (
    <div className="bg-[#f4f1ea] min-h-screen p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="rotate-[-1.5deg]">
        <Form onSubmit={(e) => { e.preventDefault(); }} surface="#fffdf9">
          <h2 className="font-caveat text-[22px] text-ink mb-4">Sign In</h2>
          <Form.Field>
            <Form.Label htmlFor="gEmail" required>Email</Form.Label>
            <PaperInput id="gEmail" type="email" placeholder="you@example.com" />
            <Form.Error>Invalid email format</Form.Error>
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="gPass" required>Password</Form.Label>
            <PaperInput id="gPass" type="password" placeholder="••••••••" />
          </Form.Field>
          <Form.Actions>
            <SketchButton type="submit">Sign In</SketchButton>
          </Form.Actions>
        </Form>
      </div>

      <div className="rotate-[1.2deg]">
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <h2 className="font-caveat text-[22px] text-ink mb-4">Contact Us</h2>
          <Form.Field>
            <Form.Label htmlFor="gName">Name</Form.Label>
            <PaperInput id="gName" placeholder="Your name" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="gMsg" required>Message</Form.Label>
            <Form.Description>We read every message.</Form.Description>
            <PaperTextarea id="gMsg" placeholder="Write here..." />
          </Form.Field>
          <Form.Actions>
            <PaperButton type="reset">Clear</PaperButton>
            <SketchButton type="submit">Send</SketchButton>
          </Form.Actions>
        </Form>
      </div>

      <div className="rotate-[0.8deg]">
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Form.Section title="Preferences" description="Customize your experience">
            <Form.Field>
              <Form.Label htmlFor="gLang">Language</Form.Label>
              <PaperSelect id="gLang" options={[
                { value: 'en', label: 'English' },
                { value: 'fr', label: 'French' },
                { value: 'es', label: 'Spanish' },
              ]} defaultValue="en" />
            </Form.Field>
            <Form.Field>
              <PaperCheckbox id="gNews" label="Receive newsletter" />
            </Form.Field>
            <Form.Field>
              <PaperCheckbox id="gBeta" label="Opt into beta features" />
            </Form.Field>
          </Form.Section>
          <Form.Actions>
            <SketchButton type="submit">Save Preferences</SketchButton>
          </Form.Actions>
        </Form>
      </div>

      <div className="rotate-[-0.6deg]">
        <Form onSubmit={(e) => { e.preventDefault(); }} surface="#faf9f5">
          <h2 className="font-caveat text-[22px] text-ink mb-4">Feedback</h2>
          <Form.Grid cols={2}>
            <Form.Field>
              <Form.Label htmlFor="gRate" required>Rating</Form.Label>
              <PaperSelect id="gRate" options={[
                { value: '5', label: '★★★★★' },
                { value: '4', label: '★★★★☆' },
                { value: '3', label: '★★★☆☆' },
              ]} defaultValue="5" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="gCat">Category</Form.Label>
              <PaperSelect id="gCat" options={selectOptions} defaultValue="general" />
            </Form.Field>
          </Form.Grid>
          <Form.Field>
            <Form.Label htmlFor="gComment" required>Comments</Form.Label>
            <Form.Description>Your feedback helps us improve.</Form.Description>
            <PaperTextarea id="gComment" placeholder="Share your thoughts..." />
          </Form.Field>
          <Form.Actions>
            <SketchButton type="submit">Submit Feedback</SketchButton>
          </Form.Actions>
        </Form>
      </div>
    </div>
  ),
};
