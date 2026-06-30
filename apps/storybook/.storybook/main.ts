// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from '@storybook/react-vite'
import path, { dirname } from 'path';
import { mergeConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['storybook-dark-mode', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const tailwindcss = (await import('@tailwindcss/vite')).default
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@paper-ui/tokens':     path.resolve(__dirname, '../../../paper-ui/src/tokens'),
          '@paper-ui/utils':      path.resolve(__dirname, '../../../paper-ui/src/utils'),
          '@paper-ui/core':       path.resolve(__dirname, '../../../paper-ui/src/core'),
          '@paper-ui/components': path.resolve(__dirname, '../../../paper-ui/src/components'),
        },
      },
    })
  },
}

export default config
