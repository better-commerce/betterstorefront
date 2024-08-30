import { EmptyObject, REFERRAL_REFEREE_ENDPOINT } from "@components/utils/constants";
import fetcher from "@framework/fetcher";
import { logError } from "@framework/utils/app-util";

export default function useAddUserReferee(){
    return async function handler(referralId?: any, email?: any, cookies = EmptyObject){
        const url = REFERRAL_REFEREE_ENDPOINT + `${referralId}/register?emailOrPhoneNo=${email}`
        try {
            const response: any = await fetcher({
                url,
                method: 'post',
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