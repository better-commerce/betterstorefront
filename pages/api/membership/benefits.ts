import  getBenefits from '@framework/api/operations/get-membership-benifits'

export default async (req:any, res:any) => {
  try {
    const response = await getBenefits(req?.body);
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}