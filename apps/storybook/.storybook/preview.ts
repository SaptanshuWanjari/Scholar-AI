import type { Preview } from '@storybook/react-vite'
import '../src/storybook.css'

import { themes } from 'storybook/theming'

const preview: Preview = {
  parameters: {
    darkMode: {
      classTarget: 'html',
      darkClass: 'dark',
      stylePreview: false,
      dark: { ...themes.dark, appContentBg: '#1c1b1a' },
      light: { ...themes.normal, appContentBg: '#f6f5f1' }
    },
    backgrounds: {
      disabled: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
