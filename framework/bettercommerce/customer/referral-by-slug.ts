import { REFERRAL_BY_SLUG } from "@components/utils/constants";
import fetcher from "@framework/fetcher";

interface props{
    slug?:string
}

export default function useReferralBySlug(){
    return async function handler(slug?:any){
        const url = REFERRAL_BY_SLUG + `?referrerCode=${slug}`
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