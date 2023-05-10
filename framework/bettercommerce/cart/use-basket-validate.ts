import { BASKET_VALIDATE_ENDPOINT } from '@components/utils/constants';
import fetcher from '../fetcher'

interface Props {
    basketId: string;
    cookies: any;
}

export default function useBasketValidate() {
    return async function handler({
        basketId,
        cookies,
    }: Props) {
        try {
            const response: any = await fetcher({
                url: `${BASKET_VALIDATE_ENDPOINT}`,
                method: 'GET',
                params: {
                    basketId,
                },
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
                cookies: cookies,
            });
            return response;
        } catch (error: any) {
            console.log(error);
            // throw new Error(error.message)
        }
    }
}
