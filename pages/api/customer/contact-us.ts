import { usePostContactUs } from '@framework/customer'
import apiRouteGuard from '../base/api-route-guard'

const contactUsApiMiddleware = async (req: any, res: any) => {
  try {
    const response: any = await usePostContactUs()(req?.body, req?.cookies)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default apiRouteGuard(contactUsApiMiddleware)
