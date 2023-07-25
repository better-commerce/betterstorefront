import store from 'store'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const storeConfigApiMiddleware = async (req: any, res: any) => {
  const { obj } = req.body
  try {
    Object.keys(obj).forEach((item: any) => {
      store.set(item, obj[item])
    })
    res.status(200).json({ success: true })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default storeConfigApiMiddleware
