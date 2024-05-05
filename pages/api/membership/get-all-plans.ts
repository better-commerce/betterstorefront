import getAllPlans from '@framework/membership/get-all-plans'

export default async (req:any, res:any) => {
  try {
    const response = await getAllPlans(req.body, req.cookies);
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}