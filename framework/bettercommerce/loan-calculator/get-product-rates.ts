import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { N8N_BASE_URL } from '@framework/utils/constants'

export default function getProductRateList(cookies?: any) {
    async function getProductRateListAsync() {
        const url = `webhook/92d75dd0-bfd3-483a-aff1-e1b061b851e4`
        try {
            const response: any = await fetcher({ baseUrl: N8N_BASE_URL, url, method: 'GET', cookies, })
            return response
        } catch (error: any) {
            logError(error)
            throw error
        }
    }
    return getProductRateListAsync()
}
