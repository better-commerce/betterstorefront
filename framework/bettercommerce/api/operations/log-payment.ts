import { logError } from '@framework/utils/app-util'
import fetcher from '../../fetcher'
import { INFRA_LOG_ENDPOINT } from '@components/utils/constants'

export interface ILogRequestParams {
  readonly shortMessage: string
  readonly fullMessage: string | null
  readonly ipAddress: string
  readonly objectId: string
  readonly requestData: string | null
  readonly pageUrl: string
  readonly referrerUrl?: string
  readonly userId?: string
  readonly userName?: string
  readonly additionalinfo1?: string
  readonly additionalinfo2?: string
  readonly logLevelId: number
  readonly paymentGatewayId?: number
}

export default function logRequest() {
  return async function handler(data: ILogRequestParams) {
    const url = `${INFRA_LOG_ENDPOINT}/payment-log`
    try {
      const response: any = await fetcher({
        url,
        data: data,
        method: 'POST',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response
    } catch (error: any) {
      logError(error)
    }
  }
}
