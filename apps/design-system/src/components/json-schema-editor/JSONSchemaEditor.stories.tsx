import { StoryObj, Meta } from '@storybook/react'
import { JsonSchemaEditor } from 'json-schema-editor'

const meta: Meta<typeof JsonSchemaEditor> = {
  component: JsonSchemaEditor,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    }
  },
}

export default meta
type Story = StoryObj<typeof JsonSchemaEditor>
export const Default: Story = {
  args: {
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Please enter your name',
        },
        age: {
          type: 'number',
          description: 'Please enter your age',
        },
        email: {
          type: 'string',
          description: 'Please enter your email',
        },
        password: {
          type: 'string',
          description: 'Please enter your password',
        },
        address: {
          type: 'object',
          properties: {
            street: {
              type: 'string',
              description: 'Please enter your street',
            },
            city: {
              type: 'string',
              description: 'Please enter your city',
            },
            zip: {
              type: 'string',
              description: 'Please enter your zip',
            },
          },
        },
        hobbies: {
          type: 'array',
          description: 'Please enter your hobbies',
          items: {
            type: 'string',
          },
        },
      },
    }
  },
}
