import { isRegularNode, RegularNode, SchemaNode } from '@stoplight/json-schema-tree';
import { ComplexArrayNode, isComplexArray, isNonEmptyParentNode, isPrimitiveArray } from '../../tree';


const getPrimitiveArrayType = (schemaNode: RegularNode) => {

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
  return `array<${val.join(' or ')}>`;
}

return 'array';

}

const getComplexArrayType = (schemaNode: ComplexArrayNode) => {
  const firstChild = schemaNode.children[0];
  if (firstChild.primaryType) {
      return `array<${firstChild.primaryType}>`;
   }
   
   return 'array';
}

export const getCombiner = (schemaNode: SchemaNode) => {
return isNonEmptyParentNode(schemaNode) && schemaNode.combiners?.length ? schemaNode.combiners[0] : null;
}
export const getNodeType = (schemaNode: SchemaNode) => {
  const combiner = getCombiner(schemaNode);
  if (combiner) return combiner
  if (!isRegularNode(schemaNode)) return 'unknown';
  if (isPrimitiveArray(schemaNode)) return getPrimitiveArrayType(schemaNode)
  if (isComplexArray(schemaNode)) return getComplexArrayType(schemaNode)
  
  const regularTypes = schemaNode.types
  if (regularTypes && regularTypes.length > 0) return regularTypes.join(' or ');
  else if(getCombiner(schemaNode.parent)) {
    const { parent } = schemaNode;
    const parentTypes = isRegularNode(parent) ? parent.types : null;
    if(parentTypes && parentTypes.length > 0) return parentTypes.join(' or ');
  }

  return 'unknown';
}
