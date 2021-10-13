import commerce from '@lib/api/commerce'

export default async (req: any, res: any) => {
  try {
    console.log(req.body)
    const response = await commerce.getAllProducts()
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
