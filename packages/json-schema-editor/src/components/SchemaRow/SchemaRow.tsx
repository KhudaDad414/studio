import { SchemaNode, isRegularNode } from "@stoplight/json-schema-tree"
import type { ChangeType } from "@stoplight/types"
import last from "lodash/last.js"
import first from "lodash/first.js"
import React from "react"

import { getOriginalNodeId } from "../../hash"
import { isArrayNode, isPropertyRequired, visibleChildren } from "../../tree"
import { getCombiner, getNodeType } from "./useTypes"
import { Separator } from "../ui/separator"
import { JSONSchema } from "../JsonSchemaEditor"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ChevronDownIcon, LinkIcon } from "@asyncapi/studio-ui/icons"
import { FluidInput } from "../ui/fluid-input"
import { TypeHighlighter } from "../TypeHighlighter"
import { RequiredCheckbox } from "../ui/required-checkbox"
import AddProperty from "../AddPropertyButton"
import { cloneDeep, isArray, set, unset, update } from "lodash"
import { isPureObjectNode } from "./TopLevelSchemaRow"
import { cn } from "@asyncapi/studio-utils"
import { Tooltip } from "@asyncapi/studio-ui"
import { useSchemaStore } from '../../state'

const COMBINERS = ["oneOf", "anyOf", "allOf"]
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

export const isReferenceNode = (schemaNode: SchemaNode) => {
  return isRegularNode(schemaNode) && Object.keys(schemaNode.originalFragment).includes("$ref")
}

export function addNewProperty(schema: JSONSchema, schemaNode: SchemaNode) {
  const newPath = [...schemaNode.path]

  if (!isRegularNode(schemaNode)) {
    return schema
  }
  const combiner = getCombiner(schemaNode)
  if (combiner) {
    newPath.push(combiner)
  }

  if (isArrayNode(schemaNode)) {
    newPath.push("items")
  }

  if (isPureObjectNode(schemaNode)) {
    newPath.push("properties", "")
  }

  const salt = Math.random().toString(36).substring(7)
  const defaultValue = {
    type: "string",
    "x-asyncapi": {
      id: getOriginalNodeId(schemaNode, getOriginalNodeId(schemaNode.parent), salt),
    },
  }
  const newSchema = cloneDeep(schema)
  update(newSchema, newPath, (value) => {
    if (isArray(value)) return value.concat(defaultValue)
    else return defaultValue
  })
  return newSchema
}

export const SchemaRow: React.FunctionComponent<SchemaRowProps> = React.memo(
  ({ schemaNode, nestingLevel, parentNodeId, hideTitle }) => {
    const nodeId = getOriginalNodeId(schemaNode, parentNodeId)

    const type = getNodeType(schemaNode)

    const childNodes = React.useMemo(
      () => visibleChildren(schemaNode),
      [schemaNode]
    )
    const isCollapsible = childNodes.length > 0

    const required = isPropertyRequired(schemaNode)

    const {setSchema ,setRequired, renamePropertyKey, schema } = useSchemaStore()

    const handleTitleChange = (value: string) => {
      renamePropertyKey(schemaNode, value)
    }

    const handleRequiredChange = (isChecked: boolean) => {
      setRequired(schemaNode, isChecked)
    }

    const handleNewProperty = () => {
      const changedSchema = addNewProperty(schema, schemaNode)
      setSchema(changedSchema)
    }

    console.log(schemaNode)
    // we return the result here...
    const title = last(schemaNode.subpath)
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
                <div
                  className={cn(
                    "flex gap-2 items-center justify-start grow",
                    isReferenceNode(schemaNode) && "pointer-events-none"
                  )}
                >
                  {!hideTitle && (
                    <FluidInput
                      onValueChange={handleTitleChange}
                      className="text-gray-50 max-w-fit text-xs leading-3"
                      value={title}
                      disabled={isReferenceNode(schemaNode)}
                      autoFocus={title.length === 0}
                      placeholder="name"
                    />
                  )}
                  <TypeHighlighter type={type} />
                  {isReferenceNode(schemaNode) && (
                    <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <LinkIcon className=" h-3 px-1 pointer-events-auto text-gray-500 hover:bg-gray-400 hover:text-gray-800 hover:rounded" />
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        {(schemaNode as any).originalFragment["$ref"]}
                      </Tooltip.Content>
                    </Tooltip.Root>
                    </Tooltip.Provider>
                  )}
                  <RequiredCheckbox checked={required} onCheckedChange={handleRequiredChange} className="ml-auto" />
                </div>
              </div>
              <CollapsibleContent className={isReferenceNode(schemaNode) ? "opacity-50 pointer-events-none" : ""}>
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
                          hideTitle={COMBINERS.includes(type) || COMBINERS.includes(first(childNode.subpath))}
                          schemaNode={childNode}
                          parentNodeId={nodeId}
                          key={getOriginalNodeId(childNode, nodeId)}
                        />
                      )
                    })}
                    {!isReferenceNode(schemaNode) && <AddProperty onClick={handleNewProperty} />}
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
                  placeholder="name"
                  value={title || ""}
                  autoFocus={title?.length === 0}
                  onValueChange={handleTitleChange}
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
