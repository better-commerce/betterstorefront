import { getUserCarts } from '@framework/cart'

const GetUserCartsApiMiddleware = async (req: any, res: any) => {
  const { userId }: any = req.query
  try {
    const response = await getUserCarts()({
      userId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
};

export default GetUserCartsApiMiddleware;