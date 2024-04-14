import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
interface Props {
    basketId?: string
    cookies?: any
}

export default function useDeleteCart() {
    return async function handler({ basketId, cookies }: Props) {
        try {
            const response: any = await fetcher({
                url: `${BASKET_ENDPOINT}/${basketId}/delete`,
                method: 'delete',
                params: { basketId, },
                cookies,
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
            })
            //url changed according to api20 get all baskets api
            return response
        } catch (error: any) {
            logError(error)
            //throw new Error(error.message)
        }
    }
}
