import { TRADE_IN_GET_QUOTE_BY_ID } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { TRADE_IN_BASE_URL } from '@framework/utils/constants'

export default async function postQuoteAddress(
  data: any,
  id: string,
  cookies?: any
) {
  const url = new URL(
    `${TRADE_IN_GET_QUOTE_BY_ID}/${id}/address`,
    TRADE_IN_BASE_URL
  )
  try {
    const response: any = await fetcher({
      baseUrl: TRADE_IN_BASE_URL,
      url: url.href,
      method: 'PUT',
      data,
      cookies,
      headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID },
      //logRequest: true,
    })

    return response
  } catch (error: any) {
    console.error('Error in postQuoteAddress API:', error)
    throw new Error(`Failed to save address: ${error.message}`)
  }
}
