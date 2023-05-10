import { clearCache } from '../utils/cached-fetch';
export default function resetCacheOperation() {
    async function resetCache(keys: Array<string>) {
        try {
            if (keys?.length) {
                keys?.forEach((key: string) => {
                    clearCache(key);
                });
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }
    return resetCache;
}
