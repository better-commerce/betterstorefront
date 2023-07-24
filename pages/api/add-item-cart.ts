import { useAddItem } from '@framework/cart'
import { apiMiddlewareErrorHandler } from '@framework/utils'

export default async function (req: any, res: any) {
  const {
    basketId,
    productId,
    qty,
    manualUnitPrice,
    displayOrder,
    stockCode,
  }: any = req.body.data
  try {
    const response = await useAddItem()({
      basketId,
      productId,
      qty,
      manualUnitPrice,
      displayOrder,
      stockCode,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}
