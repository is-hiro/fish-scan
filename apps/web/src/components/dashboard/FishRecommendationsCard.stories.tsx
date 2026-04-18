import type { Meta, StoryObj } from '@storybook/react-vite'

import { sampleAnalysisResponse } from '../../lib/storybook'
import { FishRecommendationsCard } from './FishRecommendationsCard'

const meta = {
  title: 'Dashboard/FishRecommendationsCard',
  component: FishRecommendationsCard,
  args: {
    result: sampleAnalysisResponse,
  },
} satisfies Meta<typeof FishRecommendationsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
