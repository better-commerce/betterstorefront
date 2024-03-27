import { logError } from '@framework/utils/app-util'
import fetcher from '../../fetcher'
import { EmptyObject, REVIEW_SERVICE_BASE_API } from '@components//utils/constants'
import { REVIEW_BASE_URL } from '@framework/utils/constants'

export default function useGetReviewSummary() {
    async function useGetReviewSummaryAsync({ cookies }: any) {
        try {
            const res = await fetcher({
                baseUrl: REVIEW_BASE_URL,
                url: `${REVIEW_SERVICE_BASE_API}/summary`,
                method: 'post',
                cookies,
            })
            return res?.Result
        } catch (error: any) {
            logError(error)
            return EmptyObject
        }
    }
    return useGetReviewSummaryAsync
}
