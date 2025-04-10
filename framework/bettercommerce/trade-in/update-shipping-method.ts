import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'
import { TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants'
import { tryParseJson } from '@framework/utils/parse-util'
import { decrypt } from '@framework/utils/cipher'

export default function updateShippingMethod(data: any, cookies?: any) {
  async function updateShippingMethodAsync() {
    const url = `${TRADE_IN_BASE_URL}${TRADE_IN_GET_QUOTE_BY_ID}/${data?.id}/shipping-method?shippingMethods=${data?.shippingMethodId}`
    try {
      const { token } = data || {}
      const decryptedToken = tryParseJson(decrypt(token))

      const response: any = await fetcher({
        baseUrl: TRADE_IN_BASE_URL,
        url,
        method: 'PUT',
        cookies,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${decryptedToken?.accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      logError(error)
      throw error // Let it propagate to the middleware handler
    }
  }
  return updateShippingMethodAsync()
}
