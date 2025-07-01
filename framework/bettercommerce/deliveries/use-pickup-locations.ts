import { TRADE_IN_DPD_PICKUP_LOCATIONS } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
import { BC_API_BASE_URL } from '@framework/utils/constants'

interface Props {
    currentPage?: number
    pageSize?: number
    postCode : string
    cookies: any
}

export default function usePickupLocations() {
    return async function handler({ currentPage = 1, pageSize = 20, postCode, cookies }: Props) {
        const url = new URL( `${TRADE_IN_DPD_PICKUP_LOCATIONS}?currentPage=${currentPage}&pageSize=${pageSize}&postCode=${postCode}`, BC_API_BASE_URL )
        try {  
            const response = await fetcher({
                baseUrl: BC_API_BASE_URL,
                url: url.href,
                method: 'GET', 
                cookies,
                headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
              })
            return response?.value || []
        } catch (error: any) {
            logError(error)
            throw error // Let it propagate to the middleware handler
        }
    }
}
