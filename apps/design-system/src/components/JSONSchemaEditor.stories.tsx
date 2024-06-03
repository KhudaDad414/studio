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
export const SimpleObject: Story = {
  args: {
    schema: {
      "type": "object",
    }
  }
}

export const ObjectWithProperties: Story = {
  args: {
    schema: {
      "type": "object",
      "properties": {
        "stringProp": { "type": "string" },
        "numberProp": { "type": "number" },
        "booleanProp": { "type": "boolean" },
      },
    },
  },
};

export const SimpleString: Story = {
  args: {
    schema: {
      "type": "string",
    },
  },
};



export const ArrayOfStrings: Story = {
  args: {
    schema: {
      "type": "array",
      "items": {
        "type": "string",
      },
    },
  },
};

export const OneOfCombiner: Story = {
  args: {
    schema: {
      "oneOf": [
        { "type": "string" },
        { "type": "number" },
      ],
    },
  },
};

OneOfCombiner.storyName = "OneOf Combiner";

export const AnyOfCombiner: Story = {
  args: {
    schema: {
      "anyOf": [
        { "type": "string" },
        { "type": "boolean" },
      ],
    },
  },
};

AnyOfCombiner.storyName = "AnyOf Combiner";

export const AllOfCombiner: Story = {
  args: {
    schema: {
      "allOf": [
        { "type": "string" },
        { "minLength": 5 },
      ],
    },
  },
};

AllOfCombiner.storyName = "AllOf Combiner";

export const NormalReference: Story = {
  args: {
    schema: {
      type: "object",
      properties: {
        address: {
          "$ref": "#/definitions/address"
        }
      },
      "definitions": {
        "address": {
          "type": "object",
          "properties": {
            "street": { "type": "string" },
            "city": { "type": "string" },
          },
        },
      },
    },
  },
};

export const CircularReference: Story = {
  args: {
    schema: {
      "definitions": {
        "person": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "partner": { "$ref": "#/definitions/person" },
          },
        },
      },
      "$ref": "#/definitions/person",
    },
  },
};

export const NestedObjects: Story = {
  args: {
    schema: {
      "type": "object",
      "properties": {
        "address": {
          "type": "object",
          "properties": {
            "street": { "type": "string" },
            "city": { "type": "string" },
          },
        },
      },
    },
  },
};

export const RequiredFields: Story = {
  args: {
    schema: {
      "type": "object",
      "required": ["name", "email"],
      "properties": {
        "name": { "type": "string" },
        "email": { "type": "string" },
        "age": { "type": "number" },
      },
    },
  },
};

export const ArrayOfObjects: Story = {
  args: {
    schema: {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "age": { "type": "number" },
        },
      },
    },
  },
};
