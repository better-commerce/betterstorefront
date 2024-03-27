import { REFERRAL_INFO_ENDPOINT } from "@components//utils/constants";
import fetcher from "@framework/fetcher";

interface props{

}

export default async function useReferralInfo(){
        const url = REFERRAL_INFO_ENDPOINT
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