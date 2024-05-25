import { StoryObj, Meta } from '@storybook/react'
import { TypeHighlighter } from 'json-schema-editor'

const meta: Meta<typeof TypeHighlighter> = {
  component: TypeHighlighter,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    }
  },
}

export default meta

type Story = StoryObj<typeof TypeHighlighter>
export const String: Story = {
  args: {
    type: 'string',
  },
}
