import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler, checkIfFalsyUserId } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { HTTP_MESSAGES } from '@framework/utils/constants'
const editAddressApiMiddleware = async (req: any, res: any) => {
  try {
    if (checkIfFalsyUserId(req?.body?.userId)) {
      return res.status(400).json({ message: HTTP_MESSAGES['INVALID_USER_ID'] })
    }
    console.group(req.body, 'req body')
    const response = await commerce.editAddress({
      query: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(editAddressApiMiddleware)
