import { clickAndCollect } from '@framework/shipping'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'

interface BodyProps {
  items: []
  postCode: string
}

const clickAndCollectApiMiddleware = async (req: any, res: any) => {
  const { items, postCode }: any = req.body
  try {
    const response = await clickAndCollect()({
      items,
      postCode,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(clickAndCollectApiMiddleware)
