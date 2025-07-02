import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { N8N_BASE_URL } from '@framework/utils/constants'

export default function getLoanDetails(rateCardProductId: string, deposit: number, price: number, cookies?: any) {
    async function getLoanDetailsAsync() {
        const url = `webhook/b057637f-6cea-445f-8925-67c39d99d8e0`
        try {
            const response: any = await fetcher({ baseUrl: N8N_BASE_URL, url, method: 'POST', data: { rateCardProductId, deposit, price, }, cookies, })
            return response
        } catch (error: any) {
            logError(error)
            throw error
        }
    }
    return getLoanDetailsAsync()
}
