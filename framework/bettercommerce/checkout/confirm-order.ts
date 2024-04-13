import { CHECKOUT_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

interface Props {
  basketId?: string
  model?: any
  cookies?: any
}

export default function useConfirmOrder() {
  return async function handler({ basketId, model, cookies }: Props) {
    const url = CHECKOUT_ENDPOINT + `/${basketId}/convert`
    try {
      const response: any = await fetcher({
        url,
        method: 'post',
        data: model,
        cookies,
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
