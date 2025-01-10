import NodeCache from 'node-cache'; // Import NodeCache
import { Redis } from '@framework/utils/redis-constants'
import { logError } from "@framework/utils/app-util"; // Utility to log errors
import { tryParseJson } from "@framework/utils/parse-util"; // Utility to parse JSON

// Initialize NodeCache instance
const cache = new NodeCache();

/**
 * Save data value into NodeCache
 * @param key Cache key
 * @param value Cache data value
 * @param expiresIn Expiration time in seconds (optional)
 */
export const saveToNode = async (key: string, value: any, expiresIn: number = Redis.Server.EXPIRES_IN): Promise<boolean> => {
  try {
    cache.set(key, JSON.stringify(value), expiresIn);
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
};

/**
 * Get data value from NodeCache
 * @param key Cache key
 * @returns Cache data value by `key` or null if not found
 */
export const getFromNode = async (key: string): Promise<any> => {
  try {
    const value = cache.get(key);
    return value ? tryParseJson(value) : null;
  } catch (error) {
    logError(error);
    return null;
  }
};

/**
 * Remove a specific key from NodeCache
 * @param key Cache key
 * @returns `true` if the key was removed, otherwise `false`
 */
export const removeFromNode = async (key: string): Promise<boolean> => {
  try {
    return cache.del(key) > 0;
  } catch (error) {
    logError(error);
    return false;
  }
};

/**
 * Clear all keys from NodeCache
 */
export const clearAllNodeKeys = async (): Promise<boolean> => {
  try {
    cache.flushAll();
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
};

export default cache;
