import { useBulkAdd } from '@framework/cart'
export default async (req: any, res: any) => {
  const { basketId, products }: any = req.body
  try {
    const response = await useBulkAdd()({
      basketId,
      products,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
