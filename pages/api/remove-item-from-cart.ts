import { useRemoveItem } from '@framework/cart'
export default async (req: any, res: any) => {
  const { basketId, productId }: any = req.body.data
  try {
    console.log(req.body)
    const response = await useRemoveItem()({
      basketId,
      productId,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
