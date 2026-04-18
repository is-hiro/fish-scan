import type { Meta, StoryObj } from '@storybook/react-vite'

import { sampleAnalysisResponse } from '../../lib/storybook'
import { AiAdviceCard } from './AiAdviceCard'

const meta = {
  title: 'Dashboard/AiAdviceCard',
  component: AiAdviceCard,
  args: {
    aiSummary: sampleAnalysisResponse.aiSummary,
    refreshing: false,
    onRefresh: () => {},
  },
} satisfies Meta<typeof AiAdviceCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Refreshing: Story = {
  args: {
    refreshing: true,
  },
}
