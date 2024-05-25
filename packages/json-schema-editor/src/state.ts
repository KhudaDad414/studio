import { create } from 'zustand'
import { JSONSchema } from './components'

interface SchemaState {
  schema: JSONSchema
  setSchema: (schema: JSONSchema) => void
}

export const useSchemaStore = create<SchemaState>((set) => ({
  schema: {},
  // @ts-ignore
  setSchema: (schema: Partial<JSONSchema>) => set((state) => ({ schema: { ...state.schema, ...schema } })),
}))
