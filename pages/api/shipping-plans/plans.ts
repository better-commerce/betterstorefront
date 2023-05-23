import { getShippingPlans } from '@framework/shipping'

interface BodyProps {
  model: any
}

const GetShippingPlansApiMiddleware = async (req: any, res: any) => {
  const { model }: any = req.body
  try {
    const response = await getShippingPlans()({
      model,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
};

export default GetShippingPlansApiMiddleware;