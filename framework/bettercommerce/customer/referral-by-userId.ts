import { REFERRAL_BY_USERID } from "@new-components/utils/constants";
import fetcher from "@framework/fetcher";

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
            console.log(error, 'err')
            // throw new Error(error.message)
        }
    }
}