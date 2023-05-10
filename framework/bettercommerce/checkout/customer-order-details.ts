import { CUSTOMER_BASE_API } from '@components/utils/constants'
import fetcher from '../fetcher'

interface Props {
    id?: string;
    orderId?: string;
}

export default function getCustomerOrderDetails() {
    return async function handler(id?: string, orderId?: string) {
        const url = CUSTOMER_BASE_API + `${id}/orders/${orderId}`
        try {
            const response: any = await fetcher({
                url,
                method: 'get',
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
            })
            return response
        } catch (error: any) {
            console.log(error, 'err')
            // throw new Error(error.message)
        }
    }
}
