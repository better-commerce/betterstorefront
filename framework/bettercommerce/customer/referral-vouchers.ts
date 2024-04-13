import { REFERRAL_VOUCHERS } from "@components/utils/constants";
import fetcher from "@framework/fetcher";
import { logError } from "@framework/utils/app-util";

interface props{
    userId?:string
}

export default function useReferralVouchers(){
    return async function handler(userId:string){
        const url = REFERRAL_VOUCHERS + `?userId=${userId}`
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