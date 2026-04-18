import type { Meta, StoryObj } from '@storybook/react-vite'

import { buildRuleCards } from '../../lib/dashboard'
import { sampleAnalysisResponse } from '../../lib/storybook'
import { FactorsCard } from './FactorsCard'

const meta = {
  title: 'Dashboard/FactorsCard',
  component: FactorsCard,
  args: {
    rules: buildRuleCards(sampleAnalysisResponse, 'ru'),
  },
} satisfies Meta<typeof FactorsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
