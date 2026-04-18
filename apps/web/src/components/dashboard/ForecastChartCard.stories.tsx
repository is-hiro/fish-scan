import type { Meta, StoryObj } from '@storybook/react-vite'

import { sampleAnalysisResponse } from '../../lib/storybook'
import { ForecastChartCard } from './ForecastChartCard'

const meta = {
  title: 'Dashboard/ForecastChartCard',
  component: ForecastChartCard,
  args: {
    result: sampleAnalysisResponse,
    isMobile: false,
  },
} satisfies Meta<typeof ForecastChartCard>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  args: {
    isMobile: true,
  },
}
