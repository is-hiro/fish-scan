import type { Meta, StoryObj } from '@storybook/react-vite'

import { SearchPanel } from './SearchPanel'

const meta = {
  title: 'Shared/SearchPanel',
  component: SearchPanel,
  args: {
    query: 'Москва',
    loading: false,
    history: ['Астрахань', 'Казань', 'Самара'],
    onQueryChange: () => {},
    onSubmit: () => {},
    onSelectHistory: () => {},
  },
} satisfies Meta<typeof SearchPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    loading: true,
  },
}
