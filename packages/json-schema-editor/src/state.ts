import { create } from 'zustand'
import { JSONSchema, isReferenceNode } from './components'
import createObj, { getOrder, isOrderedObject, } from '@stoplight/ordered-object-literal'
import { RegularNode, SchemaNode, isRegularNode } from '@stoplight/json-schema-tree'
import * as _ from 'lodash'
import { isArrayNode } from './tree'
import { getOriginalNodeId } from './hash'

interface SchemaState {
  schema: JSONSchema
  setSchema: (schema: JSONSchema) => void
  setRequired: (Node: SchemaNode, required: boolean) => void
  renamePropertyKey: (Node: SchemaNode, newKey: string) => void
}

export const useSchemaStore = create<SchemaState>((set) => ({
  schema: createObj({}),
  setSchema: (schema: Partial<JSONSchema>) => set({ schema: createObj(schema) }),
  setRequired: (schemaNode, required: boolean) => {
    set((state) => {
      const { parent } = schemaNode
      if (parent === null || !isRegularNode(parent) || schemaNode.subpath.length === 0) return { schema: state.schema }
      const { fragment } = parent
      const title = _.last(schemaNode.path)
      const requiredArray = parent.required || []
      const isCurrentlyRequired = requiredArray.includes(title)
      if (required && !isCurrentlyRequired) {
        const newFragment = _.set(fragment, ["required"], [...requiredArray, title])
        return { schema: _.set(_.cloneDeep(state.schema), parent.path, newFragment) }
      } else if (!required && isCurrentlyRequired) {
        const newFragment = _.set(fragment, ["required"], requiredArray.filter((r) => r !== title))
        return { schema: _.set(_.cloneDeep(state.schema), parent.path, newFragment) }
      }
      return { schema: state.schema }
    })},
  renamePropertyKey: (schemaNode: SchemaNode, newKey: string) => set((state) => {
    const changedPath = schemaNode.path.slice(0, -1)
    console.log(changedPath)
    let prevState = _.get(state.schema, changedPath)
    console.log({ prevState })
    try {
      const isOrdered = isOrderedObject(prevState)
      if (!isOrdered) {
        prevState = createObj(prevState)
      }
    } catch (e) {
      return { schema: state.schema }
    }


    const prevOrder = getOrder(prevState)
    const newOrder = prevOrder.map((key) => key === _.last(schemaNode.path) ? newKey : key)
    const nextState = _.cloneDeep(prevState)
    _.unset(nextState, _.last(schemaNode.path))

    // @ts-ignore originalFragment does exist.
    nextState[newKey] = schemaNode.originalFragment
    _.set(nextState, [newKey, "x-asyncapi", "id"], getOriginalNodeId(schemaNode))
    const newSchema = _.set(_.cloneDeep(state.schema), changedPath, createObj(nextState, newOrder))

    return { schema: newSchema }}),
}))
