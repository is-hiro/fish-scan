import type { Meta, StoryObj } from '@storybook/react-vite'

import { PageHeader } from './PageHeader'

const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
