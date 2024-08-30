import  getVoucher from '@framework/api/operations/download-voucher'

export default async (req:any, res:any) => {
  try {
    const response = await getVoucher(req?.body, req?.cookies);
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}