import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler, checkIfFalsyUserId } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { HTTP_MESSAGES } from '@framework/utils/constants'
const createAddressApiMiddleware = async (req: any, res: any) => {
  try {
    if (checkIfFalsyUserId(req?.body?.userId)) {
      return res.status(400).json({ message: HTTP_MESSAGES['INVALID_USER_ID'] })
    }
    const response = await commerce.createAddress({
      query: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(createAddressApiMiddleware)
