import { getUserAddress } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const getUserAddressApiMiddleWare = async (req: any, res: any) => {
  const { postCode }: any = req.body
  try {
    const response = await getUserAddress()({
      postCode,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getUserAddressApiMiddleWare)