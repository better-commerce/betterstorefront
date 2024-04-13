import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { Guid } from '@commerce/types'
interface Props {
    basketId: string
    basketName: string
    cookies?: any
}

export default function useCreateCart() {
    return async function handler({ basketId, basketName, cookies, }: Props) {
        try {
            const response: any = await fetcher({
                url: `${BASKET_ENDPOINT}/${basketId}/items/add`,
                method: 'put',
                data: { basketId, basketName, productId: Guid.empty },
                cookies,
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
                logRequest: true,
            })
            return { ...response.result, ...{ message: response.message } }
        } catch (error: any) {
            console.log(error)
            // throw new Error(error.message)
        }
    }
}
