import { extractPointerFromRef, pointerToPath } from '@stoplight/json';
import { isReferenceNode, isRegularNode, SchemaNode } from '@stoplight/json-schema-tree';
import last from 'lodash/last.js';
import * as React from 'react';

import { isComplexArray, isNonEmptyParentNode } from '../../tree';
import { printName } from '../../utils';


function calculateNodeType(node: SchemaNode, isPlural: boolean): string {
  const primitiveSuffix = isPlural ? 's' : '';
    if (isRegularNode(node)) {
      const realName = printName(node, { shouldUseRefNameFallback: true });
      if (realName) {
        return realName;
      }
      return node.primaryType !== null
        ? node.primaryType + primitiveSuffix
        : String(node.originalFragment.title || 'any');
    }
  if (isReferenceNode(node)) {
    if (node.value) {
      const value = extractPointerFromRef(node.value);
      const lastPiece = !node.error && value ? last(pointerToPath(value)) : null;
      if (typeof lastPiece === 'string') {
        return lastPiece.split('.')[0];
      }
    }
    return '$ref' + primitiveSuffix;
  }

  return 'any';
}

function getType(node: SchemaNode): string {
  return calculateNodeType(node, false)
}

function getArrayType(node: SchemaNode, combiner?: string): string {
  const itemTitle = calculateNodeType(node, true);
  const title = itemTitle !== 'any' ? `array ${combiner ? `(${combiner})` : null} <${itemTitle}>` : 'array';
    return title;
}

/**
 * Enumerates the sub-schema type for a given node.
 *
 * Usually a node has one type. If a node is
 * a oneOf or anyOf combiner, the possible types are the sub-types of the
 * combiner.
 */
export const useNodeTypes = (schemaNode: SchemaNode) => {
  const types: string[] = React.useMemo(() => {
    // handle flattening of arrays that contain oneOfs, same logic as below
    if (
      isComplexArray(schemaNode) &&
      isNonEmptyParentNode(schemaNode.children[0]) &&
      shouldShowChildSelector(schemaNode.children[0])
    ) {
      return schemaNode.children[0].children.map(child =>
        getArrayType(child, schemaNode.children[0].combiners?.[0]),
      );
    }

    // if current node is a combiner, offer its children
    if (isNonEmptyParentNode(schemaNode) && shouldShowChildSelector(schemaNode)) {
      return schemaNode.children.map(getType);
    }
    // regular node, single type
    return [getType(schemaNode)];
  }, [schemaNode]);


  return { types };
};

const shouldShowChildSelector = (schemaNode: SchemaNode) =>
  isNonEmptyParentNode(schemaNode) && ['anyOf', 'oneOf'].includes(schemaNode.combiners?.[0] ?? '');
