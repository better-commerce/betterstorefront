import { BASKET_ENDPOINT, EmptyGuid, EmptyObject } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

interface Props {
    basketId: string
    basketName: string
    userId: string
    cookies?: any
}

export default function useCreateCart() {
    return async function handler({ basketId, basketName, userId, cookies }: Props) {
        try {
            const response: any = await fetcher({
                url: `${BASKET_ENDPOINT}/create`,
                method: 'POST',
                data: {
                    basketId,
                    basketName,
                    userId,
                    companyId: EmptyGuid,
                },
                cookies,
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
            })
            return response
        } catch (error: any) {
            logError(error)
            // throw new Error(error.message)
        }
    }
}
