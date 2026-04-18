import type { Meta, StoryObj } from '@storybook/react-vite'

import { sampleAnalysisResponse } from '../../lib/storybook'
import { BestWindowCard } from './BestWindowCard'

const meta = {
  title: 'Dashboard/BestWindowCard',
  component: BestWindowCard,
  args: {
    result: sampleAnalysisResponse,
  },
} satisfies Meta<typeof BestWindowCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
