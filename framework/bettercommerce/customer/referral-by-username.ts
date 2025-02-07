import { EmptyObject, REFERRAL_BY_USERNAME } from "@components/utils/constants";
import fetcher from "@framework/fetcher";
import { logError } from "@framework/utils/app-util";

export default function useReferralByEmail(){
    return async function handler(username?:any, cookies = EmptyObject){
        const url = REFERRAL_BY_USERNAME + `?username=${username}`
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
}