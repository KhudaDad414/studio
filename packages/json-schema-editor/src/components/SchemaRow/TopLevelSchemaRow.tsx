import { isRegularNode, RegularNode, SchemaNode } from "@stoplight/json-schema-tree"
import * as React from "react"

import { isDictionaryNode, visibleChildren } from "../../tree"
import { ChevronDownIcon } from "@asyncapi/studio-ui/icons"
import { SchemaRow, SchemaRowProps } from "./SchemaRow"
import { useNodeTypes } from "./useTypes"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { Separator } from "../ui/separator"
import AddProperty from "../AddPropertyButton"
import { TypeHighlighter } from "../TypeHighlighter"
import { getOriginalNodeId } from "../../hash"

const nestingLevel = 0
export const TopLevelSchemaRow = ({ schemaNode }: { schemaNode: SchemaNode }) => {
  console.log(schemaNode)
  const { types } = useNodeTypes(schemaNode)
  const childNodes = React.useMemo(
    () => visibleChildren(schemaNode).sort((a, b) => getOriginalNodeId(a).localeCompare(getOriginalNodeId(b))),
    [schemaNode]
  )
  const nodeId = schemaNode.fragment?.["x-asyncapi"]?.id
  // regular objects are flattened at the top level
  if (isRegularNode(schemaNode) && isPureObjectNode(schemaNode)) {
    return (
      <Collapsible className="flex flex-col justify-start grow gap-2" defaultOpen>
        <div className="flex items-center justify-start gap-1">
          <CollapsibleTrigger className="flex items-center">
            <ChevronDownIcon className="w-3 h-3 text-gray-800 hover:text-gray-500" />
          </CollapsibleTrigger>
          <TypeHighlighter type={types[0]} />
        </div>
        <CollapsibleContent>
          <div className="flex grow text-xs leading-3">
            <div>
              <Separator orientation="vertical" className="flex-1 ml-1" />
            </div>
            <div className="flex flex-col grow gap-2">
              {childNodes.length > 0 &&
                childNodes.map((childNode: SchemaNode) => {
                  return (
                    <SchemaRow
                      nestingLevel={nestingLevel + 1}
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
    )
  }

  if (isRegularNode(schemaNode) && types.length > 1) {
    const combiner = isRegularNode(schemaNode) && schemaNode.combiners?.length ? schemaNode.combiners[0] : null

    return (
      <Collapsible className="flex flex-col grow justify-start gap-2" defaultOpen>
        <div className="flex items-center gap-1">
          <CollapsibleTrigger className="flex items-center">
            <ChevronDownIcon className="w-3 h-3 text-gray-800 hover:text-gray-500" />
          </CollapsibleTrigger>
          <TypeHighlighter type={combiner || "unknown"} />
        </div>
        <CollapsibleContent>
          <div className="flex grow text-xs leading-3">
            <div>
              <Separator orientation="vertical" className="flex-1 ml-1" />
            </div>
            <div className="flex flex-col grow gap-2">
              {childNodes.length > 0 &&
                childNodes.map((childNode: SchemaNode) => (
                  <SchemaRow
                    nestingLevel={nestingLevel + 1}
                    hideTitle={true}
                    schemaNode={childNode}
                    parentNodeId={nodeId}
                    key={getOriginalNodeId(childNode, nodeId)}
                  />
                ))}
              <AddProperty />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <>
      <SchemaRow schemaNode={schemaNode} nestingLevel={0} />
    </>
  )
}

function isPureObjectNode(schemaNode: RegularNode) {
  return schemaNode.primaryType === "object" && schemaNode.types?.length === 1 && !isDictionaryNode(schemaNode)
}
