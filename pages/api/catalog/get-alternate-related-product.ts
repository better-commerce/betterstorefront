import { getAltRelatedProducts } from '@framework/checkout'

const GetAltRelatedProductsApiMiddleware = async (req: any, res: any) => {
  const { slug }: any = req.body
  try {
    const response: any = await getAltRelatedProducts()(slug)
    res.status(200).json({ relatedProducts: response.result })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default GetAltRelatedProductsApiMiddleware;