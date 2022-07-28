import fetcher from '../fetcher';
import { BETTERCMS_BASE_URL } from '@framework/utils/constants';
import { PAGE_CONTENT_ENDPOINT } from '@components/utils/constants';

interface Props {
    id?: string;
    slug?: any;
    cookies?: any;
}

export default function usePageContent() {
    return async function handler({ id, slug, cookies }: Props) {
        const params = {
            slug: slug,
        }
        try {
            const response: any = await fetcher({
                url: `${PAGE_CONTENT_ENDPOINT}/${id}`,
                method: 'get',
                params: params,
                cookies,
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
                baseUrl: BETTERCMS_BASE_URL,
            });
            return response.result;
        } catch (error: any) {
            console.log(error);
            // throw new Error(error.message)
        }
    }
}
