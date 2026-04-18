import type { Meta, StoryObj } from '@storybook/react-vite'

import { sampleAnalysisResponse } from '../../lib/storybook'
import { CurrentConditionsCard } from './CurrentConditionsCard'

const meta = {
  title: 'Dashboard/CurrentConditionsCard',
  component: CurrentConditionsCard,
  args: {
    result: sampleAnalysisResponse,
  },
} satisfies Meta<typeof CurrentConditionsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
