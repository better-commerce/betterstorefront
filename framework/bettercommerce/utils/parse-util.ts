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
    if (stringValue) {
        switch (stringValue.toLowerCase()) {
            case "true":
            case "1":
            case "on":
            case "yes":
                return true;
            default:
                return false;
        }
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