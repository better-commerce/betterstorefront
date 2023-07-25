import { loqateUser } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const loqateUserApiMiddleWare = async (req: any, res: any) => {
  const { postCode, country }: any = req.body
  try {
    const response = await loqateUser()({
      postCode,
      country,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(loqateUserApiMiddleWare)
