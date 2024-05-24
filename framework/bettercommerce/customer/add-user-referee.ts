import { REFERRAL_REFEREE_ENDPOINT } from "@components/utils/constants";
import fetcher from "@framework/fetcher";
import { logError } from "@framework/utils/app-util";

interface props{
    referralId?:string,
    email?:string
}

export default function useAddUserReferee(){
    return async function handler(referralId?:any,email?:any){
        const url = REFERRAL_REFEREE_ENDPOINT + `${referralId}/register?emailOrPhoneNo=${email}`
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
            logError(error)
            // throw new Error(error.message)
        }
    }
}