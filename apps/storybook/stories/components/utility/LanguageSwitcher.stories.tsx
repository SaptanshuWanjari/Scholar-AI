import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LanguageSwitcher } from '@paper-ui/components/utility'

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Components/Utility/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof LanguageSwitcher>

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
]

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-start pb-40">
      <LanguageSwitcher languages={LANGUAGES} current="en" />
    </div>
  ),
}

export const Default: Story = {
  args: { languages: LANGUAGES, current: 'en' },
}

export const WithNativeNames: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-start pb-40">
      <LanguageSwitcher languages={LANGUAGES} current="fr" />
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <div className="flex gap-2">
        <LanguageSwitcher.Globe size={32}>
          <span className="font-architect text-[11px] text-ink-muted ml-0.5">EN</span>
        </LanguageSwitcher.Globe>
        <LanguageSwitcher.Globe size={40}>
          <span className="font-architect text-[13px] text-ink-muted ml-0.5">FR</span>
        </LanguageSwitcher.Globe>
      </div>
      <LanguageSwitcher.Menu>
        {LANGUAGES.slice(0, 3).map((lang) => (
          <LanguageSwitcher.Option key={lang.code} active={lang.code === 'en'}>
            <span>{lang.nativeName}</span>
          </LanguageSwitcher.Option>
        ))}
      </LanguageSwitcher.Menu>
    </div>
  ),
}
