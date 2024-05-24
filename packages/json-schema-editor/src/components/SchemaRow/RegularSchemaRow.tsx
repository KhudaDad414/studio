import * as React from "react"
import { FluidInput } from "../ui/fluid-input"
import { RequiredCheckbox } from "../ui/required-checkbox"
import { TypeHighlighter } from "../TypeHighlighter"
import { Separator } from '../ui/separator'
import { JSONSchema, SchemaContext } from '../JsonSchemaEditor'
import { SchemaNode } from '@stoplight/json-schema-tree'

export interface RegularSchemaRowProps {
  title: string
  type: string
  schemaNode: SchemaNode
  isRequired: boolean
  hideTitle?: boolean
}



export const RegularSchemaRow: React.FunctionComponent<RegularSchemaRowProps> = React.memo(
  ({ title, type, isRequired, hideTitle, schemaNode  }) => {
    const { onSchemaChange, schema } = React.useContext(SchemaContext)

    const handleRequiredChange = (isChecked: boolean) => {
      console.log('handleRequiredChange ', isChecked)
    }



    return (
      <div className="flex flex-col flex-grow">
        <div className="flex flex-grow">
          <Separator className="w-4 mr-2 mt-2" />
          <div className="flex items-center gap-2 w-full">
            {!hideTitle && <FluidInput className="text-gray-50 max-w-fit text-xs leading-3" value={title} />}
            <TypeHighlighter type={type} />
            <RequiredCheckbox checked={isRequired} onCheckedChange={handleRequiredChange} className="ml-auto" />
          </div>
        </div>
      </div>
    )
  }
)
