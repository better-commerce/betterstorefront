/*! betterCommerceStorefront | Ⓒ 2022, Axtrum Solutions.
//@ Class: ParseUtil
//@ Inherits: <None>
//@ Implements: <None>
//@ Description: Utility class for parsing data.
*/

// Package Imports
import { DATE_TIME_FORMAT } from '@components/utils/constants'
import { CURRENCY_SYMBOL_POUND } from '@components/utils/textVariables'
import { toInteger, toNumber } from 'lodash'
import { hrtime } from 'process'
const format = require('string-format')

/**
 * Parses boolean from string.
 * @param stringValue
 * @returns
 */
export const stringToBoolean = (stringValue: string | undefined): boolean => {
  if (stringValue) {
    switch (stringValue.toLowerCase()) {
      case 'true':
      case '1':
      case 'on':
      case 'yes':
        return true
      default:
        return false
    }
  }
  return false
}

/**
 * Parses number from string.
 * @param stringValue
 * @returns
 */
export const stringToNumber = (stringValue: string | undefined): number => {
  if (stringValue) {
    try {
      return parseInt(stringValue)
    } catch (e) {
      return 0
    }
  }
  return 0
}

export const matchStrings = (
  input1: string,
  input2: string,
  ignoreCase = false
) => {
  if (input1 && input2) {
    if (ignoreCase) {
      return input1.toLowerCase() === input2.toLowerCase()
    }
    return input1 === input2
  }
  return false
}

export const tryParseJson = (json: any) => {
  if (json) {
    let parsed = {}
    try {
      parsed = JSON.parse(json)
      return parsed
    } catch (e: any) {}
  }
  return null
}

export const priceFormat = (
  value: string | number | undefined,
  decimalPlaces: number = 2
): string => {
  if (value) {
    // Not undefined
    let floatParsed: number = 0.0
    let intParsed: number = 0
    if (typeof value == 'string') {
      floatParsed = parseFloat(value)
      intParsed = parseInt(value)
    } else {
      floatParsed = value
      intParsed = toInteger(value)
    }

    if (floatParsed % intParsed === 0) {
      // zeroes after decimal point.
      return CURRENCY_SYMBOL_POUND + intParsed.toString()
    }

    // Round off to the specified {decimalPlaces}.
    return CURRENCY_SYMBOL_POUND + floatParsed.toFixed(2)
    //return Math.round(floatParsed * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  }
  return '0'
}

export const localDateToConvert = (date_to_convert_str: any) => {
  const date_to_convert = new Date(date_to_convert_str)
  const local_date = new Date()
  date_to_convert.setHours(local_date.getTimezoneOffset())
  return date_to_convert
}

export const utcDateConvert = (date_to_convert: any) => {
  if (
    date_to_convert !== undefined ||
    date_to_convert !== null ||
    date_to_convert !== ''
  ) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const date = localDateToConvert(date_to_convert),
      mnth = monthNames[date.getMonth()],
      day = ('0' + date.getDate()).slice(-2),
      year = date.getFullYear(),
      hours: any = ('0' + date.getHours()).slice(-2),
      minutes = ('0' + date.getMinutes()).slice(-2),
      seconds = ('0' + date.getSeconds()).slice(-2)
    const ampm = hours >= 12 ? 'AM' : 'PM'
    const localDate = [day, mnth, year].join('-')
    const localTime = [hours, minutes, seconds].join(':')
    const date_to = [localDate, localTime, ampm].join(' ')
    return date_to
  } else {
    return ''
  }
}

export const utcToLocalDate = (date_to_convert: Date) => {
  // date_to_convert.setMinutes(date_to_convert.getMinutes() + new Date().getTimezoneOffset());
  date_to_convert.setHours(date_to_convert.getHours() + 5)
  date_to_convert.setMinutes(date_to_convert.getMinutes() + 30)
  return date_to_convert
}

export const stringFormat = (input: string, data: object) => {
  if (input) {
    return format(input, data)
  }
  return ''
}
