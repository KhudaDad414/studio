import { getLastPathSegment } from '@stoplight/json';
import { isReferenceNode, isRegularNode, RegularNode, SchemaNodeKind } from '@stoplight/json-schema-tree';
import upperFirst from 'lodash/upperFirst.js';

import { isNonNullable } from '../guards/isNonNullable';
import {
  isComplexArray,
  isPrimitiveArray,
} from '../tree';
import { getApplicableFormats } from './getApplicableFormats';

type PrintNameOptions = {
  shouldUseRefNameFallback?: boolean;
};

export function printName(
  schemaNode: RegularNode,
  { shouldUseRefNameFallback = false }: PrintNameOptions = {},
): string | undefined {

  return printFlattenedName(schemaNode, { shouldUseRefNameFallback });
}

function printFlattenedName(
  schemaNode: RegularNode,
  { shouldUseRefNameFallback = false }: PrintNameOptions,
): string | undefined {
  if (!isNonNullable(schemaNode.children) || schemaNode.children.length === 0) {
    return schemaNode.title ?? (shouldUseRefNameFallback ? getNodeNameFromOriginalRef(schemaNode) : undefined);
  }

  const format = 'array<%s>';

  if (isPrimitiveArray(schemaNode)) {
    const val = schemaNode.children?.reduce((mergedTypes, child) => {
        if (mergedTypes === null) return null;
        if (!isRegularNode(child)) return null;
        if (child.types !== null && child.types.length > 0) {
          for (const type of child.types) {
            if (mergedTypes.includes(type)) continue;
            else {
              mergedTypes.push(type);
            }
          }
        }
        return mergedTypes;
      }, []) ?? null;

    if (val !== null && val.length > 0) {
      return format.replace('%s', val.join(' or '));
    }

    return 'array';
  }

  if (isComplexArray(schemaNode)) {
    const firstChild = schemaNode.children[0];
   if (firstChild.primaryType) {
      return format.replace('%s', firstChild.primaryType);
    }
    
    return 'array';
  }

  return undefined;
}

function getNodeNameFromOriginalRef(node: RegularNode) {
  if (typeof node.originalFragment.$ref === 'string') {
    return upperFirst(getLastPathSegment(node.originalFragment.$ref));
  }
  return undefined;
}
