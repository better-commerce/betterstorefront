import { ORDERS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'

interface Props {
    data: any;
    cookies: any;
}

export default function useCancelOrderLine() {
    return async function handler({
        data,
        cookies,
    }: Props) {
        try {
            const response: any = await fetcher({
                url: `${ORDERS_ENDPOINT}/cancel-lineunit`,
                method: 'put',
                data: data,
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
                cookies: cookies,
            });
            return response?.result;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}
