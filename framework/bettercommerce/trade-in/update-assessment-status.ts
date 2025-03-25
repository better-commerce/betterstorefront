import {
  TRADE_IN_GET_ASSESSMENT_STATUS,
  TRADE_IN_GET_QUOTE_BY_ID,
} from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'

export default function updateAssessmentStatus(
  id: string,
  status: number,
  cookies: any
) {
  async function updateAssessmentStatusAsync() {
    const url = new URL(
      `${TRADE_IN_GET_ASSESSMENT_STATUS}/${id}/review`,
      TRADE_IN_BASE_URL
    )

    try {
      const response = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url: url.href,
        data: { assessmentStatus: status }, // status is sent as a number
        method: 'POST', // Changed from GET to POST to properly send a JSON payload
        cookies,
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
        logRequest: true,
      })
      return response
    } catch (error) {
      logError(error)
    }
  }
  return updateAssessmentStatusAsync()
}
