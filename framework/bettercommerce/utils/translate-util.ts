import { EmptyObject } from "@components/utils/constants";

/**
 * Maps properties from the source object to the target object based on the mapping object.
 * The mapping object should have the same property names as the target object, and the
 * value should be either a function or a string. If the value is a function, the function
 * will be called with the source object as the argument. If the value is a string, the
 * string will be used to access the nested properties of the source object. If the string
 * contains a dot, the dot will be used to split the string into multiple nested properties.
 * For example, if the mapping value is "address.street", the value of the source object's
 * "address" property and then the value of the resulting object's "street" property will
 * be used as the value of the target object's property.
 * @param {Object} source The source object.
 * @param {Object} mapping The mapping object.
 * @returns {Object} The target object.
 * 
 * @usage
 * 
 * =================================================================================================
 * Example 1: To handle collections (arrays) and nested objects inside the source object dynamically
 * =================================================================================================
 * 
 * Input Object with Collections:
 * ------------------------------
 * const source = { firstName: 'John', lastName: 'Doe', age: 25,
 *   address: { city: 'New York', zipCode: '10001' },
 *   hobbies: [ { name: 'Reading', level: 'Intermediate' }, { name: 'Gaming', level: 'Expert' } ],
 *   family: [ { relation: 'Spouse', name: 'Jane Doe' }, { relation: 'Child', name: 'Johnny Doe' } ]
 * }
 * 
 * 
 * Mapping Configuration for Collections and Nested Objects:
 * ---------------------------------------------------------
 * const mapping = {
 *   fullName: source => `${source.firstName} ${source.lastName}`,
 *   city: 'address.city',
 *   postalCode: 'address.zipCode',
 *   age: 'age',
 *   hobbies: source => source.hobbies.map(hobby => hobby.name),
 *   familyMembers: source => source.family.map(member => `${member.relation}: ${member.name}`)
 * }
 * 
 * Output:
 * -------
 * {
 *   fullName: 'John Doe', city: 'New York', postalCode: '10001', age: 25,
 *   hobbies: ['Reading', 'Gaming'],
 *   familyMembers: ['Spouse: Jane Doe', 'Child: Johnny Doe']
 * }
 * 
 * ================================================================
 * Example 2: To extract only the first family member in the output
 * ================================================================
 * 
 * Input Object with Collections:
 * ------------------------------
 * const source = { firstName: 'John', lastName: 'Doe', age: 25,
 *   address: { city: 'New York', zipCode: '10001' },
 *   hobbies: [ { name: 'Reading', level: 'Intermediate' }, { name: 'Gaming', level: 'Expert' } ],
 *   family: [ { relation: 'Spouse', name: 'Jane Doe' }, { relation: 'Child', name: 'Johnny Doe' } ]
 * }
 * 
 * Updated Mapping Configuration:
 * ------------------------------
 * const mapping = {
 *   fullName: source => `${source.firstName} ${source.lastName}`,
 *   city: 'address.city',
 *   postalCode: 'address.zipCode',
 *   age: 'age',
 *   hobbies: source => source.hobbies.map(hobby => hobby.name),
 *   firstFamilyMember: source => source.family.length > 0 
 *     ? `${source.family[0].relation}: ${source.family[0].name}` 
 *     : null
 * }
 * 
 * Output:
 * -------
 * {
 *   fullName: 'John Doe', city: 'New York', postalCode: '10001', age: 25,
 *   hobbies: ['Reading', 'Gaming'],
 *   firstFamilyMember: 'Spouse: Jane Doe'
 * }
 * 
 */
export const mapObject = (source: any, mapping: any) => {
  const target: any = EmptyObject

  for (const key in mapping) {

    if (typeof mapping[key] === 'function') {
      // If the mapping value is a function, call the function with the source object
      target[key] = mapping[key](source)
    } else {

      if (typeof mapping[key] === 'string') {

        if (mapping[key]?.indexOf('.') > 0) {

          // If the mapping value is a string, use it to access the nested properties
          const path = mapping[key]?.split('.')
          if (path?.length) {
            let value = source;
            for (const part of path) {
              value = value?.[part]
            }
            target[key] = value
          } else {
            target[key] = mapping[key]
          }
        } else {
          target[key] = mapping[key]
        }
      } else {
        target[key] = mapping[key]
      }
    }
  }
  return target;
}
