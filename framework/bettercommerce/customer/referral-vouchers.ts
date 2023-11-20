import { REFERRAL_VOUCHERS } from "@components/utils/constants";
import fetcher from "@framework/fetcher";

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
            console.log(error, 'err')
            // throw new Error(error.message)
        }
    }
}