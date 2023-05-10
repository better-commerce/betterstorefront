import { cancelOrder } from '@framework/api/operations'

export default async function cancelOrderAPI(req: any, res: any) {
  try {
    const response = await cancelOrder()(req.body.id)
    res.status(200).json({ response })
  } catch (error) {
    res.status(500).json({ error })
  }
}
