import getProductAvailibiltyInStoresByPostCode from '@framework/store-locator/get-product-availability-by-postalCode'

export default async (req: any, res: any) => {
  const data = req.body
  try {
    const response = await getProductAvailibiltyInStoresByPostCode(data)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
