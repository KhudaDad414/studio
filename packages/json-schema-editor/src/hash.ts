import type { SchemaNode } from '@stoplight/json-schema-tree';
// @ts-ignore
import * as fnv from 'fnv-plus';

// for easier debugging the values going into hash
let SKIP_HASHING = false;


const hash = (value: string, skipHashing: boolean = SKIP_HASHING): string => {
  // Never change this, as it would affect how the default stable id is generated, and cause mismatches with whatever
  // we already have stored in our DB etc.
  return skipHashing ? value : fnv.fast1a52hex(value);
};

export const getNodeId = (node: SchemaNode, parentId?: string): string => {
  const nodeId = node.fragment?.['x-asyncapi']?.id;
  if (nodeId) return nodeId;

  const key = node.path[node.path.length - 1];

  return hash(['schema_property', parentId, String(key)].join('-'));
};

export const getOriginalNodeId = (node: SchemaNode, parentId?: string, salt = 'schema_property'): string => {
  // @ts-expect-error originalFragment does exist...
  const originalFragment = node.originalFragment;
  const nodeId = originalFragment?.['x-asyncapi']?.id;

  // json-schema-tree will apply the parent ID to the nodeId by default when the parent is oneOf/anyOf
  //there is no way to disable it, that's why we need to check if the nodeId is different from the parentId
  if (nodeId && nodeId !== parentId) return nodeId;

  const key = node.path[node.path.length - 1];

  return hash([salt, parentId, String(key)].join('-'));
};
