/*! betterCommerceStorefront | Ⓒ 2022, Axtrum Solutions.
//@ Class: SchemaUtil
//@ Inherits: <None>
//@ Implements: <None>
//@ Description: Utility class for schema operations.
*/

/**
 * Merges schema(s).
 * @param schemas
 * @returns
 */
export const mergeSchema = (...schemas: any) => {
  const [first, ...rest] = schemas

  const merged = rest.reduce(
    (mergedSchemas: any, schema: any) => mergedSchemas.concat(schema),
    first
  )

  return merged
}
