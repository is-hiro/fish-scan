import type { Meta, StoryObj } from '@storybook/react-vite'

import { HistoryCard } from './HistoryCard'

const meta = {
  title: 'Dashboard/HistoryCard',
  component: HistoryCard,
  args: {
    history: [
      { label: 'Астрахань', createdAt: '2026-04-18T05:55:00.000Z' },
      { label: 'Москва', createdAt: '2026-04-17T19:10:00.000Z' },
      { label: 'Казань', createdAt: '2026-04-16T06:40:00.000Z' },
    ],
  },
} satisfies Meta<typeof HistoryCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
