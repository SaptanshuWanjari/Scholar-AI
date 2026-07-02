import type { Preview } from '@storybook/react-vite'
import '../src/storybook.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'paper',
      values: [
        { name: 'paper', value: '#f6f5f1' },
        { name: 'dark', value: '#1c1b1a' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Docs', 'Playground', 'Default', 'Variants', 'States', 'Composition', 'API'],
      },
    },
  },
}

export default preview
