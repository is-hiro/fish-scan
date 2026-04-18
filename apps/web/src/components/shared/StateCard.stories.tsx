import type { Meta, StoryObj } from '@storybook/react-vite'

import { StateCard } from './StateCard'

const meta = {
  title: 'Shared/StateCard',
  component: StateCard,
  args: {
    title: 'Не удалось получить данные',
    description: 'Проверьте название города или попробуйте снова позже.',
  },
} satisfies Meta<typeof StateCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
