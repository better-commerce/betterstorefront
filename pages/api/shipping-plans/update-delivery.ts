import { updateDelivery } from '@framework/shipping'

const UpdateDeliveryApiMiddleware = async (req: any, res: any) => {
  const { data, id }: any = req.body
  try {
    const response = await updateDelivery()({
      data,
      id,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
};

export default UpdateDeliveryApiMiddleware;