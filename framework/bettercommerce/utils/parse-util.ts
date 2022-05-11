/*! betterCommerceStorefront | Ⓒ 2022, Axtrum Solutions.
//@ Class: ParseUtil
//@ Inherits: <None>
//@ Implements: <None>
//@ Description: Utility class for parsing data.
*/

/**
 * Parses boolean from string.
 * @param stringValue 
 * @returns 
 */
export const stringToBoolean = (stringValue: string | undefined): boolean => {
    try {
        if (stringValue) {
            return JSON.parse(stringValue);
        }
    }
    catch (e) {
        return false;
    }
    return false;
};

/**
 * Parses number from string.
 * @param stringValue 
 * @returns 
 */
export const stringToNumber = (stringValue: string | undefined): number => {
    if (stringValue) {
        try {
            return parseInt(stringValue);
        } catch (e) {
            return 0;
        }
    }
    return 0;
};