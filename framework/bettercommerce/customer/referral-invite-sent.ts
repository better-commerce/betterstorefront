import { REFERRAL_REFEREE_ENDPOINT } from "@components//utils/constants";
import fetcher from "@framework/fetcher";

interface props{
    referralId?:string,
}

export default function useReferralInviteSent(){
    return async function handler(referralId?:any){
        const url = REFERRAL_REFEREE_ENDPOINT + `/${referralId}/capture-invites`
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