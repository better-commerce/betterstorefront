import * as fs from 'fs'
import path from 'path'
import { v4 as uuid } from 'uuid'
import Cookies, { CookieAttributes } from 'js-cookie'
import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import { FetcherError } from '@commerce/utils/errors'
import {
  ERROR_LOG_ENABLED,
  ERROR_LOG_OUTPUT_DIR,
  HTTP_MESSAGES,
} from './constants'
import { Guid } from '@commerce/types'
export const setCookie = (
  name: string,
  token?: string,
  options?: CookieAttributes
) => {
  if (!token) {
    Cookies.remove(name)
  } else {
    Cookies.set(name, token, options ?? { expires: 60 * 60 * 24 * 30 })
  }
}

export const getCookie = (name: string) => Cookies.get(name)

export function getError(errors: any[], status: number) {
  errors = errors ?? [{ message: 'Failed to fetch BetterCommerce API' }]
  return new FetcherError({ errors, status })
}

async function getAsyncError(res: Response) {
  const data = await res.json()
  return getError(data.errors, res.status)
}

export const handleFetchResponse = async (res: Response) => {
  if (res.ok) {
    const { data, errors } = await res.json()

    if (errors && errors.length) {
      throw getError(errors, res.status)
    }

    return data
  }

  throw await getAsyncError(res)
}

export const getToken = () => Cookies.get('betterCommerce.token')
export const setToken = (token?: string, options?: CookieAttributes) => {
  setCookie('betterCommerce.token', token, options)
}
export const setRefreshToken = (token?: string, options?: CookieAttributes) => {
  setCookie('betterCommerce.refreshToken', token, options)
}
export const getRefreshToken = () => Cookies.get('betterCommerce.refreshToken')
export const clearTokens = () => Cookies.remove('betterCommerce.token')

export const writeFetcherLog = (request: any, response: any) => {
  const objectStrigified = (obj: any) => {
    return JSON.stringify(obj, null, '\t')
  }
  const MID = '\\.next\\server\\'
  const workingDir = __dirname
  const rootDir = workingDir.substring(0, workingDir.indexOf(MID) + MID.length)
  const dirPath = path.resolve(`${rootDir}/api-logs`)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }

  const filePath = path.resolve(`${dirPath}/${uuid()}-response.log`)
  const contents = `Request:\n${objectStrigified(
    request
  )}\n\nResponse:\n${objectStrigified(response)}`
  fs.writeFile(filePath, contents, function (err) {
    if (!err) {
      console.log(`---API Log: ${filePath}---`)
    }
  })
}

export const appLogger = (logMessageFormat?: any) => {
  const { format, createLogger } = winston
  const { timestamp, combine, errors, printf } = format

  // winston file logger transport
  const logTransport: DailyRotateFile = new DailyRotateFile({
    datePattern: 'YYYYMMDD',
    dirname: ERROR_LOG_OUTPUT_DIR,
    filename: 'app-%DATE%',
    extension: '.log',
  })

  const logFormat = printf((info: any) => {
    if (logMessageFormat) return logMessageFormat(info)
    return `${info.timestamp} [${info?.level}] "${info?.message}"`
  })

  // create logger
  const logger: winston.Logger = createLogger({
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [],
  })

  logger.add(logTransport)

  return logger
}

export const apiMiddlewareErrorHandler = (req: any, res: any, error: any) => {
  // logs will be captured when enabled
  if (ERROR_LOG_ENABLED) {
    let logMessageFormat: any

    if (error.name === 'AxiosError') {
      // request log format
      logMessageFormat = (info: any) => {
        return `${info.timestamp} [${info?.response?.status}] ${
          info?.request?.method
        }:${info?.request?.path} ${JSON.stringify(info?.request?._headers)} "${
          info?.response?.data || info?.message
        }"`
      }
    } else {
      // other log format
      logMessageFormat = (info: any) => {
        return `${info.timestamp} [${info?.level}] "${info?.message}"`
      }
    }

    // app logger
    appLogger(logMessageFormat).error(error)
  }

  // default error object
  const errorInfo: any = {
    statusCode: 500,
    message: HTTP_MESSAGES['SERVER_ERROR'],
    description: '',
  }

  // update error info on response
  if (error?.response) {
    errorInfo.statusCode = error?.response?.status || 500
    errorInfo.message =
      error?.response?.statusText || HTTP_MESSAGES['SERVER_ERROR']
    errorInfo.description = error?.response?.data || ''
  }

  // send response
  res.status(errorInfo?.statusCode).json(errorInfo)
}

export const checkIfFalsyUserId = (userId: any) => {
  return (!userId || (userId && (userId === Guid.empty || userId === 'undefined' || userId === 'null')))
}
