import { REFERRAL_BY_EMAIL } from "@new-components/utils/constants";
import fetcher from "@framework/fetcher";

interface props{
    email?:string
}

export default function useReferralByEmail(){
    return async function handler(email?:any){
        const url = REFERRAL_BY_EMAIL + `?email=${email}`
        try {
            const response: any = await fetcher({
                url,
                method: 'post',
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