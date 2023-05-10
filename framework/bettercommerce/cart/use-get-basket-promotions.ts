import { GET_BASKET_PROMOTIONS_ENDPOINT } from '@components/utils/constants';
import fetcher from '../fetcher';

interface Props {
    basketId?: string;
    cookies?: any;
}

export default function useGetBasketPromotions() {
    return async function handler({ basketId, cookies }: Props) {
        try {
            const response: any = await fetcher({
                url: `${GET_BASKET_PROMOTIONS_ENDPOINT}`,
                method: 'GET',
                params: { basketId: basketId },
                cookies,
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
            });
            return response?.result;
        } catch (error: any) {
            console.log(error);
            // throw new Error(error.message)
        }
    }
}
