import { updateShipping } from '@framework/checkout'

const UpdateShippingApiMiddleware = async (req: any, res: any) => {
  const { basketId, countryCode, shippingId }: any = req.body
  try {
    const response = await updateShipping()({
      basketId,
      countryCode,
      shippingId,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
};

export default UpdateShippingApiMiddleware;