import fetcher from '../../fetcher'
import { INFRA_LOG_ENDPOINT } from '@components/utils/constants'
import { ILogRequestParams } from './log-payment'
import { logError } from '@framework/utils/app-util'

export default function logRequest() {
    return async function handler(data: ILogRequestParams) {
        const url = `${INFRA_LOG_ENDPOINT}/create`
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
