import { getCustomerOrderDetails } from '@framework/checkout'

const GetCustomerOrderDetailsApiMiddleware = async (req: any, res: any) => {
  const { id, orderId }: any = req.body
  try {
    const response: any = await getCustomerOrderDetails()(id, orderId)
    res.status(200).json({ order: response.result })
  } catch (error) {
    res.status(500).json({ error })
  }
};

export default GetCustomerOrderDetailsApiMiddleware;