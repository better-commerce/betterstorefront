/*! betterCommerceStorefront | Ⓒ 2022, Axtrum Solutions.
//@ Class: ParseUtil
//@ Inherits: <None>
//@ Implements: <None>
//@ Description: Utility class for parsing data.
*/

// Package Imports
import moment from 'moment'
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
export const roundToDecimalPlaces = (
  value: any,
  decimalPlaces: number = 2
): any => {
  const decPlaces = Math.pow(10, decimalPlaces)
  return Math.round((value + Number.EPSILON) * decPlaces) / decPlaces
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
  decimalPlaces: number = 2,
  currencySymbol: string = ''
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
      intParsed = parseInt(value.toString())
    }

    if (floatParsed % intParsed === 0) {
      // zeroes after decimal point.
      return currencySymbol + intParsed.toString()
    }

    // Round off to the specified {decimalPlaces}.
    return currencySymbol + floatParsed.toFixed(2)
    //return Math.round(floatParsed * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  }
  return currencySymbol + '0'
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

export const dateFormat = (date: string | Date, format: string): string => {
  let dt = date
  if (typeof date === 'string') {
    dt = new Date(date)
  }

  return moment(dt).format(format)
}

export const deliveryDateFormat = (date: string | Date): string => {
  return dateFormat(date, 'DD/MM/yyyy')
}

export const getSecondsInMinutes = (minutes: number): number => {
  return Math.floor(minutes * 60)
}

export const formatFromToDates = (from: string, to: string) => {
  // const [fromDateStr, toDateStr] = input.split(',').map(dateStr => dateStr.trim());

  const fromDate = new Date(from)
  const toDate = new Date(to)

  const fromDay = fromDate.getDate()
  const toDay = toDate.getDate()

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const fromMonth = months[fromDate.getMonth()]
  const toMonth = months[toDate.getMonth()]
  let formatted

  if (fromMonth === toMonth) {
    formatted = `${fromDay}${getOrdinalSuffix(
      fromDay
    )} - ${toDay}${getOrdinalSuffix(toDay)} ${fromMonth}`
  } else {
    formatted = `${fromDay}${getOrdinalSuffix(
      fromDay
    )} ${fromMonth} - ${toDay}${getOrdinalSuffix(toDay)} ${toMonth}`
  }

  return formatted
}

const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return 'th'
  }
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export const eddDateFormat = (date: string | Date) => {
  let dt: any = date
  if (typeof date === 'string') {
    dt = new Date(date)
  }

  // ensure the date is displayed with today and yesterday
  return moment(dt).calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: '[last] dddd',
    lastDay: '[yesterday], D MMMM',
    sameDay: '[today], D MMMM',
    nextDay: '[tomorrow], D MMMM',
    nextWeek: 'dddd, D MMMM',

    // when the date is further away, use from-now functionality
    sameElse: 'dddd, D MMMM',
  })
}
