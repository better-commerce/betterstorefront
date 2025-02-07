import path from 'path'
import fs from 'fs'

//
import { clearAllRedisKeys, getFromRedis, saveToRedis, } from '@lib/caching/redis'
import { logError } from '@framework/utils/app-util'
import { Redis } from '@framework/utils/redis-constants'
import { clearAllNodeKeys, getFromNode, saveToNode } from '@lib/caching/node'

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
  return `FE_${process.env.SITE_NAME!}_${appBuildId}_${key}`
}

export const getData = async (
  keys: Array<string>
): Promise<Array<{ key: string; value: any }> | null> => {
  const data = new Array<any>()
  const promises = new Array<Promise<any>>()
  keys?.forEach(async (key: string) => {
    promises.push(
      new Promise(async (resolve: any) => {
        let value = null
        if (!Redis.Server.REDIS_CACHE_DISABLED) {
          value = await getFromRedis(key)
        } else {
          value = await getFromNode(key)
        }
        data.push({ key, value })
        resolve()
      })
    )
  })
  if (promises.length) {
    await Promise.all(promises)
    return data
  }
  return null
}

export const getDataByUID = async (
  keys: Array<string>
): Promise<Array<{ key: string; value: any }> | null> => {
  const data = new Array<any>()
  const promises = new Array<Promise<any>>()

  keys?.forEach(async (key: string) => {
    promises.push(
      new Promise(async (resolve: any) => {
        const computedKey = getRedisUID(key)
        let value = null
        if (!Redis.Server.REDIS_CACHE_DISABLED) {
          value = await getFromRedis(computedKey)
        } else {
          value = await getFromNode(computedKey)
        }
        data.push({ key, value })
        resolve()
      })
    )
  })

  if (promises.length) {
    await Promise.all(promises)
    return data
  }
  return null
}

export const setData = async (data: Array<any>) => {
  const promises = new Array<Promise<any>>()
  data?.forEach(async (x: any) => {
    promises.push(
      new Promise(async (resolve: any) => {
        const computedKey = getRedisUID(x.key)
        if (!Redis.Server.REDIS_CACHE_DISABLED) {
          await saveToRedis(computedKey, x.value)
        } else {
          await saveToNode(computedKey, x.value)
        }
        resolve()
      })
    )
  })

  if (promises.length) {
    await Promise.all(promises)
  }
}

export const resetRedisCache = async () => {
  if (!Redis.Server.REDIS_CACHE_DISABLED) {
    await clearAllRedisKeys()
  } else {
    await clearAllNodeKeys()
  }
}

export const parseDataValue = (data: any, key: string): any => {
  return data?.find((x: any) => x.key === key)?.value
}

export const containsArrayData = (data: any) => {
  return data?.length > 0
}
