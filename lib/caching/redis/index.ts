import IORedis from 'ioredis'

// Util imports
import { tryParseJson } from '@framework/utils/parse-util'
import { Redis } from '@framework/utils/redis-constants'
import { logError } from '@framework/utils/app-util'

/**
 * Create connection to Redis server
 * @returns `redis` server instance
 */
const connectRedisServer = () => {
  if (Redis.Server.REDIS_CACHE_DISABLED) {
    return false
  }
  try {
    const redisInstance = new IORedis({
      host: Redis.Server.HOST,
      port: Redis.Server.PORT,
      password: Redis.Server.PWD,
      tls: {},
    })
    return redisInstance
  } catch (error) {
    logError(error)
    return null
  }
}

/**
 * Redis server instance
 */
const redisServer = connectRedisServer()

/**
 * Save data value into Redis server
 * @param key Redis key
 * @param value Redis data value
 */
export const saveToRedis = async (key: any, value: any) => {
  if (!redisServer) return false
  await redisServer.set(key, JSON.stringify(value), 'EX', Redis.Server.EXPIRES_IN)
}

/**
 * Get data value from Redis server
 * @param key - Redis key
 * @returns Redis data value by `key`
 */
export const getFromRedis = async (key: any) => {
  if (!redisServer) return false
  const value = await redisServer.get(key)
  return tryParseJson(value)
}

/**
 * Remove all data or keys existed in Redis server
 */
export const clearAllRedisKeys = async () => {
  if (!redisServer) return false
  try {
    const keys = await redisServer.keys('*')
    await Promise.all(keys.map((key) => redisServer.del(key)))
  } catch (error) {
    logError(error)
  }
}

export default redisServer
