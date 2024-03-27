import { RETURNS_ENDPOINT } from '@components//utils/constants'
import fetcher from '../fetcher'

interface Props {
    data: any;
    cookies: any;
}

export default function useReturnOrderLine() {
    return async function handler({
        data,
        cookies,
    }: Props) {
        try {
            const response: any = await fetcher({
                url: `${RETURNS_ENDPOINT}/create`,
                method: 'post',
                data: data,
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
                cookies: cookies,
            });
            if(response.success){
                return response?.result;
            } else {
                return response?.errors;
            }
            
        } catch (error: any) {
            console.log(error);
            // throw new Error(error.message)
        }
    }
}
