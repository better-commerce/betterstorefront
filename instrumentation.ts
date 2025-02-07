import type NodeCache from 'node-cache';

/**
 * This function is called once at server startup to initialize server-wide
 * resources, such as caches and database connections. It is not called for
 * every incoming request.
 *
 * It is only called if the runtime is 'nodejs' or 'edge', and not if it is
 * 'experimental-edge'.
 *
 * @returns {Promise<void>}
 */
export async function register() {
    if (['nodejs', 'edge'].includes(process.env.NEXT_RUNTIME!)) {
        const NodeCache = (await import('node-cache')).default;
        const config: NodeCache.Options = {
            stdTTL: process.env.NODE_ENV === 'production' ? 0 : 60 * 60,
        };

        global.cacheConfigs = new NodeCache(config);
        global.cacheUser = new NodeCache(config);
        //other caches

        // Other things that should only happen once at server startup.
        // firebase-admin connect, etc
    }
}