import { getPaymentMethods } from '@framework/payment'
export default async (req: any, res: any) => {
  const { countryCode, currencyCode, basketId }: any = req.body
  try {
    const response = await getPaymentMethods()({
      countryCode,
      currencyCode,
      basketId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
