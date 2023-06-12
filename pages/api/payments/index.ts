import { ENABLE_SECURED_PAYMENT_PAYLOAD } from '@components/utils/constants'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import { decipherPayload } from '@framework/utils/app-util'
import { tryParseJson } from '@framework/utils/parse-util'
import usePayments from 'framework/bettercommerce/api/endpoints/payments'

const PaymentsApiMiddleware = async (req: any, res: any) => {
  let referer
  let origin: string = req?.headers?.referer
  if (origin) {
    if (origin.startsWith('http://')) {
      referer = origin.replace('http://', '')
    } else if (origin.startsWith('https://')) {
      referer = origin.replace('https://', '')
    }

    referer = referer?.substring(0, referer?.indexOf('/'))
    referer = `${origin.startsWith('https://') ? 'https' : 'http'}://${referer}`
    if (referer.endsWith('/')) {
      referer = referer.substring(0, referer.length - 1)
    }
  }
  let data = req?.body
  if (data) {
    if (ENABLE_SECURED_PAYMENT_PAYLOAD) {
      data = decipherPayload(Object.keys(data)[0])
    } else {
      data = tryParseJson(data)
    }
  }

  try {
    const response = await usePayments({
      data: data,
      params: req?.query,
      headers: req?.headers,
      cookies: req?.cookies,
      origin: referer,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default PaymentsApiMiddleware
