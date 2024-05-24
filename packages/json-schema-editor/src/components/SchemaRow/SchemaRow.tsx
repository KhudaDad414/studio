import { SchemaNode, isRegularNode } from "@stoplight/json-schema-tree"
import type { ChangeType } from "@stoplight/types"

import last from "lodash/last.js"
import * as React from "react"

import { getNodeId, getOriginalNodeId } from "../../hash"
import { isPropertyRequired, visibleChildren } from "../../tree"
import { useNodeTypes } from "./useTypes"
import { Separator } from "../ui/separator"
import { CollapsibleSchemaRow } from "./CollapsibleSchemaRow"
import { RegularSchemaRow } from "./RegularSchemaRow"
import { JSONSchema } from "../JsonSchemaEditor"

export interface SchemaRowProps {
  schemaNode: SchemaNode
  nestingLevel: number
  parentNodeId?: string
  parentChangeType?: ChangeType
  hideTitle?: boolean
}

export const SchemaRow: React.FunctionComponent<SchemaRowProps> = React.memo(
  ({ schemaNode, nestingLevel, parentNodeId, hideTitle }) => {
    const nodeId = getNodeId(schemaNode, parentNodeId)

    // @ts-expect-error originalFragment does exist...
    const originalNodeId = schemaNode.originalFragment?.$ref ? getOriginalNodeId(schemaNode, parentNodeId) : nodeId

    const { types } = useNodeTypes(schemaNode)

    const childNodes = visibleChildren(schemaNode)
    const isCollapsible = childNodes.length > 0

    const required = isPropertyRequired(schemaNode)

    const combiner = isRegularNode(schemaNode) && schemaNode.combiners?.length ? schemaNode.combiners[0] : null

    // we return the result here...
    const title = last(schemaNode.subpath) || ""
    const type = types.join(" or ")
    if (isCollapsible) {
      return (
        <CollapsibleSchemaRow
          schemaNode={schemaNode}
          title={title}
          hideTitle={hideTitle}
          combiner={combiner}
          type={type}
          isRequired={required}
          childNodes={childNodes}
          nodeId={nodeId}
          nestingLevel={nestingLevel + 1}
        />
      )
    } else {
      return (
        <RegularSchemaRow
          schemaNode={schemaNode}
          title={title}
          hideTitle={hideTitle}
          type={type}
          isRequired={required}
        />
      )
    }
  }
)
