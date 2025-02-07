import { EmptyObject, REFERRAL_INFO_ENDPOINT } from "@components/utils/constants";
import fetcher from "@framework/fetcher";
import { logError } from "@framework/utils/app-util";

export default async function useReferralInfo(cookies = EmptyObject){
        const url = REFERRAL_INFO_ENDPOINT
        try {
            const response: any = await fetcher({
                url,
                method: 'get',
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
                cookies
            })
            return response
        } catch (error: any) {
            logError(error)
            // throw new Error(error.message)
        }
}