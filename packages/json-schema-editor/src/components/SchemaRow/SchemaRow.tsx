import { SchemaNode, isRegularNode } from "@stoplight/json-schema-tree"
import type { ChangeType } from "@stoplight/types"

import last from "lodash/last.js"
import * as React from "react"

import { getOriginalNodeId } from "../../hash"
import { isPropertyRequired, setPropertyRequired, visibleChildren } from "../../tree"
import { useNodeTypes } from "./useTypes"
import { Separator } from "../ui/separator"
import { JSONSchema, SchemaContext } from "../JsonSchemaEditor"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ChevronDownIcon } from "@asyncapi/studio-ui/icons"
import { FluidInput } from "../ui/fluid-input"
import { TypeHighlighter } from "../TypeHighlighter"
import { RequiredCheckbox } from "../ui/required-checkbox"
import AddProperty from "../AddPropertyButton"
import { cloneDeep, set, unset } from "lodash"

export interface SchemaRowProps {
  schemaNode: SchemaNode
  nestingLevel: number
  parentNodeId?: string
  parentChangeType?: ChangeType
  hideTitle?: boolean
}

export function setPropertyTitle(schema: JSONSchema, schemaNode: SchemaNode, newTitle: string) {
 // @ts-ignore originalFragment does exist.
  const currentFragment = cloneDeep(schemaNode.originalFragment)
  unset(schema, schemaNode.path)
  const newPath = [...schemaNode.path.slice(0, -1), newTitle]
  set(schema, newPath, currentFragment)
  return set(cloneDeep(schema), [...newPath, "x-asyncapi", "id"], getOriginalNodeId(schemaNode))
}

export const SchemaRow: React.FunctionComponent<SchemaRowProps> = React.memo(
  ({ schemaNode, nestingLevel, parentNodeId, hideTitle }) => {
    const nodeId = getOriginalNodeId(schemaNode, parentNodeId)

    const { types } = useNodeTypes(schemaNode)

    const childNodes = React.useMemo(
      () => visibleChildren(schemaNode).sort((a, b) => getOriginalNodeId(a).localeCompare(getOriginalNodeId(b))),
      [schemaNode]
    )
    const isCollapsible = childNodes.length > 0

    const required = isPropertyRequired(schemaNode)

    const combiner = isRegularNode(schemaNode) && schemaNode.combiners?.length ? schemaNode.combiners[0] : null

    const { onSchemaChange, schema } = React.useContext(SchemaContext)

    const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
      const changedSchema = setPropertyTitle(schema, schemaNode, e.currentTarget.value)
      onSchemaChange(changedSchema)
    }

    const handleRequiredChange = (isChecked: boolean) => {
      const changedSchema = setPropertyRequired(schema, schemaNode, isChecked)
      onSchemaChange(changedSchema)
    }

    // we return the result here...
    const title = last(schemaNode.subpath) || ""
    const type = types.join("")
    if (isCollapsible) {
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
                  {!hideTitle && (
                    <FluidInput
                      onInput={handleTitleChange}
                      className="text-gray-50 max-w-fit text-xs leading-3"
                      value={title}
                    />
                  )}
                  <TypeHighlighter type={combiner || type} />
                  <RequiredCheckbox checked={required} onCheckedChange={handleRequiredChange} className="ml-auto" />
                </div>
              </div>
              <CollapsibleContent>
                <div className="flex grow">
                  <div>
                    <Separator orientation="vertical" className="flex-1 ml-1" />
                  </div>
                  <div className="flex flex-col grow gap-2">
                    {childNodes.map((childNode: SchemaNode) => {
                      // @ts-ignore
                      return (
                        <SchemaRow
                          nestingLevel={nestingLevel + 1}
                          hideTitle={!!combiner}
                          schemaNode={childNode}
                          parentNodeId={nodeId}
                          key={getOriginalNodeId(childNode, nodeId)}
                        />
                      )
                    })}
                    <AddProperty />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col flex-grow">
          <div className="flex flex-grow">
            <Separator className="w-4 mr-2 mt-2" />
            <div className="flex items-center gap-2 w-full">
              {!hideTitle && (
                <FluidInput
                  className="text-gray-50 max-w-fit text-xs leading-3"
                  value={title}
                  onInput={handleTitleChange}
                />
              )}
              <TypeHighlighter type={type} />
              <RequiredCheckbox checked={required} onCheckedChange={handleRequiredChange} className="ml-auto" />
            </div>
          </div>
        </div>
      )
    }
  }
)
