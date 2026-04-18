import type { Meta, StoryObj } from '@storybook/react-vite'

import { sampleAnalysisResponse } from '../../lib/storybook'
import { SummarySection } from './SummarySection'

const meta = {
  title: 'Dashboard/SummarySection',
  component: SummarySection,
  args: {
    result: sampleAnalysisResponse,
    weatherCode: 'cloudy',
  },
} satisfies Meta<typeof SummarySection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
