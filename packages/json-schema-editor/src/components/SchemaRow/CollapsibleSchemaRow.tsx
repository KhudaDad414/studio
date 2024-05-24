import { SchemaCombinerName, SchemaNode } from "@stoplight/json-schema-tree"
import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ChevronDownIcon } from "@asyncapi/studio-ui/icons"
import { Separator } from "../ui/separator"
import { SchemaRow } from "./SchemaRow"
import { FluidInput } from "../ui/fluid-input"
import AddProperty from "../AddPropertyButton"
import { RequiredCheckbox } from "../ui/required-checkbox"
import { TypeHighlighter } from "../TypeHighlighter"
import { JSONSchema } from '../JsonSchemaEditor'

export interface CollapsibleSchemaRowProps {
  title: string
  type: string
  isRequired: boolean
  combiner: SchemaCombinerName | null
  hideTitle?: boolean
  schemaNode: SchemaNode
  childNodes: SchemaNode[]
  nodeId: string
  nestingLevel: number
}

export const CollapsibleSchemaRow: React.FunctionComponent<CollapsibleSchemaRowProps> = React.memo(
  ({ title, type, isRequired, childNodes, nestingLevel, nodeId, combiner, hideTitle }) => {
    return (
      <div className="flex flex-col">
        <div className="flex">
          <Separator className="w-2 mt-2" />
          <Collapsible className="flex flex-col grow gap-2" defaultOpen>
            <div className="flex items-center gap-1">
              <CollapsibleTrigger>
                <ChevronDownIcon className="w-3 h-3 text-gray-800 hover:text-gray-500" />
              </CollapsibleTrigger>
              <div className="flex gap-2 items-center justify-start grow">
                {!hideTitle && <FluidInput className="text-gray-50 max-w-fit text-xs leading-3" value={title} />}
                <TypeHighlighter type={combiner || type} />
                <RequiredCheckbox checked={isRequired} className="ml-auto" />
              </div>
            </div>
            <CollapsibleContent>
              <div className="flex grow">
                <div>
                  <Separator orientation="vertical" className="flex-1 ml-1" />
                </div>
                <div className="flex flex-col grow gap-2">
                  {childNodes.map((childNode: SchemaNode) => (
                    <SchemaRow
                      nestingLevel={nestingLevel + 1}
                      hideTitle={!!combiner}
                      schemaNode={childNode}
                      parentNodeId={nodeId}
                      key={childNode.id}
                    />
                  ))}
                  <AddProperty />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    )
  }
)
