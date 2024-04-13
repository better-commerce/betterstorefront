import { REFERRAL_BY_USERNAME } from "@components/utils/constants";
import fetcher from "@framework/fetcher";
import { logError } from "@framework/utils/app-util";

interface props{
    username?:string
}

export default function useReferralByEmail(){
    return async function handler(username?:any){
        const url = REFERRAL_BY_USERNAME + `?username=${username}`
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
            logError(error)
            // throw new Error(error.message)
        }
    }
}