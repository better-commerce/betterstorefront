import path from 'path'
import fs from 'fs'

//
import {
  clearAllRedisKeys,
  getFromRedis,
  saveToRedis,
} from '@lib/redis/service'
import { logError } from './app-util'
import { Redis } from './redis-constants'

/**
 * Create app build ID
 * @returns App build ID
 */
const getAppBuildId = () => {
  try {
    let appBuildId = 'e69a' // default app build ID
    if (process.env.NODE_ENV !== 'development') {
      const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID')
      appBuildId = fs.readFileSync(buildIdPath, 'utf8')
    }
    return appBuildId
  } catch (error) {
    logError(error)
    return null
  }
}

/**
 * Create a unique Redis key name suffixed with app build ID
 * @param key Redis key
 * @returns Redis key or identifier
 */
const getRedisUID = (key: any) => {
  const appBuildId = getAppBuildId()
  return `${key}_${appBuildId}`
}

export const getData = async (
  keys: Array<string>
): Promise<Array<{ key: string; value: any }> | null> => {
  if (!Redis.Server.REDIS_CACHE_DISABLED) {
    const data = new Array<any>()
    const promises = new Array<Promise<any>>()
    keys?.forEach(async (key: string) => {
      promises.push(
        new Promise(async (resolve: any) => {
          const value = await getFromRedis(key)
          data.push({ key, value })
          resolve()
        })
      )
    })
    if (promises.length) {
      await Promise.all(promises)
      return data
    }
  }
  return null
}

export const getDataByUID = async (
  keys: Array<string>
): Promise<Array<{ key: string; value: any }> | null> => {
  if (!Redis.Server.REDIS_CACHE_DISABLED) {
    const data = new Array<any>()
    const promises = new Array<Promise<any>>()

    keys?.forEach(async (key: string) => {
      promises.push(
        new Promise(async (resolve: any) => {
          const value = await getFromRedis(getRedisUID(key))
          data.push({ key, value })
          resolve()
        })
      )
    })

    if (promises.length) {
      await Promise.all(promises)
      return data
    }
  }
  return null
}

export const setData = async (data: Array<any>) => {
  if (!Redis.Server.REDIS_CACHE_DISABLED) {
    const promises = new Array<Promise<any>>()

    data?.forEach(async (x: any) => {
      promises.push(
        new Promise(async (resolve: any) => {
          await saveToRedis(getRedisUID(x.key), x.value)
          resolve()
        })
      )
    })

    if (promises.length) {
      await Promise.all(promises)
    }
  }
}

export const resetRedisCache = async () => {
  if (!Redis.Server.REDIS_CACHE_DISABLED) {
    await clearAllRedisKeys()
  }
}

export const parseDataValue = (data: any, key: string): any => {
  return data?.find((x: any) => x.key === key)?.value
}

export const containsArrayData = (data: any) => {
  return data?.length > 0
}
