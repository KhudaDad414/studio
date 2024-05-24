import { SchemaTree as JsonSchemaTree } from "@stoplight/json-schema-tree"
import * as React from "react"
import { shouldNodeBeIncluded } from "../tree/utils"
import { TopLevelSchemaRow } from "./SchemaRow"
import { defaultResolver } from "../utils/refResolver"
import { JSONSchema4, JSONSchema6, JSONSchema7 } from "json-schema"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs"
import { Separator } from "./ui/separator"
import { useState } from "react"

export type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7

export type JsonSchemaEditorProps = {
  schema: JSONSchema
  onSchemaChange?: (schema: JSONSchema) => void
  className?: string
  maxRefDepth?: number
}

export const SchemaContext = React.createContext({
  schema: {} as JSONSchema,
  onSchemaChange: (schema: JSONSchema) => {},
})

const JsonSchemaEditor: React.FC<JsonSchemaEditorProps> = ({ className, maxRefDepth, ...props }) => {
  const [schema, onSchemaChange] = useState<JSONSchema>(props.schema)

  const schemaChangeHandler = (schema: JSONSchema) => {
    onSchemaChange(schema)
    props.onSchemaChange?.(schema)
  }

  const jsonSchemaTreeRoot = React.useMemo(() => {
    const jsonSchemaTree = new JsonSchemaTree(schema, {
      mergeAllOf: true,
      refResolver: defaultResolver(schema),
      maxRefDepth,
    })

    jsonSchemaTree.walker.hookInto("filter", (node) => {
      return shouldNodeBeIncluded(node)
    })
    jsonSchemaTree.populate()

    return jsonSchemaTree.root
  }, [schema, maxRefDepth])

  return (
    <div className={className}>
      <div>
        <Tabs className="p-4 rounded-xl border border-slate-800 w-[360px]" defaultValue="visual_editor">
          <TabsList>
            <TabsTrigger value="visual_editor">Visual Editor</TabsTrigger>
            <TabsTrigger value="code_editor">Code Editor</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          <Separator className="mb-1" />
          <SchemaContext.Provider value={{ schema, onSchemaChange: schemaChangeHandler }}>
            <TabsContent value="visual_editor">
              <TopLevelSchemaRow schemaNode={jsonSchemaTreeRoot.children[0]} />
            </TabsContent>
            <TabsContent value="code_editor">Code Editor</TabsContent>
            <TabsContent value="examples">Examples</TabsContent>
          </SchemaContext.Provider>
        </Tabs>
        <div className="m-2"></div>
      </div>
    </div>
  )
}

export { JsonSchemaEditor }
