import '../src/index.css'
import '../src/styles/app.css'

import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark-water',
      values: [{ name: 'dark-water', value: '#0b1a2c' }],
    },
  },
}

export default preview
