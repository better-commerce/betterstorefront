import { REFERRAL_SEARCH } from "@components//utils/constants";
import fetcher from "@framework/fetcher";

interface props{
    name?:string,
    email?:string
}

export default function useReferralBySearch(){
    return async function handler(name?:any,email?:any){
        const url = REFERRAL_SEARCH + `?searchText=${name}`
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