import { associateCart } from '@framework/cart'

const AssociateCartApiMiddleware = async (req: any, res: any) => {
  const { basketId, userId }: any = req.body.data
  try {
    const response = await associateCart()({
      basketId,
      userId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
};

export default AssociateCartApiMiddleware;