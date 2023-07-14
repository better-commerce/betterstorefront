import { useBulkAdd } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function (req: any, res: any) {
  const { basketId, products }: any = req.body.data
  try {
    const response = await useBulkAdd()({
      basketId,
      products,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
