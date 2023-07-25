import { useAddUserReferee } from '@framework/customer'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../../base/api-route-guard'

const addUserRefereeApiMiddleware = async (req: any, res: any) => {
  const { referralId, email }: any = req.body
  try {
    const response: any = await useAddUserReferee()(referralId, email)
    res.status(200).json({ referralDetails: response.result })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(addUserRefereeApiMiddleware)
