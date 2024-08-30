import { EmptyObject, REFERRAL_SEARCH } from "@components/utils/constants";
import fetcher from "@framework/fetcher";
import { logError } from "@framework/utils/app-util";

interface props{
    name?:string,
    email?:string
}

export default function useReferralBySearch(){
    return async function handler(name?:any,email?:any, cookies = EmptyObject){
        const url = REFERRAL_SEARCH + `?searchText=${name}`
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