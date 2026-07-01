import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageSwitcher } from '@paper-ui/components/utility';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Components/Utility/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => <div className="p-10 pb-40 bg-[#f4f1ea] flex items-start">{Story()}</div>,
  ],
};
export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

export const Default: Story = {
  args: { languages: LANGUAGES, current: 'en' },
};

export const FrenchSelected: Story = {
  args: { languages: LANGUAGES, current: 'fr' },
};

export const NoNativeNames: Story = {
  args: {
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
    ],
    current: 'en',
  },
};

export const GlobeIcons: Story = {
  render: () => (
    <div className="flex gap-3 items-center">
      <LanguageSwitcher.Globe size={32}>
        <span className="font-architect text-[11px] text-ink-muted ml-0.5">EN</span>
      </LanguageSwitcher.Globe>
      <LanguageSwitcher.Globe size={40}>
        <span className="font-architect text-[13px] text-ink-muted ml-0.5">FR</span>
      </LanguageSwitcher.Globe>
    </div>
  ),
};
