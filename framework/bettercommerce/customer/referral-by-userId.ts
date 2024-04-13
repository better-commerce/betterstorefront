import { REFERRAL_BY_USERID } from "@components/utils/constants";
import fetcher from "@framework/fetcher";
import { logError } from "@framework/utils/app-util";

interface props{
    userId?:string
}

export default function useReferralByEmail(){
    return async function handler(userId?:any){
        const url = REFERRAL_BY_USERID + `?userid=${userId}`
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