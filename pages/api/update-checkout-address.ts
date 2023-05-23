import { updateAddress } from '@framework/checkout'

const UpdateAddressApiMiddleware = async (req: any, res: any) => {
  const { basketId, model }: any = req.body
  try {
    const response = await updateAddress()({
      basketId,
      model,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
};

export default UpdateAddressApiMiddleware;