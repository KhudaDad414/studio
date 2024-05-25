import { StoryObj, Meta } from "@storybook/react"
import { JsonSchemaEditor } from "json-schema-editor"

const meta: Meta<typeof JsonSchemaEditor> = {
  component: JsonSchemaEditor,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
}

export default meta
type Story = StoryObj<typeof JsonSchemaEditor>
export const Default: Story = {
  args: {
    schema: {
      type: "object",
      properties: {
        gender: {
          anyOf: [
            {
              type: "object",
              properties: {
                string: {
                  type: "string",
                },
              },
            },
            {
              type: "object",
              properties: {
                number: {
                  type: "number",
                },
              },
            },
          ],
        },
      },
    },
  },
}
